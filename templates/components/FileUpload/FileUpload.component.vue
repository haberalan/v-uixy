<template>
  <div class="flex w-full flex-col gap-2">
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="onInputChange"
    />

    <div
      v-if="props.variant === 'button'"
      class="flex flex-wrap items-center gap-3"
    >
      <uixy-button
        :variant="props.buttonVariant ?? 'secondary'"
        :size="props.buttonSize ?? 'md'"
        :icon="props.icon ?? 'upload'"
        :disabled="props.disabled"
        type="button"
        @click="open"
      >
        {{ props.label ?? "Upload file" }}
      </uixy-button>
      <span v-if="props.hint" :class="dropzoneHintStyles()">{{
        props.hint
      }}</span>
    </div>

    <div
      v-else
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :aria-disabled="props.disabled || undefined"
      :class="dropzoneStyles({ state })"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <uixy-icon
        :name="props.icon ?? 'cloud-upload'"
        :class="dropzoneIconStyles({ state })"
      />

      <div class="flex flex-col gap-0.5">
        <span :class="dropzoneLabelStyles({ state })">
          {{ props.label ?? "Click to upload or drag and drop" }}
        </span>
        <span v-if="props.hint" :class="dropzoneHintStyles()">{{
          props.hint
        }}</span>
      </div>
    </div>

    <div v-if="!props.hideList && model.length" :class="fileListStyles()">
      <div
        v-for="(file, index) in model"
        :key="fileKey(file)"
        :class="fileRowStyles()"
      >
        <uixy-icon :name="fileIconFor(file)" :class="fileIconStyles()" />
        <span :class="fileNameStyles()">{{ file.name }}</span>
        <span :class="fileSizeStyles()">{{ formatSize(file.size) }}</span>
        <uixy-icon-button
          icon="close"
          variant="tertiary"
          size="sm"
          :disabled="props.disabled"
          aria-label="Remove file"
          @click="removeFile(index)"
        />
      </div>
    </div>

    <animate-presence mode="wait" :initial="false">
      <motion.div
        v-if="!!text"
        class="overflow-hidden"
        :initial="{ height: 0 }"
        :animate="{ height: 'auto' }"
        :exit="{ height: 0 }"
        :transition="{ duration: 0.1, ease: 'easeInOut' }"
      >
        <animate-presence mode="wait" :initial="false">
          <motion.p
            :key="status + text"
            :class="helperStyles({ status })"
            :initial="{ opacity: 0, y: -4 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: 4 }"
            :transition="{ duration: 0.12, ease: 'easeInOut', delay: 0.1 }"
          >
            {{ text }}
          </motion.p>
        </animate-presence>
      </motion.div>
    </animate-presence>
  </div>
</template>

<script setup lang="ts">
  import { UixyIcon } from "../Icon";
  import { UixyButton } from "../Button";
  import { UixyIconButton } from "../IconButton";
  import { AnimatePresence, motion } from "motion-v";
  import type { IconName } from "~/types/icons";
  import type {
    UixyFileUploadProps,
    UixyFileUploadEmits,
    UixyFileRejection,
  } from "./FileUpload.types";
  import {
    dropzoneStyles,
    dropzoneIconStyles,
    dropzoneLabelStyles,
    dropzoneHintStyles,
    fileListStyles,
    fileRowStyles,
    fileIconStyles,
    fileNameStyles,
    fileSizeStyles,
    helperStyles,
  } from "./FileUpload.styles";

  const props = defineProps<UixyFileUploadProps>();

  const emits = defineEmits<UixyFileUploadEmits>();

  const model = defineModel<File[]>({ default: () => [] });

  const inputRef = ref<HTMLInputElement>();

  const dragDepth = ref(0);

  const lastError = ref<string | null>(null);

  const isDragging = computed(() => dragDepth.value > 0);

  const status = computed(() => {
    if (props.disabled) return "disabled";

    if (props.status === "error" || lastError.value) return "error";

    return "default";
  });

  const state = computed(() => {
    if (props.disabled) return "disabled";

    if (isDragging.value) return "dragging";

    if (props.status === "error" || lastError.value) return "error";

    return "default";
  });

  const text = computed(() => {
    if (status.value === "error")
      return props.errorText ?? lastError.value ?? "";

    if (status.value === "default") return props.helperText ?? "";

    return "";
  });

  const fileIconFor = (file: File): IconName => {
    if (file.type.startsWith("image/")) return "image";

    return "file";
  };

  const fileKey = (file: File) =>
    `${file.name}-${file.size}-${file.lastModified}`;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(
      units.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024)),
    );

    const value = bytes / Math.pow(1024, i);

    return `${Number.isInteger(value) ? value : value.toFixed(1)} ${units[i]}`;
  };

  const matchesAccept = (file: File) => {
    const accept = props.accept?.trim();
    if (!accept) return true;

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return accept
      .split(",")
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean)
      .some((token) => {
        if (token.startsWith(".")) return name.endsWith(token);
        if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
        return type === token;
      });
  };

  const rejectionMessage = (rejections: UixyFileRejection[]) => {
    const reasons = new Set(rejections.map((r) => r.reason));
    const parts: string[] = [];

    if (reasons.has("type")) parts.push("unsupported type");
    if (reasons.has("size") && props.maxSize)
      parts.push(`larger than ${formatSize(props.maxSize)}`);
    if (reasons.has("count")) parts.push("over the file limit");

    const count = rejections.length;

    return `${count} file${count > 1 ? "s" : ""} rejected${
      parts.length ? ` — ${parts.join(", ")}` : ""
    }.`;
  };

  const open = () => {
    if (props.disabled) return;

    inputRef.value?.click();
  };

  const handleFiles = (fileList: FileList | null) => {
    if (props.disabled || !fileList) return;

    const limit = props.multiple ? props.maxFiles : 1;
    const current = props.multiple ? model.value.slice() : [];
    const accepted: File[] = [];
    const rejections: UixyFileRejection[] = [];

    for (const file of Array.from(fileList)) {
      if (!matchesAccept(file)) {
        rejections.push({ file, reason: "type" });
      } else if (props.maxSize !== undefined && file.size > props.maxSize) {
        rejections.push({ file, reason: "size" });
      } else if (
        limit !== undefined &&
        current.length + accepted.length >= limit
      ) {
        rejections.push({ file, reason: "count" });
      } else {
        accepted.push(file);
      }
    }

    if (accepted.length) {
      const next = props.multiple ? [...current, ...accepted] : [accepted[0]!];
      model.value = next;
      lastError.value = null;
      emits("change", next);
    }

    if (rejections.length) {
      lastError.value = rejectionMessage(rejections);
      emits("reject", rejections);
    }

    if (inputRef.value) inputRef.value.value = "";
  };

  const onInputChange = (event: Event) => {
    handleFiles((event.target as HTMLInputElement).files);
  };

  const onDrop = (event: DragEvent) => {
    dragDepth.value = 0;
    if (props.disabled) return;

    handleFiles(event.dataTransfer?.files ?? null);
  };

  const onDragEnter = () => {
    if (props.disabled) return;

    dragDepth.value += 1;
  };

  const onDragLeave = () => {
    if (props.disabled) return;

    dragDepth.value = Math.max(0, dragDepth.value - 1);
  };

  const removeFile = (index: number) => {
    if (props.disabled) return;

    const next = model.value.slice();
    next.splice(index, 1);

    model.value = next;
    lastError.value = null;

    emits("change", next);
  };

  const clear = () => {
    model.value = [];
    lastError.value = null;

    emits("change", []);
  };

  defineExpose({ open, clear });
</script>
