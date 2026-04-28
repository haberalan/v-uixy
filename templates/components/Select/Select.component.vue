<template>
  <div class="flex flex-col gap-1">
    <div class="relative flex flex-col-reverse gap-1" ref="refOptions">
      <div
        :class="selectStyles({ status }, $attrs.class as string)"
        :tabIndex="props.disabled ? -1 : 0"
        :auto-focus="props.autoFocus"
        ref="refTrigger"
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
            v-for="(item, index) in model as string[]"
            data-badge
            variant="tertiary"
            size="xs"
            shape="pill"
            :key="`${item}--${index}`"
            @click.stop="handleClickSelectedOption(item)"
          >
            {{ getLabel(item) }}
          </uixy-badge>
        </div>
        <p v-else>{{ getLabel(model as string) }}</p>

        <uixy-icon
          v-if="props.deselectable && !props.multiple && model"
          name="close"
          class="absolute right-7 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer z-10 text-gray-500 dark:text-gray-600 hover:text-black dark:hover:text-gray-400"
          @click.stop="handleDeselect"
        />
        <uixy-icon name="chevron-down" :class="iconStyles({ open })" />
      </div>

      <teleport to="body">
        <animate-presence>
          <motion.div
            v-if="open && !props.disabled"
            class="scrollbar z-50 max-h-60 overflow-y-auto rounded-1 border border-gray-300 bg-white p-1 text-sm shadow-sm dark:border-gray-900 dark:bg-gray-1000"
            :style="dropdownStyles"
            :initial="{ opacity: 0, y: -4, scale: 0.98 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :exit="{ opacity: 0, scale: 0.98 }"
            :transition="{ duration: 0.12, ease: 'easeInOut' }"
          >
            <div ref="refDropdownEl" select-dropdown>
              <div v-if="props.search" class="mb-2" @click.stop>
                <uixy-input
                  ref="refSearchInput"
                  v-model="search"
                  status="default"
                  icon="search"
                  iconPositon="right"
                  placeholder="Search..."
                  hide-helper
                />
              </div>

              <ul v-if="props.tree" class="flex flex-col gap-1 py-1">
                <template
                  v-for="option in filteredOptions"
                  :key="option.value ?? option.label"
                >
                  <SelectTreeItem
                    :option="option"
                    :depth="0"
                    :is-selected="isSelected"
                    :is-partially-selected="isPartiallySelected"
                    :expanded-items="effectiveExpandedItems"
                    :leaf-only="props.leafOnly"
                    :multiple="props.multiple"
                    :search-term="search"
                    :original-options="props.options"
                    @toggle-expand="toggleExpand"
                    @select="handleClick"
                  />
                </template>

                <li
                  v-if="filteredOptions.length === 0"
                  class="px-3 text-center dark:text-gray-600"
                >
                  No results found
                </li>
              </ul>

              <ul v-else class="flex flex-col gap-1 py-1">
                <li
                  v-for="option in filteredOptions"
                  :tabIndex="option.disabled ? -1 : 0"
                  :key="option.value ?? option.label"
                  :class="
                    itemStyles({
                      selected: isSelected(option),
                      disabled: !!option.disabled,
                    })
                  "
                  @keydown="handleKeydownOption($event, option)"
                  @click="handleClick(option.value ?? option.label)"
                >
                  {{ option.label }}
                  <uixy-icon
                    v-if="isSelected(option)"
                    name="check"
                    class="absolute right-2 top-2 size-4"
                  />
                </li>

                <li
                  v-if="customAddVisible"
                  class="relative py-2 px-3 rounded-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-600"
                  @click="handleCustomAdd"
                >
                  Add: "{{ search }}"
                </li>

                <li
                  v-if="filteredOptions.length === 0 && !customAddVisible"
                  class="px-3 text-center dark:text-gray-600"
                >
                  No results found
                </li>
              </ul>
            </div>
          </motion.div>
        </animate-presence>
      </teleport>
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

