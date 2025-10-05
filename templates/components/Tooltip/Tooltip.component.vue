<template>
  <div
    class="relative"
    @click="handleOpen"
    @mouseenter="handleOpen"
    @mouseleave="handleLeave"
  >
    <slot />
    <teleport to="body">
      <animate-presence>
        <motion.div
          v-if="active"
          class="max-w-[100vw]"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0, transition: { delay: 0.1 } }"
          :transition="{
            duration: 0.15,
            ease: 'easeInOut',
            delay: props.delay ?? 0.3,
          }"
          :style="{
            ...styles,
          }"
        >
          <div ref="refElement">
            <motion.div
              :class="$attrs.class"
              :initial="{ y: 4, scale: 0.8 }"
              :animate="{ y: 0, scale: 1 }"
              :exit="{ opacity: 0, scale: 0.8, transition: { delay: 0.1 } }"
              :transition="{
                duration: 0.15,
                ease: 'easeInOut',
                delay: props.delay ?? 0.3,
              }"
            >
              <slot name="content" />
            </motion.div>
          </div>
        </motion.div>
      </animate-presence>
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { motion, AnimatePresence } from "motion-v";
  import type { UixyTooltipProps } from "./Tooltip.types";
  import { usePosition } from "~/composables";

  const props = defineProps<UixyTooltipProps>();

  const { active, handleOpen, handleLeave, styles, refElement } = usePosition({
    direction: props.direction ?? "top",
  });
</script>
