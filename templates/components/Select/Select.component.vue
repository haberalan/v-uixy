<template>
  <div class="flex flex-col gap-1">
    <div class="relative flex flex-col-reverse gap-1" ref="refOptions">
      <div
        :class="selectStyles({ status }, $attrs.class as string)"
        :tabIndex="props.disabled ? -1 : 0"
        :auto-focus="props.autoFocus"
        @click="handleOpen"
        @keydown="handleKeydownSelect"
        v-bind="filteredAttrs"
      >
        <p
          v-if="props.placeholder && (!model || model.length === 0)"
          class="pointer-events-none select-none text-gray-500 dark:text-gray-700"
        >
          {{ props.placeholder }}
        </p>
        <div
          v-if="props.multiple"
          :class="badgesWrapperStyles({ disabled: props.disabled })"
        >
          <uixy-badge
            v-for="(item, index) in model"
            data-badge
            variant="tertiary"
            size="xs"
            shape="pill"
            :key="`${item}--${index}`"
            @click.stop="handleClickSelectedOption(item)"
          >
            {{ item }}
          </uixy-badge>
        </div>
        <p v-else>{{ model }}</p>

        <uixy-icon name="chevron-down" :class="iconStyles({ open })" />
      </div>
      <animate-presence>
        <motion.div
          v-if="open && !props.disabled"
          class="scrollbar absolute top-full z-20 mt-[2px] max-h-[320px] w-full overflow-y-auto rounded-1 border border-gray-300 bg-white p-1 text-sm dark:border-gray-900 dark:bg-gray-1000"
          :initial="{ opacity: 0, y: -4, scale: 0.8 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.8 }"
          :transition="{ duration: 0.15, ease: 'easeInOut' }"
          select-dropdown
        >
          <div v-if="props.search" class="mb-2">
            <uixy-input
              v-model="search"
              status="default"
              icon="search"
              iconPositon="right"
              placeholder="Search..."
              hide-helper
              auto-focus
            />
          </div>
          <ul class="flex flex-col gap-1 py-1">
            <li
              v-for="option in filteredOptions"
              :tabIndex="option.disabled ? -1 : 0"
              :key="option.label"
              :class="
                itemStyles({
                  selected: isSelected(option),
                  disabled: !!option.disabled,
                })
              "
              @keydown="handleKeydownOption($event, option)"
              @click="handleClick(option.label)"
            >
              {{ option.label }}
              <uixy-icon
                v-if="isSelected(option)"
                name="check"
                class="absolute right-2 top-2 size-4"
              />
            </li>
            <li
              v-if="filteredOptions.length === 0"
              class="px-3 text-center dark:text-gray-600"
            >
              No results found
            </li>
          </ul>
        </motion.div>
      </animate-presence>
      <div v-if="props.label" :class="labelStyles({ status })">
        {{ props.label }}
      </div>
    </div>
    <div v-if="!props.hideHelper" class="h-4">
      <animate-presence mode="wait" :initial="false">
        <motion.div
          :initial="{ opacity: 0, y: '-4px' }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: '-4px' }"
          :transition="{ duration: 0.125 }"
          :key="status"
        >
          <p :class="helperStyles({ status })">{{ text }}</p>
        </motion.div>
      </animate-presence>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends (string | string[])">
  import {
    selectStyles,
    iconStyles,
    labelStyles,
    itemStyles,
    helperStyles,
    badgesWrapperStyles,
  } from "./Select.styles";
  import type {
    UixySelectEmits,
    UixySelectOptionType,
    UixySelectProps,
  } from "./Select.types";
  import { UixyBadge } from "../Badge";
  import { UixyIcon } from "../Icon";
  import { UixyInput } from "../Input";
  import { motion, AnimatePresence } from "motion-v";
  import { useSelect } from "./composables";

  const props = defineProps<UixySelectProps>();

  const emits = defineEmits<UixySelectEmits>();

  const model = defineModel<T>({ required: true });

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const handleChange = (v: string) => {
    if (props.multiple) {
      let prevArray = model.value as string[];

      if (!Array.isArray(prevArray)) prevArray = [];

      if (prevArray.includes(v)) {
        (model.value as string[]) = prevArray.filter((item) => item !== v);
      } else {
        if (props.max && prevArray.length >= props.max)
          (model.value as string[]) = [...prevArray.slice(1), v];

        (model.value as string[]) = [...prevArray, v];
      }
    } else {
      (model.value as string) = v;
    }
  };

  const {
    refOptions,
    open,
    search,
    filteredOptions,
    handleOpen,
    handleKeydownSelect,
    handleKeydownOption,
    handleClickSelectedOption,
  } = useSelect<T>(props.options, !!props.disabled, handleChange);

  const handleClick = (label: string) => {
    handleChange(label);

    if (!props.multiple) open.value = false;
  };

  const isSelected = (option: UixySelectOptionType) =>
    Array.isArray(model.value)
      ? model.value.includes(option.label)
      : model.value === option.label;

  const status = computed(() =>
    props.disabled ? "disabled" : props.status ?? "default"
  );

  const text = computed(
    () =>
      ({
        error: props.errorText,
        default: props.helperText,
        disabled: "",
        valid: "",
      }[props.status ?? "default"])
  );
</script>
