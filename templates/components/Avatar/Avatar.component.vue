<template>
  <div :class="avatarWrapperStyles({ variant }, $attrs.class as string)">
    <p
      v-if="show !== undefined && !show"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-700"
    >
      {{ props.alt }}
    </p>
    <img
      v-else-if="show !== undefined && show"
      class="size-full"
      :onError="handleError"
      :class="avatarImageStyles({ show, variant })"
      :src="props.src"
      :alt="props.alt"
      v-bind="filteredAttrs"
    />
    <uixy-skeleton
      v-else
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xs font-700"
    />
  </div>
</template>

<script setup lang="ts">
  import { UixySkeleton } from "../Skeleton";
  import type { UixyAvatarProps } from "./Avatar.types";
  import { avatarWrapperStyles, avatarImageStyles } from "./Avatar.styles";

  const props = defineProps<UixyAvatarProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const show = ref<boolean>();

  const handleError = () => {
    show.value = false;
  };

  onMounted(() => {
    show.value = !!props.src;
  });
</script>
