<template>
  <nuxt-link v-bind="cleanedProps">
    <slot />
  </nuxt-link>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import type { UixyLinkProps } from "./Link.types";

  const props = defineProps<UixyLinkProps>();

  const cleanedProps = computed(() => {
    const result: Record<string, unknown> = {};
    for (const key in props) {
      const value = props[key as keyof UixyLinkProps];

      if (value || key === "to") result[key] = value;
    }

    return result;
  });
</script>
