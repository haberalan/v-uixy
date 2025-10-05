<template>
  <div class="flex flex-col gap-2">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { type UixyAccordionProps } from "./Accordion.types";

  const props = defineProps<UixyAccordionProps>();

  const accordionItems = reactive(new Set<string | number>());

  const registerAccordionItem = (id: string) => accordionItems.add(id);

  const unregisterAccordionItem = (id: string) => accordionItems.delete(id);

  const toggleAccordionItem = (id: string) => {
    if (props.multiple)
      return accordionItems.has(id)
        ? accordionItems.delete(id)
        : accordionItems.add(id);

    if (accordionItems.has(id)) return accordionItems.delete(id);

    accordionItems.clear();
    accordionItems.add(id);
  };

  const isAccordionItemOpen = (id: string) => accordionItems.has(id);

  provide("registerAccordionItem", registerAccordionItem);
  provide("unregisterAccordionItem", unregisterAccordionItem);
  provide("toggleAccordionItem", toggleAccordionItem);
  provide("isAccordionItemOpen", isAccordionItemOpen);
</script>
