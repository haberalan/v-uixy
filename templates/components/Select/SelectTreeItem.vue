<template>
  <li class="flex flex-col">
    <div
      :tabIndex="option.disabled ? -1 : 0"
      :class="
        itemStyles({
          selected: isSelected(option),
          disabled: !!option.disabled,
        })
      "
      :style="{
        paddingLeft: `${depth * 28 + 12}px`,
        cursor: option.disabled ? 'not-allowed' : 'pointer',
      }"
      @click.stop="handleItemClick"
    >
      <div class="flex items-center gap-2 flex-1 min-h-6">
        <div
          v-if="hasChildren"
          class="shrink-0 size-6 flex items-center justify-center -ml-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition cursor-pointer"
          @click.stop="$emit('toggle-expand', getValue(option))"
        >
          <uixy-icon
            name="chevron-right"
            class="size-4.5 transition-transform"
            :class="{ 'rotate-90': isExpanded }"
          />
        </div>
        <span
          class="truncate"
          :class="{
            'text-gray-400 dark:text-gray-600':
              isNotSelectable && !option.disabled,
          }"
          >{{ option.label }}</span
        >
      </div>
      <uixy-icon
        v-if="isSelected(option)"
        name="check"
        class="absolute right-2 top-1/2 -translate-y-1/2 size-4"
      />
      <div
        v-else-if="isPartiallySelected?.(option)"
        class="absolute right-2 top-1/2 -translate-y-1/2 size-4 flex items-center justify-center"
      >
        <div class="h-0.5 w-2.5 rounded bg-current"></div>
      </div>
    </div>

    <animate-presence>
      <motion.ul
        v-if="hasChildren && isExpanded"
        class="flex flex-col gap-1 pt-1 overflow-hidden"
        :initial="{ opacity: 0, height: 0 }"
        :animate="{ opacity: 1, height: 'auto' }"
        :exit="{ opacity: 0, height: 0 }"
        :transition="{ duration: 0.15 }"
      >
        <SelectTreeItem
          v-for="child in option.children"
          :key="child.value ?? child.label"
          :option="child"
          :depth="depth + 1"
          :is-selected="isSelected"
          :is-partially-selected="isPartiallySelected"
          :expanded-items="expandedItems"
          :leaf-only="leafOnly"
          :multiple="multiple"
          :search-term="searchTerm"
          :original-options="originalOptions"
          @toggle-expand="$emit('toggle-expand', $event)"
          @select="$emit('select', $event)"
        />
      </motion.ul>
    </animate-presence>
  </li>
</template>

<script setup lang="ts">
  import { motion, AnimatePresence } from "motion-v";
  import { itemStyles } from "./Select.styles";
  import type { UixySelectOptionType } from "./Select.types";
  import { UixyIcon } from "../Icon";

  const props = defineProps<{
    option: UixySelectOptionType;
    depth: number;
    isSelected: (option: UixySelectOptionType) => boolean;
    isPartiallySelected?: (option: UixySelectOptionType) => boolean;
    expandedItems: string[];
    leafOnly?: boolean;
    multiple?: boolean;
    searchTerm?: string;
    originalOptions?: UixySelectOptionType[];
  }>();

  const emit = defineEmits<{
    (e: "toggle-expand", value: string): void;
    (e: "select", value: string): void;
  }>();

  const getValue = (option: UixySelectOptionType) =>
    option.value ?? option.label;

  const hasChildren = computed(
    () => props.option.children && props.option.children.length > 0,
  );

  const hasChildrenInOriginal = computed(() => {
    if (!props.originalOptions) return hasChildren.value;

    const findInTree = (
      options: UixySelectOptionType[],
      value: string,
    ): UixySelectOptionType | null => {
      for (const opt of options) {
        if ((opt.value ?? opt.label) === value) return opt;
        if (opt.children && opt.children.length > 0) {
          const found = findInTree(opt.children, value);
          if (found) return found;
        }
      }
      return null;
    };

    const originalOption = findInTree(
      props.originalOptions,
      getValue(props.option),
    );
    return originalOption?.children && originalOption.children.length > 0;
  });

  const isExpanded = computed(() =>
    props.expandedItems.includes(getValue(props.option)),
  );

  const isNotSelectable = computed(
    () =>
      props.option.disabled ||
      (props.leafOnly && hasChildrenInOriginal.value && !props.multiple),
  );

  const handleItemClick = () => {
    if (props.option.disabled) return;

    if (props.leafOnly && hasChildrenInOriginal.value && !props.multiple) {
      emit("toggle-expand", getValue(props.option));
      return;
    }

    emit("select", getValue(props.option));
  };
</script>
