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
            <slot :close="handleLeave" />
          </motion.div>
        </div>
      </motion.div>
    </animate-presence>
  </teleport>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { v4 as uuidv4 } from "uuid";
  import { usePosition } from "~/composables";
  import { onWatcherCleanup } from "vue";
  import type { UixyPopoverProps } from "./Popover.types";

  const props = defineProps<UixyPopoverProps>();

  const POPOVER_GROUP_EVENT = "uixy:popover-group-open";
  const instanceId = uuidv4();

  const { active, handleOpen, handleLeave, styles, refElement } = usePosition({
    direction: props.direction ?? "bottom",
    align: props.align ?? "center",
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (
      refElement.value &&
      (!refElement.value.contains(e.target as Node) || props.closeOnClick)
    )
      handleLeave();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") handleLeave();
  };

  watch(
    () => active.value,
    (isActive, prevVal) => {
      if (prevVal) return;

      if (isActive && props.group) {
        window.dispatchEvent(
          new CustomEvent(POPOVER_GROUP_EVENT, { detail: { id: instanceId } }),
        );
      }

      requestAnimationFrame(() => {
        window.addEventListener("click", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
      });

      onWatcherCleanup(() => {
        window.removeEventListener("click", handleClickOutside);
        window.removeEventListener("keydown", handleKeyDown);
      });
    },
  );

  const handleGroupOpen = (e: Event) => {
    const event = e as CustomEvent<{ id: string }>;
    if (event.detail.id !== instanceId) handleLeave();
  };

  onMounted(() => {
    if (props.group) {
      window.addEventListener(POPOVER_GROUP_EVENT, handleGroupOpen);
    }
  });

  onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("keydown", handleKeyDown);
    if (props.group) {
      window.removeEventListener(POPOVER_GROUP_EVENT, handleGroupOpen);
    }
  });
</script>
