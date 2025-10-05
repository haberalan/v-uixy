<template>
  <div :class="calendarStyles($attrs.class as string)">
    <div class="flex w-full items-center justify-between">
      <uixy-icon-button
        @click="decrementMonth"
        icon="chevron-left"
        size="sm"
        variant="tertiary"
      />
      <p class="w-[160px] text-center text-sm font-500">
        {{ MONTHS[selectedMonth] }} {{ selectedYear }}
      </p>
      <uixy-icon-button
        @click="incrementMonth"
        icon="chevron-right"
        size="sm"
        variant="tertiary"
      />
    </div>

    <div
      class="grid w-full grid-cols-7 text-xs text-gray-400 dark:text-gray-700"
    >
      <div v-for="day in adjustedDays" :key="day" class="py-2 text-center">
        {{ day.slice(0, 2) }}
      </div>
    </div>

    <div class="grid w-full grid-cols-7 gap-1 text-sm">
      <button
        v-for="day in daysToShow"
        :key="day.date.toString() + day.fromCurrentMonth"
        :class="
          calendarDayStyles({
            currentMonth: !!day.fromCurrentMonth,
            selected: model?.toDateString?.() === day.date.toDateString(),
            disabled:
              !!props.disabled || day.fromPreviousMonth || day.fromNextMonth,
          })
        "
        :disabled="day.fromPreviousMonth || day.fromNextMonth"
        @click="handleDayClick(day.date)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import { UixyIconButton } from "../IconButton";
  import { calendarDayStyles, calendarStyles } from "./Calendar.styles";
  import type { UixyCalendarProps } from "./Calendar.types";

  const props = defineProps<UixyCalendarProps>();

  const model = defineModel<Date | null>();

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const selectedYear = ref(props.year ?? new Date().getFullYear());
  const selectedMonth = ref(props.month ?? new Date().getMonth());

  const adjustedDays = computed(() =>
    props.startOfWeek === "Monday" ? [...DAYS.slice(1), DAYS[0]] : DAYS
  );

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = computed(() => {
    let day = new Date(selectedYear.value, selectedMonth.value, 1).getDay();
    if (props.startOfWeek === "Monday") {
      day = day === 0 ? 6 : day - 1;
    }
    return day;
  });

  const daysInCurrentMonth = computed(() =>
    getDaysInMonth(selectedYear.value, selectedMonth.value)
  );

  const daysInPreviousMonth = computed(() =>
    getDaysInMonth(selectedYear.value, selectedMonth.value - 1)
  );

  const prevMonthDaysToShow = computed(() =>
    Array.from({ length: firstDayOfMonth.value }, (_, i) => ({
      day: daysInPreviousMonth.value - i,
      date: new Date(
        selectedYear.value,
        selectedMonth.value - 1,
        daysInPreviousMonth.value - i
      ),
      dayOfWeek: (firstDayOfMonth.value - 1 - i + 7) % 7,
      fromPreviousMonth: true,
    })).reverse()
  );

  const currentMonthDaysToShow = computed(() =>
    Array.from({ length: daysInCurrentMonth.value }, (_, i) => ({
      day: i + 1,
      date: new Date(selectedYear.value, selectedMonth.value, i + 1),
      dayOfWeek: new Date(
        selectedYear.value,
        selectedMonth.value,
        i + 1
      ).getDay(),
      fromCurrentMonth: true,
    }))
  );

  const lastDayOfMonth = computed(() =>
    new Date(
      selectedYear.value,
      selectedMonth.value,
      daysInCurrentMonth.value
    ).getDay()
  );

  const nextMonthDaysToShow = computed(() => {
    const length =
      props.startOfWeek === "Monday"
        ? (7 - lastDayOfMonth.value) % 7
        : 6 - lastDayOfMonth.value;

    return Array.from({ length }, (_, i) => ({
      day: i + 1,
      date: new Date(selectedYear.value, selectedMonth.value + 1, i + 1),
      dayOfWeek: i,
      fromNextMonth: true,
    }));
  });

  const daysToShow = computed<
    {
      day: number;
      date: Date;
      dayOfWeek: number;
      fromPreviousMonth?: boolean;
      fromCurrentMonth?: boolean;
      fromNextMonth?: boolean;
    }[]
  >(() => [
    ...prevMonthDaysToShow.value,
    ...currentMonthDaysToShow.value,
    ...nextMonthDaysToShow.value,
  ]);

  function incrementMonth() {
    if (selectedMonth.value === 11) {
      selectedMonth.value = 0;
      selectedYear.value++;
    } else {
      selectedMonth.value++;
    }
  }

  function decrementMonth() {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11;
      selectedYear.value--;
    } else {
      selectedMonth.value--;
    }
  }

  function handleDayClick(date: Date) {
    if (!props.disabled) {
      model.value = date;
    }
  }
</script>
