<template>
  <label :class="checkboxStyles($attrs.class as string)">
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        :disabled="props.disabled"
        v-model="checked"
        class="size-4 cursor-pointer appearance-none rounded-1 border border-black transition-all duration-150 ease-in-out checked:bg-black hover:bg-gray-300 checked:hover:bg-gray-800 disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-300 checked:disabled:bg-gray-500 dark:border-gray-100 dark:checked:bg-gray-100 dark:hover:bg-gray-800 dark:checked:hover:bg-gray-200 dark:disabled:border-gray-600 dark:disabled:bg-gray-900 dark:checked:disabled:bg-gray-600"
      />
      <animate-presence>
        <motion.div
          v-if="checked"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.08, ease: 'easeInOut' }"
          class="pointer-events-none absolute"
        >
          <uixy-icon
            name="check"
            :class="
              iconStyles({
                disabled: !!props.disabled,
                checked: checked,
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
  import { checkboxStyles, iconStyles, labelStyles } from "./Checkbox.styles";

  const props = defineProps<UixyCheckboxProps>();

  const checked = defineModel<boolean>("checked");
</script>
