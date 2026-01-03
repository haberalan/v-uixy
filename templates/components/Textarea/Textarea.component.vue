<template>
  <div class="flex flex-col gap-1">
    <div class="flex flex-col-reverse gap-1">
      <textarea
        :id
        v-model="model"
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :auto-focus="props.autoFocus"
        :rows="props.rows ?? 3"
        :max-length="props.maxLength"
        :class="textareaStyles(
              { status, noResize: !!props.noResize },
              $attrs.class as string,
            )"
        v-bind="filteredAttrs"
      />
      <label v-if="props.label" :for="id" :class="labelStyles({ status })">
        {{ props.label }}
      </label>
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
            :class="
              helperStyles({
                status,
                align: props.alignText ?? 'left',
              })
            "
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
  import { motion, AnimatePresence } from "motion-v";
  import type { UixyTextareaProps } from "./Textarea.types";
  import { textareaStyles, labelStyles, helperStyles } from "./Textarea.styles";

  const props = defineProps<UixyTextareaProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const model = defineModel<string>();

  const id = useId();

  const status = computed(() =>
    props.disabled ? "disabled" : props.status ?? "default"
  );

  const text = computed(
    () =>
      ({
        error: props.errorText,
        default: props.helperText,
        disabled: "",
        valid: "",
      }[props.status ?? "default"])
  );
</script>
