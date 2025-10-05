<template>
  <teleport to="body">
    <animate-presence>
      <motion.div
        v-if="open"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.15, ease: 'easeInOut' }"
        :class="modalStyles($attrs.class as string)"
        data-modal
        @click.self="handleClick"
        @keydown{esc}="handleClick"
      >
        <motion.div
          :initial="{ scale: 0.8 }"
          :animate="{ scale: 1 }"
          :exit="{ scale: 0.8 }"
          :transition="{ duration: 0.15, ease: 'easeInOut' }"
        >
          <slot />
        </motion.div>
      </motion.div>
    </animate-presence>
  </teleport>
</template>

<script setup lang="ts">
  import type { UixyModalProps } from "./Modal.types";
  import { modalStyles } from "./Modal.styles";
  import { AnimatePresence, motion } from "motion-v";

  defineProps<UixyModalProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const open = defineModel<boolean>();

  const handleClick = () => {
    open.value = false;
  };

  const toggleSiblingsInert = (enable?: boolean) => {
    Array.from(document.body.children).forEach((el) => {
      if (el === document.querySelector("[data-modal]")) return;

      if (el.hasAttribute("data-modal")) return;

      if (enable) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  };

  watch(
    open,
    (isOpen) => {
      toggleSiblingsInert(isOpen);
    },
    { immediate: true }
  );
</script>
