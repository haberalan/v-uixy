<template>
  <client-only>
    <teleport to="body">
      <animate-presence>
        <motion.div
          v-if="open"
          ref="rootRef"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.15, ease: 'easeInOut' }"
          :class="modalStyles($attrs.class as string)"
          :style="{ zIndex }"
          :[modalAttr]="''"
          data-uixy-overlay
          @click.self="handleClick"
        >
          <motion.div
            class="flex w-full justify-center"
            :initial="{ scale: 0.8 }"
            :animate="{ scale: 1 }"
            :exit="{ scale: 0.8 }"
            :transition="{ duration: 0.15, ease: 'easeInOut' }"
            @click.self="handleClick"
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
  import { useModalLayer, MODAL_ATTR, getTopModalEl } from "~/composables";

  const props = defineProps<UixyModalProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const open = defineModel<boolean>();

  const rootRef = ref<HTMLElement>();

  const {
    zIndex,
    isTopModal,
    open: openLayer,
    close: closeLayer,
  } = useModalLayer();

  const modalAttr = computed(() => (open.value ? MODAL_ATTR : null));

  const handleClick = () => {
    if (props.persistent || props.loading) return;

    open.value = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isTopModal.value) return;

    if (e.key === "Escape") {
      handleClick();
      return;
    }
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return;
      const form =
        rootRef.value?.querySelector("form") ??
        getTopModalEl()?.querySelector("form");
      form?.requestSubmit();
    }
  };

  watch(
    open,
    (isOpen) => {
      if (isOpen) {
        openLayer();
        window.addEventListener("keydown", handleKeyDown);
      } else {
        closeLayer();
        window.removeEventListener("keydown", handleKeyDown);
      }
    },
    { immediate: true },
  );

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
    closeLayer();
  });
</script>
