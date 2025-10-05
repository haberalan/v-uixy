<template>
  <label class="flex items-center gap-2">
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        :disabled="props.disabled"
        v-model="model"
        class="box-content h-4 w-8 cursor-pointer appearance-none rounded-full border-2 border-gray-300 bg-gray-300 transition-all duration-200 ease-in-out checked:border-black checked:bg-black disabled:cursor-default disabled:border-gray-500 disabled:bg-gray-500 dark:border-gray-900 dark:bg-gray-900 dark:checked:border-gray-100 dark:checked:bg-gray-100 dark:disabled:border-gray-700 dark:disabled:bg-gray-700"
      />
      <animate-presence :initial="false">
        <motion.div
          :animate="{
            left: model ? 'auto' : 0,
            right: model ? 0 : 'auto',
          }"
          :transition="{ duration: 0.1, ease: 'easeInOut' }"
          :class="switchStyles(
              {
                disabled: !!props.disabled,
                checked: !!model,
              },
              $attrs.class as string,
            )"
        ></motion.div>
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
  import { AnimatePresence, motion } from "motion-v";
  import type { UixySwitchProps } from "./Switch.types";
  import { switchStyles, labelStyles } from "./Switch.styles";

  const props = defineProps<UixySwitchProps>();

  const model = defineModel<boolean>();
</script>
