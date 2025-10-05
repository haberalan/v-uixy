<template>
  <slot name="trigger" @click="handleOpen" />
  <teleport to="body">
    <animate-presence>
      <motion.div
        v-if="active"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.15, ease: 'easeInOut' }"
        :style="styles"
      >
        <div ref="refElement">
          <motion.div
            :initial="{ y: 4, scale: 0.8 }"
            :animate="{ y: 0, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.8 }"
            :transition="{ duration: 0.15, ease: 'easeInOut' }"
          >
            <slot />
          </motion.div>
        </div>
      </motion.div>
    </animate-presence>
  </teleport>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { usePosition } from "~/composables";
  import { onWatcherCleanup } from "vue";
  import type { UixyPopoverProps } from "./Popover.types";

  const props = defineProps<UixyPopoverProps>();

  const { active, handleOpen, handleLeave, styles, refElement } = usePosition({
    direction: props.direction ?? "bottom",
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (
      refElement.value &&
      (!refElement.value.contains(e.target as Node) || props.closeOnClick)
    )
      handleLeave();
  };

  watch(
    () => active.value,
    (_, prevVal) => {
      if (prevVal) return;

      requestAnimationFrame(() => {
        window.addEventListener("click", handleClickOutside);
      });

      onWatcherCleanup(() => {
        window.removeEventListener("click", handleClickOutside);
      });
    }
  );

  onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
  });
</script>
