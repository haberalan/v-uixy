<template>
  <div
    :class="loaderStyles({ size: props.size }, $attrs.class as string)"
  ></div>
</template>

<script setup lang="ts">
  import type { UixyLoaderProps } from "./Loader.types";
  import { loaderStyles } from "./Loader.styles";

  const props = defineProps<UixyLoaderProps>();
</script>
