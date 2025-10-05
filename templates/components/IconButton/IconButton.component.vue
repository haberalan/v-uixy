<template>
  <uixy-link
    v-if="props.link"
    :class="linkStyles({ disabled: !!props.disabled })"
    :tabindex="props.disabled ? -1 : 0"
    v-bind="{
      ...props.link,
      ...filteredAttrs,
    }"
  >
    <div :class="iconButtonStyles({ variant, size }, $attrs.class as string)">
      <animate-presence :initial="false">
        <motion.div
          v-if="props.loading"
          class="absolute top-1/2 flex size-6 -translate-y-1/2 items-center justify-center"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ ease: 'easeInOut', duration: 0.15 }"
        >
          <uixy-loader size="sm" />
        </motion.div>
      </animate-presence>
      <animate-presence :initial="false">
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{
            opacity: props.loading ? 0 : 1,
          }"
          :transition="{ ease: 'easeInOut', duration: 0.15 }"
        >
          <uixy-icon :name="props.icon" class="size-5 shrink-0" />
        </motion.div>
      </animate-presence>
    </div>
  </uixy-link>
  <button
    v-else
    :class="iconButtonStyles({ variant, size }, $attrs.class as string)"
    :disabled="props.disabled || props.loading"
    :type="props.type ?? 'button'"
    :tabindex="props.disabled ? -1 : 0"
    v-bind="filteredAttrs"
  >
    <animate-presence :initial="false">
      <motion.div
        v-if="props.loading"
        class="absolute top-1/2 flex size-6 -translate-y-1/2 items-center justify-center"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ ease: 'easeInOut', duration: 0.15 }"
      >
        <uixy-loader size="sm" />
      </motion.div>
    </animate-presence>
    <animate-presence :initial="false">
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{
          opacity: props.loading ? 0 : 1,
        }"
        :transition="{ ease: 'easeInOut', duration: 0.15 }"
      >
        <uixy-icon :name="props.icon" class="size-5 shrink-0" />
      </motion.div>
    </animate-presence>
  </button>
</template>

<script setup lang="ts">
  import { UixyLink } from "../Link";
  import { UixyLoader } from "../Loader";
  import { UixyIcon } from "../Icon";
  import { AnimatePresence, motion } from "motion-v";
  import type { UixyIconButtonProps } from "./IconButton.types";
  import { iconButtonStyles, linkStyles } from "./IconButton.styles";

  const props = defineProps<UixyIconButtonProps>();

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const variant = computed(() => props.variant || "primary");
  const size = computed(() => props.size || "md");
</script>