<script setup lang="ts" generic="T extends string | string[]">
  import { nextTick, onWatcherCleanup, onMounted } from "vue";
  import {
    selectStyles,
    iconStyles,
    labelStyles,
    itemStyles,
    helperStyles,
    badgesWrapperStyles,
  } from "./Select.styles";
  import type { UixySelectEmits, UixySelectProps } from "./Select.types";
  import { UixyBadge } from "../Badge";
  import { UixyIcon } from "../Icon";
  import { UixyInput } from "../Input";
  import { motion, AnimatePresence } from "motion-v";
  import { useSelect } from "./composables";
  import SelectTreeItem from "./SelectTreeItem.vue";

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

  const refTrigger = ref<HTMLElement>();
  const refDropdownEl = ref<HTMLElement>();
  const refSearchInput = ref<{ focus: () => void } | null>(null);

  const dropdownStyles = ref<Record<string, string>>({
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "0px",
  });

  const {
    refOptions,
    open,
    search,
    filteredOptions,
    effectiveExpandedItems,
    customAddVisible,
    isSelected,
    isPartiallySelected,
    getLabel,
    toggleExpand,
    handleOpen,
    handleKeydownSelect,
    handleKeydownOption,
    handleClickSelectedOption,
    handleClick,
    handleDeselect,
    handleCustomAdd,
  } = useSelect<T>(props, model as Ref<T>, emits, refDropdownEl);

  const updateDropdownPosition = async () => {
    if (!open.value || props.disabled) return;

    await nextTick();
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    const trigger = refTrigger.value;
    const dropdown = refDropdownEl.value;
    if (!trigger || !dropdown) return;

    const triggerRect = trigger.getBoundingClientRect();
    const gap = 4;
    const pad = 8;
    const width = Math.max(80, triggerRect.width);

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const cs = window.getComputedStyle(dropdown);
    const maxH = Number.parseFloat(cs.maxHeight || "") || 240;
    const desiredH = Math.min(dropdown.scrollHeight || 0, maxH);

    const availableBelow = window.innerHeight - triggerRect.bottom - gap - pad;
    const availableAbove = triggerRect.top - gap - pad;

    const placeBelow =
      desiredH <= availableBelow || availableBelow >= availableAbove;

    let top =
      (placeBelow
        ? triggerRect.bottom + gap
        : triggerRect.top - gap - desiredH) + scrollY;

    const minTop = scrollY + pad;
    const maxTop = scrollY + window.innerHeight - desiredH - pad;
    top = Math.min(Math.max(minTop, top), Math.max(minTop, maxTop));

    let left = triggerRect.left + scrollX;
    const minLeft = scrollX + pad;
    const maxLeft = scrollX + window.innerWidth - width - pad;
    left = Math.min(Math.max(minLeft, left), Math.max(minLeft, maxLeft));

    dropdownStyles.value = {
      position: "absolute",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${Math.round(width)}px`,
    };
  };

  const onResize = () => {
    void updateDropdownPosition();
  };

  const onAnyScroll = () => {
    void updateDropdownPosition();
  };

  watch(
    () => open.value,
    (isOpen) => {
      emits("openChange", isOpen);

      if (!isOpen) return;

      void updateDropdownPosition();

      if (props.search) {
        nextTick(() => refSearchInput.value?.focus());
      }

      window.addEventListener("resize", onResize);
      if (props.followOnScroll) {
        window.addEventListener("scroll", onAnyScroll, true);
      }

      onWatcherCleanup(() => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onAnyScroll, true);
      });
    },
  );

  onMounted(() => {
    if (props.autoOpen && !props.disabled) {
      const delayMs = (props.delay ?? 0) * 1000;
      setTimeout(() => {
        nextTick(() => {
          open.value = true;
        });
      }, delayMs);
    }
  });

  watch(search, () => {
    if (!open.value) return;
    void updateDropdownPosition();
  });

  watch(
    () => filteredOptions.value.length,
    () => {
      if (!open.value) return;
      void updateDropdownPosition();
    },
  );

  watch(
    () => model.value,
    () => {
      if (!open.value) return;
      void updateDropdownPosition();
    },
    { deep: true },
  );

  const status = computed(() =>
    props.disabled ? "disabled" : (props.status ?? "default"),
  );

  const text = computed(
    () =>
      ({
        error: props.errorText,
        default: props.helperText,
        disabled: "",
        valid: "",
      })[props.status ?? "default"],
  );
</script>
