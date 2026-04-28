<template>
  <client-only>
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
  </client-only>
</template>

<script setup lang="ts">
  import type { UixyModalProps } from "./Modal.types";
  import { modalStyles } from "./Modal.styles";
  import { AnimatePresence, motion } from "motion-v";

  const props = defineProps<UixyModalProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const open = defineModel<boolean>();

  const handleClick = () => {
    if (props.persistent) return;

    open.value = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClick();
      return;
    }
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return;
      const modalEl = document.querySelector("[data-modal]");
      const form = modalEl?.querySelector("form");
      form?.requestSubmit();
    }
  };

  const toggleSiblingsInert = (enable?: boolean) => {
    if (typeof document === "undefined") return;

    const modalEl = document.querySelector(
      "[data-modal]",
    ) as HTMLElement | null;

    Array.from(document.body.children).forEach((el) => {
      if (modalEl && (el === modalEl || el.contains(modalEl))) return;

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
      if (isOpen) {
        window.addEventListener("keydown", handleKeyDown);
      } else {
        window.removeEventListener("keydown", handleKeyDown);
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
</script>
