<template>
  <div
    @click="handleClick"
    @keydown.prevent="handleKeyDown"
    :tabindex="props.disabled ? -1 : 0"
    :class="toggleStyles(
        {
          variant: props.variant,
          toggled: !!toggled,
          disabled: !!props.disabled,
        },
        $attrs.class as string,
      )"
    v-bind="filteredAttrs"
  >
    <uixy-icon :name="props.icon" class="size-6" />
    <p v-if="props.label" class="text-sm">{{ props.label }}</p>
  </div>
</template>

<script setup lang="ts">
  import { UixyIcon } from "../Icon";
  import type { UixyToggleProps } from "./Toggle.types";
  import { toggleStyles } from "./Toggle.styles";

  const props = defineProps<UixyToggleProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const toggled = defineModel<boolean>("toggled");

  const handleClick = () => {
    if (props.disabled) return;

    toggled.value = !toggled.value;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    handleClick();
  };
</script>
