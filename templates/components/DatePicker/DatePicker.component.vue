<template>
  <div class="flex w-full flex-col gap-1">
    <label v-if="props.label" :class="labelStyles({ status })">
      {{ props.label }}
    </label>

    <div
      ref="triggerRef"
      role="button"
      :tabindex="props.disabled ? -1 : 0"
      :aria-expanded="active"
      :class="triggerStyles({ status, open: active })"
      @click="onTriggerClick"
      @keydown.enter.prevent="onTriggerClick"
      @keydown.space.prevent="onTriggerClick"
    >
      <uixy-icon
        :name="props.icon ?? 'calendar'"
        :class="triggerIconStyles({ disabled: props.disabled })"
      />
      <span
        :class="
          triggerValueStyles({ placeholder: !model, disabled: props.disabled })
        "
      >
        {{ displayValue }}
      </span>
      <uixy-icon
        v-if="model && !props.disabled"
        name="close"
        class="h-4 w-4 shrink-0 cursor-pointer text-gray-400 hover:text-black dark:text-gray-600 dark:hover:text-white"
        @click.stop="clear"
      />
    </div>

    <div v-if="!props.hideHelper && helperText" class="h-4">
      <p :class="helperStyles({ status })">{{ helperText }}</p>
    </div>

    <teleport to="body">
      <animate-presence>
        <motion.div
          v-if="active"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.15, ease: 'easeInOut' }"
          :style="positionStyles"
        >
          <div ref="refElement">
            <motion.div
              :initial="{ y: 4, scale: 0.96, opacity: 0 }"
              :animate="{ y: 0, scale: 1, opacity: 1 }"
              :exit="{ opacity: 0, scale: 0.96 }"
              :transition="{ duration: 0.15, ease: 'easeInOut' }"
              :class="panelStyles()"
            >
              <div class="flex items-stretch gap-3">
                <uixy-calendar
                  :model-value="model"
                  :year="viewYear"
                  :month="viewMonth"
                  :start-of-week="props.startOfWeek"
                  :is-date-disabled="props.isDateDisabled"
                  @update:model-value="onDayPick"
                />

                <div v-if="props.withTime" class="flex items-center">
                  <uixy-time-wheel
                    v-model="timeParts"
                    :hour-cycle="24"
                    :with-seconds="props.withSeconds"
                  />
                </div>
              </div>

              <div :class="footerStyles()">
                <uixy-button variant="tertiary" size="sm" @click="clear">
                  Clear
                </uixy-button>
                <uixy-button variant="primary" size="sm" @click="handleLeave">
                  Done
                </uixy-button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </animate-presence>
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { usePosition } from "~/composables";
  import { UixyIcon } from "../Icon";
  import { UixyButton } from "../Button";
  import { UixyCalendar } from "../Calendar";
  import UixyTimeWheel from "./TimeWheel.vue";
  import type { UixyDatePickerProps } from "./DatePicker.types";
  import {
    triggerStyles,
    triggerValueStyles,
    triggerIconStyles,
    labelStyles,
    helperStyles,
    panelStyles,
    footerStyles,
  } from "./DatePicker.styles";
  import {
    formatDate,
    timePartsOf,
    withTimeParts,
    type UixyTimeParts,
  } from "./DatePicker.utils";

  const props = defineProps<UixyDatePickerProps>();

  const model = defineModel<Date | null>();

  const {
    active,
    styles: positionStyles,
    refElement,
    handleOpen,
    handleLeave,
  } = usePosition({ direction: props.direction ?? "bottom" });

  const triggerRef = ref<HTMLElement>();

  const draftTime = ref<UixyTimeParts>(timePartsOf(model.value));

  const status = computed(() => {
    if (props.disabled) return "disabled";

    return props.status ?? "default";
  });

  const helperText = computed(() => {
    if (status.value === "error") return props.errorText ?? "";

    return props.helperText ?? "";
  });

  const displayValue = computed(() => {
    if (!model.value) return props.placeholder ?? "Select date";

    return formatDate(model.value, {
      withTime: props.withTime,
      withSeconds: props.withSeconds,
    });
  });

  const viewBase = computed(() => model.value ?? new Date());

  const viewYear = computed(() => viewBase.value.getFullYear());

  const viewMonth = computed(() => viewBase.value.getMonth());

  const timeParts = computed<UixyTimeParts>({
    get: () => (model.value ? timePartsOf(model.value) : draftTime.value),
    set: (parts) => {
      draftTime.value = parts;

      if (!model.value) return;

      model.value = withTimeParts(model.value, parts);
    },
  });

  const onTriggerClick = (event: MouseEvent | KeyboardEvent) => {
    if (props.disabled) return;

    handleOpen(event as MouseEvent);
  };

  const onDayPick = (date: Date | null | undefined) => {
    if (!date) return;

    model.value = withTimeParts(date, draftTime.value);

    if (!props.withTime && props.closeOnSelect) handleLeave();
  };

  const clear = () => {
    model.value = null;

    draftTime.value = { hour: 0, minute: 0, second: 0 };
  };

  watch(active, (isActive) => {
    if (isActive) draftTime.value = timePartsOf(model.value);
  });

  const onDocClick = (event: MouseEvent) => {
    if (!active.value) return;

    const target = event.target as Node;

    const clickedInside =
      refElement.value?.contains(target) || triggerRef.value?.contains(target);

    if (!clickedInside) handleLeave();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (active.value && event.key === "Escape") handleLeave();
  };

  onMounted(() => {
    window.addEventListener("click", onDocClick);
    window.addEventListener("keydown", onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("click", onDocClick);
    window.removeEventListener("keydown", onKeyDown);
  });
</script>
