<template>
  <div :class="skeletonStyles($attrs.class as string)" v-bind="filteredAttrs" />
</template>

<script setup lang="ts">
  import type { UixySkeletonProps } from "./Skeleton.types";
  import { skeletonStyles } from "./Skeleton.styles";

  defineProps<UixySkeletonProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => ({
    ...attrs,
    class: undefined,
  }));
</script>
