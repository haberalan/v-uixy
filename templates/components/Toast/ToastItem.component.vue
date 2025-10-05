<template>
  <uixy-card
    class="relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-6 bg-gray-200 py-[6px] shadow-md dark:bg-black"
  >
    <div class="flex gap-4">
      <div class="flex flex-col gap-1">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          {{ props.content }}
        </div>
      </div>
    </div>
  </uixy-card>
</template>

<script setup lang="ts">
  import type { UixyToastItemProps } from "./Toast.types";
  import { UixyCard } from "../Card";

  const props = defineProps<UixyToastItemProps>();
</script>
