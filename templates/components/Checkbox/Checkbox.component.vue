<template>
  <label :class="checkboxStyles($attrs.class as string)">
    <div class="relative flex items-center justify-center">
      <input
        ref="inputRef"
        type="checkbox"
        :disabled="props.disabled"
        v-model="checked"
        :class="inputStyles({ indeterminate: !!props.indeterminate })"
      />
      <animate-presence>
        <motion.div
          v-if="checked || props.indeterminate"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.08, ease: 'easeInOut' }"
          class="pointer-events-none absolute"
        >
          <uixy-icon
            :name="props.indeterminate ? 'minus' : 'check'"
            :class="
              iconStyles({
                disabled: !!props.disabled,
                checked: checked || props.indeterminate,
              })
            "
          />
        </motion.div>
      </animate-presence>
    </div>
    <p
      v-if="$slots.default"
      :class="labelStyles({ disabled: !!props.disabled })"
    >
      <slot />
    </p>
  </label>
</template>

<script setup lang="ts">
  import { motion, AnimatePresence } from "motion-v";
  import { UixyIcon } from "../Icon";
  import type { UixyCheckboxProps } from "./Checkbox.types";
  import {
    checkboxStyles,
    inputStyles,
    iconStyles,
    labelStyles,
  } from "./Checkbox.styles";

  const props = defineProps<UixyCheckboxProps>();

  const checked = defineModel<boolean>("checked");

  const inputRef = ref<HTMLInputElement | null>(null);

  watchEffect(() => {
    if (inputRef.value) {
      inputRef.value.indeterminate = !!props.indeterminate;
    }
  });
</script>
