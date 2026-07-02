<template>
  <div
    class="relative mx-auto w-fit"
    :style="{ height: `${ITEM_HEIGHT * VISIBLE}px` }"
  >
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        class="w-full rounded-1 bg-gray-200/80 dark:bg-gray-900/80"
        :style="{ height: `${ITEM_HEIGHT}px` }"
      />
    </div>

    <div
      class="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-gray-100 to-transparent dark:from-black"
      :style="{ height: `${ITEM_HEIGHT * 1.6}px` }"
    />
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-gray-100 to-transparent dark:from-black"
      :style="{ height: `${ITEM_HEIGHT * 1.6}px` }"
    />

    <div class="relative flex items-stretch gap-1 text-sm">
      <div class="w-11">
        <time-wheel-column
          v-model="hour"
          :values="hourValues"
          :format="pad"
          :item-height="ITEM_HEIGHT"
          :visible-count="VISIBLE"
          :disabled="props.disabled"
        />
      </div>
      <div class="w-11">
        <time-wheel-column
          v-model="minute"
          :values="minuteValues"
          :format="pad"
          :item-height="ITEM_HEIGHT"
          :visible-count="VISIBLE"
          :disabled="props.disabled"
        />
      </div>
      <div v-if="props.withSeconds" class="w-11">
        <time-wheel-column
          v-model="second"
          :values="minuteValues"
          :format="pad"
          :item-height="ITEM_HEIGHT"
          :visible-count="VISIBLE"
          :disabled="props.disabled"
        />
      </div>
      <div v-if="is12" class="w-12">
        <time-wheel-column
          v-model="period"
          :values="periodValues"
          :item-height="ITEM_HEIGHT"
          :visible-count="VISIBLE"
          :disabled="props.disabled"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import TimeWheelColumn from "./TimeWheelColumn.vue";
  import { pad2, type UixyTimeParts } from "./DatePicker.utils";

  const props = withDefaults(
    defineProps<{
      hourCycle?: 12 | 24;
      withSeconds?: boolean;
      disabled?: boolean;
    }>(),
    { hourCycle: 12 },
  );

  const model = defineModel<UixyTimeParts>({
    default: () => ({ hour: 0, minute: 0, second: 0 }),
  });

  const ITEM_HEIGHT = 34;
  const VISIBLE = 5;

  const pad = (value: number | string) => pad2(Number(value));

  const is12 = computed(() => props.hourCycle === 12);

  const hourValues = computed(() =>
    is12.value
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i),
  );

  const minuteValues = Array.from({ length: 60 }, (_, i) => i);

  const periodValues = ["AM", "PM"];

  const period = computed<string>({
    get: () => (model.value.hour < 12 ? "AM" : "PM"),
    set: (value) => {
      const base = model.value.hour % 12;
      let hour = base;

      switch (value) {
        case "PM":
          hour = base + 12;
          break;
        default:
          hour = base;
      }

      model.value = { ...model.value, hour };
    },
  });

  const hour = computed<number>({
    get: () =>
      is12.value ? ((model.value.hour + 11) % 12) + 1 : model.value.hour,
    set: (value) => {
      const next = Number(value);

      if (!is12.value) {
        model.value = { ...model.value, hour: next };
        return;
      }

      const hour24 = (next % 12) + (period.value === "PM" ? 12 : 0);
      model.value = { ...model.value, hour: hour24 };
    },
  });

  const minute = computed<number>({
    get: () => model.value.minute,
    set: (value) => (model.value = { ...model.value, minute: Number(value) }),
  });

  const second = computed<number>({
    get: () => model.value.second,
    set: (value) => (model.value = { ...model.value, second: Number(value) }),
  });
</script>
