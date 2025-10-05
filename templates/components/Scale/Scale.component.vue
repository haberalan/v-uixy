<template>
  <motion.div
    :animate="{ scale }"
    :transition="{ duration }"
    class="flex min-h-screen flex-col"
  >
    <slot />
  </motion.div>
</template>

<script setup lang="ts">
  import { motion } from "motion-v";

  const scale = ref<number>(1);
  const duration = ref<number>(0.3);

  const setScale = (val: number) => {
    scale.value = val;
  };

  const setDuration = (val: number) => {
    duration.value = val;
  };

  provide("setScale", setScale);
  provide("setDuration", setDuration);
</script>
