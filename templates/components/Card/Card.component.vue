<template>
  <uixy-link v-if="props.link" v-bind="props.link">
    <div :class="cardStyles($attrs.class as string)" v-bind="filteredAttrs">
      <slot />
    </div>
  </uixy-link>
  <div
    v-else
    :class="cardStyles($attrs.class as string)"
    v-bind="filteredAttrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { UixyLink } from "../Link";
  import { type UixyCardProps } from "./Card.types";
  import { cardStyles } from "./Card.styles";

  const props = defineProps<UixyCardProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });
</script>
