<template>
  <uixy-link
    v-if="props.link"
    data-badge
    :class="
      linkStyles({
        shape: props.shape,
        disabled: !!props.disabled,
      })
    "
    :tabindex="props.disabled ? -1 : 0"
    v-bind="{ ...props.link, ...filteredAttrs }"
  >
    <div
      :class="
        badgeStyles(
          {
            variant: props.variant,
            size: props.size,
            shape: props.shape,
            clickable: !!props.link,
          },
          $attrs.class as string
        )
      "
    >
      <uixy-icon
        v-if="props.icon"
        :name="props.icon"
        :class="
          iconStyles({
            size: props.size,
            position: props.iconPosition ?? 'left',
          })
        "
      />
      <slot />
    </div>
  </uixy-link>
  <template v-else>
    <div
      :tabindex="props.disabled || !$attrs.onClick ? -1 : 0"
      :class="
        badgeStyles(
          {
            variant: props.variant,
            size: props.size,
            shape: props.shape,
            clickable: !!$attrs.onClick,
          },
          $attrs.class as string
        )
      "
      data-badge
      v-bind="filteredAttrs"
    >
      <uixy-icon
        v-if="props.icon"
        :name="props.icon"
        :class="
          iconStyles({
            size: props.size,
            position: props.iconPosition ?? 'left',
          })
        "
      />
      <slot />
    </div>
  </template>
</template>

<script setup lang="ts">
  import { UixyLink } from "../Link";
  import { UixyIcon } from "../Icon";
  import type { UixyBadgeProps } from "./Badge.types";
  import { badgeStyles, linkStyles, iconStyles } from "./Badge.styles";

  const props = defineProps<UixyBadgeProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });
</script>
