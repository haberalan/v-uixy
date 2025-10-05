<template>
  <div :class="timePickerStyles($attrs.class as string)">
    <uixy-icon name="clock" class="size-6 text-gray-400 dark:text-gray-700" />
    <div class="flex items-center gap-1">
      <input
        v-if="model && model.hasOwnProperty('hour')"
        type="text"
        :value="validateAndFormatTime(String(model?.hour ?? ''), 'hour')"
        :disabled="props.disabled"
        @input="handleChange($event, 'hour')"
        class="rounded-1 font-500 dark:bg-gray-1000 w-9 border border-gray-300 bg-white p-1 text-center text-sm disabled:text-gray-400 dark:border-gray-900 dark:disabled:text-gray-700"
      />
      <div
        v-if="displaySeparator('first')"
        class="font-800 pointer-events-none text-lg"
      >
        :
      </div>
      <input
        v-if="model && model.hasOwnProperty('minute')"
        type="text"
        :value="validateAndFormatTime(String(model?.minute ?? ''), 'minute')"
        :disabled="props.disabled"
        @input="handleChange($event, 'minute')"
        class="rounded-1 font-500 dark:bg-gray-1000 w-9 border border-gray-300 bg-white p-1 text-center text-sm disabled:text-gray-400 dark:border-gray-900 dark:disabled:text-gray-700"
      />
      <div
        v-if="displaySeparator('second')"
        class="font-800 pointer-events-none text-lg"
      >
        :
      </div>
      <input
        v-if="model && model.hasOwnProperty('second')"
        type="text"
        :value="validateAndFormatTime(String(model?.second ?? ''), 'second')"
        :disabled="props.disabled"
        @input="handleChange($event, 'second')"
        class="rounded-1 font-500 dark:bg-gray-1000 w-9 border border-gray-300 bg-white p-1 text-center text-sm disabled:text-gray-400 dark:border-gray-900 dark:disabled:text-gray-700"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type UixyTimePickerProps } from "./TimePicker.types";
  import { UixyIcon } from "../Icon";
  import { timePickerStyles } from "./TimePicker.styles";

  const props = defineProps<UixyTimePickerProps>();

  const model = defineModel<{
    hour?: number;
    minute?: number;
    second?: number;
  }>({
    default: () => ({
      hour: 0,
      minute: 0,
    }),
  });

  const validateAndFormatTime = (
    value: string,
    type: "hour" | "minute" | "second"
  ) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return "00";

    let validatedNum = num;

    if (type === "hour") validatedNum = Math.min(23, Math.max(0, num));
    else if (type === "minute") validatedNum = Math.min(59, Math.max(0, num));
    else validatedNum = Math.min(59, Math.max(0, num));

    return validatedNum < 10 ? `0${validatedNum}` : `${validatedNum}`;
  };

  const handleChange = (event: Event, type: "hour" | "minute" | "second") => {
    const target = event.target as HTMLInputElement;
    const valueStr = validateAndFormatTime(target.value, type);
    const valueNum = Number.parseInt(valueStr, 10);

    model.value = {
      ...model.value,
      [type]: Number.isFinite(valueNum) ? valueNum : 0,
    };
  };

  const displaySeparator = (order: "first" | "second") => {
    if (!model) return false;

    if (order === "first") {
      if (!model.value?.hasOwnProperty("hour")) return false;

      if (
        model.value?.hasOwnProperty("minute") ||
        model.value?.hasOwnProperty("second")
      )
        return true;
    }

    if (order === "second") {
      if (!model.value?.hasOwnProperty("second")) return false;

      if (
        model.value?.hasOwnProperty("hour") ||
        model.value?.hasOwnProperty("minute")
      )
        return true;
    }

    return false;
  };
</script>
