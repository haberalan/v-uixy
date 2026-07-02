<template>
  <div
    role="tablist"
    :class="
      segmentedTrackStyles({
        fullWidth: props.fullWidth,
        disabled: props.disabled,
      })
    "
  >
    <button
      v-for="option in props.options"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="model === option.value"
      :disabled="props.disabled || option.disabled"
      :class="
        segmentStyles({
          size: props.size ?? 'md',
          selected: model === option.value,
          disabled: !!option.disabled,
          fullWidth: props.fullWidth,
        })
      "
      @click="select(option)"
    >
      <animate-presence mode="wait" :initial="false">
        <motion.div
          v-if="model === option.value"
          :layout-id="pillLayoutId"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ duration: 0.2, ease: 'easeInOut' }"
          :class="segmentPillStyles()"
        />
      </animate-presence>

      <span :class="segmentContentStyles()">
        <uixy-icon
          v-if="option.icon"
          :name="option.icon"
          :class="segmentIconStyles({ size: props.size ?? 'md' })"
        />
        <span v-if="option.label">{{ option.label }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { motion, AnimatePresence } from "motion-v";
  import { v4 as uuidv4 } from "uuid";
  import { UixyIcon } from "../Icon";
  import type {
    UixySegmentedControlProps,
    UixySegmentedOption,
  } from "./SegmentedControl.types";
  import {
    segmentedTrackStyles,
    segmentStyles,
    segmentPillStyles,
    segmentContentStyles,
    segmentIconStyles,
  } from "./SegmentedControl.styles";

  const props = defineProps<UixySegmentedControlProps>();

  const model = defineModel<string | number>();

  const pillLayoutId = computed(() => `uixy-segmented-${uuidv4()}`);

  const select = (option: UixySegmentedOption) => {
    if (props.disabled || option.disabled) return;

    model.value = option.value;
  };

  onBeforeMount(() => {
    if (model.value === undefined && props.options.length > 0) {
      model.value = props.options[0]?.value;
    }
  });
</script>
