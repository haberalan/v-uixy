<template>
  <teleport to="body">
    <div
      class="pointer-events-none fixed bottom-0 right-0 z-50 w-full items-center md:bottom-2 min-h-screen flex flex-col justify-end"
    >
      <ul
        class="flex flex-col items-center justify-center gap-2 px-2 py-4 md:p-0"
        aria-live="polite"
      >
        <animate-presence :initial="false" mode="popLayout">
          <motion.li
            v-for="toast in toasts"
            :key="toast.id"
            class="pointer-events-auto w-max text-nowrap"
            layout
            :initial="{ opacity: 0, y: 50, scale: 0.5 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }"
            role="Toast"
          >
            <uixy-toast-item v-bind="toast" :key="toast.id" />
          </motion.li>
        </animate-presence>
      </ul>
    </div>
  </teleport>
  <slot />
</template>

<script setup lang="ts">
  import type { UixyToastItemProps, UixyToastProps } from "./Toast.types";
  import { motion, AnimatePresence } from "motion-v";
  import { v4 as uuidv4 } from "uuid";
  import { UixyToastItem } from ".";

  defineProps<UixyToastProps>();

  const toasts = ref<UixyToastItemProps[]>([]);

  const timeouts = reactive<
    { id: string; timeout: ReturnType<typeof setTimeout> }[]
  >([]);

  const push = (toast: Omit<UixyToastItemProps, "id">) => {
    const id = uuidv4();

    toasts.value = [
      ...toasts.value,
      {
        ...toast,
        id,
      },
    ];

    timeouts.push({
      id,
      timeout: setTimeout(() => {
        toasts.value = toasts.value.filter((a) => a.id !== id);
      }, 8000),
    });
  };

  const close = (id: string) => {
    toasts.value = toasts.value.filter((toast) => {
      if (toast.id === id) {
        const timeout = timeouts.find((t) => t.id === id);
        if (timeout) {
          clearTimeout(timeout.timeout);
        }
        return false;
      }
      return true;
    });
  };

  provide("push-toast", push);
  provide("close-toast", close);
</script>
