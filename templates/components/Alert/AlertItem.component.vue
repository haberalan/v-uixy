<template>
  <uixy-card
    class="relative flex w-full items-center justify-between gap-8 overflow-hidden bg-gray-200 py-4 shadow-xs dark:bg-black"
  >
    <div class="flex gap-4">
      <uixy-icon v-if="props.icon" :name="props.icon" class="size-6 shrink-0" />
      <div class="flex flex-col gap-1">
        <p class="text-lg font-500">{{ props.label }}</p>
        <div
          v-if="props.content"
          class="text-sm text-gray-700 dark:text-gray-300"
        >
          {{ props.content }}
        </div>
      </div>
    </div>
    <div v-if="props.action">
      <uixy-button v-bind="props.action" />
    </div>
    <div v-if="props.showClose" class="absolute right-2 top-1">
      <uixy-icon-button
        icon="close"
        variant="quaternary"
        size="sm"
        @click="emit('close-alert')"
      />
    </div>
    <motion.div
      v-if="props.timer"
      class="absolute bottom-0 left-0 h-[2px] bg-black dark:bg-gray-100"
      :style="{ width }"
    />
  </uixy-card>
</template>

<script setup lang="ts">
  import { motion, useMotionValue, animate } from "motion-v";
  import { UixyButton, UixyIconButton, UixyIcon, UixyCard } from "..";
  import type { UixyAlertItemProps } from "./Alert.types";

  const props = defineProps<UixyAlertItemProps>();

  const emit = defineEmits<{
    (event: "close-alert"): void;
  }>();

  const width = useMotionValue("100%");

  onMounted(() => {
    animate(width, "0%", {
      duration: 8,
      ease: "linear",
    });
  });
</script>
