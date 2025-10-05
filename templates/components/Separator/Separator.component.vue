<template>
  <div
    role="none"
    :class="separatorStyles({ variant: props.variant }, $attrs.class as string)"
    v-bind="filteredAttrs"
  />
</template>

<script setup lang="ts">
  import { separatorStyles } from "./Separator.styles";
  import { type UixySeparatorProps } from "./Separator.types";

  const props = defineProps<UixySeparatorProps>();

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });
</script>
