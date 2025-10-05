<template>
  <div class="border-b border-solid border-gray-500 py-2">
    <slot name="header" :toggle="handleToggle" :keydown="handleKeydown">
      <button
        class="group flex w-full cursor-pointer select-none items-center justify-between gap-4 rounded-1 py-1"
        @click="handleToggle"
        @keydown="handleKeydown"
        :aria-expanded="isOpen"
        :aria-controls="`controls-${id}`"
        :aria-labelledby="`header-${id}`"
      >
        <p class="text-lg font-400 group-hover:underline" :id="`header-${id}`">
          {{ props.header }}
        </p>

        <div
          class="transition flex items-center justify-center"
          :class="{
            '-rotate-180': isOpen,
          }"
        >
          <uixy-icon name="chevron-down" class="size-6" />
        </div>
      </button>
    </slot>
    <animate-presence mode="wait">
      <motion.div
        v-if="isOpen"
        :initial="{ opacity: 0, height: 0 }"
        :animate="{ opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0.3, height: 0 }"
        :transition="{ duration: 0.15 }"
        class="text-sm text-gray-800 dark:text-gray-300 overflow-hidden"
        :id="`controls-${id}`"
      >
        <slot></slot>
      </motion.div>
    </animate-presence>
  </div>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { UixyIcon } from "../Icon";
  import { type UixyAccordionItemProps } from "./Accordion.types";

  const props = defineProps<UixyAccordionItemProps>();

  const id = useId();

  const registerAccordionItem = inject("registerAccordionItem") as (
    id: string
  ) => void;

  const unregisterAccordionItem = inject("unregisterAccordionItem") as (
    id: string
  ) => void;

  const toggleAccordionItem = inject("toggleAccordionItem") as (
    id: string
  ) => void;

  const isAccordionItemOpen = inject("isAccordionItemOpen") as (
    id: string
  ) => boolean;

  if (
    !registerAccordionItem ||
    !unregisterAccordionItem ||
    !toggleAccordionItem ||
    !isAccordionItemOpen
  ) {
    throw new Error("AccordionItem must be used inside Accordion.");
  }

  const isOpen = computed(() => isAccordionItemOpen(id));

  const handleToggle = () => toggleAccordionItem(id);

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    e.preventDefault();
    handleToggle();
  };

  onMounted(() => {
    if (props.defaultOpen) toggleAccordionItem(id);
  });
</script>
