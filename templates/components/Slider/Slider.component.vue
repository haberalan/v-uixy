<template>
  <div :class="sliderWrapperStyles($attrs.class as string)">
    <input
      type="range"
      v-model="sliderValue"
      :disabled="props.disabled"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      class="slider group h-2 w-full appearance-none rounded-full bg-gray-300 dark:bg-gray-800"
    />
    <div
      :class="sliderStyles({ disabled: !!props.disabled }, calcRounded())"
      :style="{ width: calcWidth() }"
    />
  </div>
</template>

<script setup lang="ts">
  import type { UixySliderProps } from "./Slider.types";
  import { sliderStyles, sliderWrapperStyles } from "./Slider.styles";

  const props = defineProps<UixySliderProps>();

  const sliderValue = defineModel<number>("sliderValue", {
    default: 0,
  });

  const calcWidth = () => {
    if (sliderValue?.value > (props.max ?? 100) / 2)
      return `calc(${
        ((sliderValue?.value - (props.min ?? 0)) /
          ((props.max ?? 100) - (props.min ?? 0))) *
        100
      }%)`;

    if (sliderValue.value === 0) return "0%";

    return `calc(${
      ((sliderValue.value - (props.min ?? 0)) /
        ((props.max ?? 100) - (props.min ?? 0))) *
      100
    }% + 3px)`;
  };

  const calcRounded = () => {
    if (sliderValue.value > (props.max ?? 100) / 1.4) return "rounded-full";

    return "rounded-l-full";
  };
</script>
