<template>
  <div class="flex flex-col gap-1">
    <div class="relative flex flex-col-reverse gap-1">
      <input
        v-model="model"
        :type="props.type ?? 'text'"
        :id
        :disabled="props.disabled"
        :placeholder="props.placeholder"
        :auto-focus="props.autoFocus"
        :class="inputStyles({ status, icon }, $attrs.class as string)"
        v-bind="filteredAttrs"
      />
      <uixy-icon
        v-if="props.icon"
        @click="emits('icon-click')"
        :name="props.icon"
        :class="
          iconStyles({
            status,
            icon,
            targetable: !!hasIconClickEmit,
          })
        "
      />
      <label v-if="props.label" :for="id" :class="labelStyles({ status })">
        {{ props.label }}
      </label>
    </div>
    <div v-if="!props.hideHelper" class="h-4">
      <animate-presence mode="wait" :initial="false">
        <motion.div
          :initial="{ opacity: 0, y: '-4px' }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: '-4px' }"
          :transition="{ duration: 0.125 }"
          :key="status"
        >
          <p :class="helperStyles({ status })">{{ text }}</p>
        </motion.div>
      </animate-presence>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { UixyIcon } from "../Icon";
  import { AnimatePresence, motion } from "motion-v";
  import type { UixyInputEmits, UixyInputProps } from "./Input.types";
  import {
    inputStyles,
    iconStyles,
    labelStyles,
    helperStyles,
  } from "./Input.styles";

  const props = defineProps<UixyInputProps>();

  const emits = defineEmits<UixyInputEmits>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const model = defineModel<string>();

  const instance = getCurrentInstance();

  const id = useId();

  const hasIconClickEmit = computed(() => !!instance?.vnode.props?.onIconClick);

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

  const icon = computed(() =>
    props.icon ? props.iconPositon ?? "right" : "none"
  );
</script>
