<template>
  <teleport to="body">
    <div
      class="pointer-events-none fixed bottom-0 right-0 z-10 w-full max-w-[520px] min-h-screen md:pb-8 md:pr-8 flex flex-col justify-end"
    >
      <ul
        class="flex h-full max-w-[100vw] flex-col justify-end gap-4 px-2 py-4 md:p-0"
        aria-live="polite"
      >
        <animate-presence :initial="false" mode="popLayout">
          <motion.li
            v-for="alert in alerts"
            :key="alert.id"
            layout
            class="pointer-events-auto"
            :initial="{ opacity: 0, y: 50, scale: 0.5 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }"
            role="alert"
          >
            <uixy-alert-item
              v-bind="alert"
              :key="alert.id"
              @close-alert="close(alert.id)"
              @pause-timer="pauseTimer(alert.id)"
              @resume-timer="resumeTimer(alert.id)"
            />
          </motion.li>
        </animate-presence>
      </ul>
    </div>
  </teleport>
  <slot />
</template>

<script setup lang="ts">
  import { motion, AnimatePresence } from "motion-v";
  import UixyAlertItem from "./AlertItem.component.vue";
  import type { UixyAlertItemProps, UixyAlertProps } from "./Alert.types";
  import { v4 as uuidv4 } from "uuid";

  defineProps<UixyAlertProps>();

  const alerts = ref<UixyAlertItemProps[]>([]);

  const ALERT_DURATION = 8000;

  interface AlertTimeout {
    id: string;
    timeout: ReturnType<typeof setTimeout> | null;
    remaining: number;
    startedAt: number;
  }

  const timeouts = reactive<AlertTimeout[]>([]);

  const startTimeout = (entry: AlertTimeout) => {
    entry.startedAt = Date.now();
    entry.timeout = setTimeout(() => {
      alerts.value = alerts.value.filter((a) => a.id !== entry.id);
      const index = timeouts.findIndex((t) => t.id === entry.id);
      if (index !== -1) timeouts.splice(index, 1);
    }, entry.remaining);
  };

  const push = (alert: Omit<UixyAlertItemProps, "id">) => {
    const id = uuidv4();

    alerts.value = [
      ...alerts.value,
      {
        ...alert,
        id,
      },
    ];

    const entry: AlertTimeout = {
      id,
      timeout: null,
      remaining: ALERT_DURATION,
      startedAt: Date.now(),
    };

    timeouts.push(entry);
    startTimeout(entry);
  };

  const close = (id: string) => {
    alerts.value = alerts.value.filter((alert) => {
      if (alert.id === id) {
        const index = timeouts.findIndex((t) => t.id === id);
        if (index !== -1) {
          const timeout = timeouts[index];
          if (timeout.timeout) clearTimeout(timeout.timeout);
          timeouts.splice(index, 1);
        }
        return false;
      }
      return true;
    });
  };

  const pauseTimer = (id: string) => {
    const entry = timeouts.find((t) => t.id === id);
    if (!entry || !entry.timeout) return;

    clearTimeout(entry.timeout);
    entry.timeout = null;
    entry.remaining = Math.max(
      entry.remaining - (Date.now() - entry.startedAt),
      0,
    );
  };

  const resumeTimer = (id: string) => {
    const entry = timeouts.find((t) => t.id === id);
    if (!entry || entry.timeout) return;

    startTimeout(entry);
  };

  provide("push-alert", push);
  provide("close-alert", close);
</script>
