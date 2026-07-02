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
        :class="triggerValueStyles({ placeholder: !hasValue, disabled: props.disabled })"
      >
        {{ displayValue }}
      </span>
      <uixy-icon
        v-if="hasValue && !props.disabled"
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
                  :year="viewYear"
                  :month="viewMonth"
                  :start-of-week="props.startOfWeek"
                  :is-date-disabled="props.isDateDisabled"
                  :range-start="model.start"
                  :range-end="model.end"
                  :range-hover="rangeHover"
                  @update:model-value="onDayPick"
                  @day-hover="onDayHover"
                  @day-leave="rangeHover = null"
                />

                <div v-if="props.withTime" class="flex gap-3">
                  <div class="flex flex-col items-center gap-1">
                    <span :class="sectionLabelStyles()">Start</span>
                    <uixy-time-wheel
                      v-model="startTime"
                      :hour-cycle="24"
                      :with-seconds="props.withSeconds"
                      :disabled="!model.start"
                    />
                  </div>
                  <div class="flex flex-col items-center gap-1">
                    <span :class="sectionLabelStyles()">End</span>
                    <uixy-time-wheel
                      v-model="endTime"
                      :hour-cycle="24"
                      :with-seconds="props.withSeconds"
                      :disabled="!model.end"
                    />
                  </div>
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
  import { UixyTimeWheel } from "../DatePicker";
  import type {
    UixyDateRange,
    UixyDateRangePickerProps,
  } from "./DateRangePicker.types";
  import {
    triggerStyles,
    triggerValueStyles,
    triggerIconStyles,
    labelStyles,
    helperStyles,
    panelStyles,
    sectionLabelStyles,
    footerStyles,
  } from "../DatePicker/DatePicker.styles";
  import {
    formatDate,
    timePartsOf,
    withTimeParts,
    startOfDay,
    type UixyTimeParts,
  } from "../DatePicker/DatePicker.utils";

  const props = defineProps<UixyDateRangePickerProps>();

  const model = defineModel<UixyDateRange>({
    default: () => ({ start: null, end: null }),
  });

  const {
    active,
    styles: positionStyles,
    refElement,
    handleOpen,
    handleLeave,
  } = usePosition({ direction: props.direction ?? "bottom" });

  const triggerRef = ref<HTMLElement>();

  const rangeHover = ref<Date | null>(null);

  const draftStartTime = ref<UixyTimeParts>(timePartsOf(model.value.start));

  const draftEndTime = ref<UixyTimeParts>(timePartsOf(model.value.end));

  const status = computed(() => {
    if (props.disabled) return "disabled";

    return props.status ?? "default";
  });

  const helperText = computed(() => {
    if (status.value === "error") return props.errorText ?? "";

    return props.helperText ?? "";
  });

  const hasValue = computed(() => !!model.value.start || !!model.value.end);

  const formatBound = (date: Date | null) =>
    formatDate(date, {
      withTime: props.withTime,
      withSeconds: props.withSeconds,
    });

  const displayValue = computed(() => {
    const { start, end } = model.value;

    if (start && end) return `${formatBound(start)}  –  ${formatBound(end)}`;
    if (start) return `${formatBound(start)}  –  …`;

    return props.placeholder ?? "Select range";
  });

  const viewBase = computed(
    () => model.value.start ?? model.value.end ?? new Date(),
  );

  const viewYear = computed(() => viewBase.value.getFullYear());

  const viewMonth = computed(() => viewBase.value.getMonth());

  const startTime = computed<UixyTimeParts>({
    get: () =>
      model.value.start ? timePartsOf(model.value.start) : draftStartTime.value,
    set: (parts) => {
      draftStartTime.value = parts;

      if (!model.value.start) return;

      model.value = {
        ...model.value,
        start: withTimeParts(model.value.start, parts),
      };
    },
  });

  const endTime = computed<UixyTimeParts>({
    get: () =>
      model.value.end ? timePartsOf(model.value.end) : draftEndTime.value,
    set: (parts) => {
      draftEndTime.value = parts;

      if (!model.value.end) return;

      model.value = {
        ...model.value,
        end: withTimeParts(model.value.end, parts),
      };
    },
  });

  const onDayPick = (date: Date | null | undefined) => {
    if (!date) return;

    const { start, end } = model.value;

    if (!start || end) {
      model.value = {
        start: withTimeParts(date, draftStartTime.value),
        end: null,
      };
      return;
    }

    const dateIsEarlier = startOfDay(date) <= startOfDay(start);
    const earlier = dateIsEarlier ? date : start;
    const later = dateIsEarlier ? start : date;

    model.value = {
      start: withTimeParts(earlier, draftStartTime.value),
      end: withTimeParts(later, draftEndTime.value),
    };

    rangeHover.value = null;

    if (!props.withTime && props.closeOnSelect) handleLeave();
  };

  const onDayHover = (date: Date) => {
    if (model.value.start && !model.value.end) rangeHover.value = date;
  };

  const onTriggerClick = (event: MouseEvent | KeyboardEvent) => {
    if (props.disabled) return;

    handleOpen(event as MouseEvent);
  };

  const clear = () => {
    model.value = { start: null, end: null };
    rangeHover.value = null;

    draftStartTime.value = { hour: 0, minute: 0, second: 0 };
    draftEndTime.value = { hour: 0, minute: 0, second: 0 };
  };

  watch(active, (isActive) => {
    if (isActive) {
      draftStartTime.value = timePartsOf(model.value.start);
      draftEndTime.value = timePartsOf(model.value.end);
    } else {
      rangeHover.value = null;
    }
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
