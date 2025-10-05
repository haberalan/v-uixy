<template>
  <component v-if="iconComponent" :is="iconComponent" />
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import { ICONS } from "~/types/icons";
  import type { UixyIconProps } from "./Icon.types";

  const props = defineProps<UixyIconProps>();

  const icons = import.meta.glob("~/assets/icons/**/*.svg", { eager: true });

  const iconKey = computed(() => `/assets/icons/${ICONS[props.name]}.svg`);

  const iconComponent = computed(() => {
    const mod = icons[iconKey.value] as { default: any } | undefined;
    return mod?.default || null;
  });
</script>
