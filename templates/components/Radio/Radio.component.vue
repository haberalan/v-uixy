<template>
  <div :class="radioStyles($attrs.class as string)">
    <input
      type="radio"
      :id="props.id"
      :name="props.name"
      :disabled="props.disabled"
      v-model="checked"
      class="peer relative size-4 cursor-pointer appearance-none rounded-full border-2 border-gray-300 after:absolute after:left-[2px] after:top-[2px] after:size-2 after:rounded-full after:bg-black after:content-none checked:border-gray-500 checked:after:content-[''] disabled:cursor-default disabled:border-gray-300 disabled:after:bg-gray-400 dark:border-gray-100 dark:after:bg-gray-100 dark:disabled:border-gray-600 dark:disabled:after:bg-gray-600"
      v-bind="filteredAttrs"
    />
    <label
      :for="props.id"
      class="text-sm font-500 peer-disabled:text-gray-500 dark:peer-disabled:text-gray-600"
    >
      {{ props.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
  import type { UixyRadioProps } from "./Radio.types";
  import { radioStyles } from "./Radio.styles";

  const props = defineProps<UixyRadioProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const checked = defineModel<string | number | boolean>("checked");
</script>
