<template>
  <uixy-link
    v-if="props.link"
    :class="linkStyles({ disabled: !!props.disabled }, $attrs.class as string)"
    :tabindex="props.disabled ? -1 : 0"
    v-bind="{ ...props.link, ...filteredAttrs }"
  >
    <div :class="buttonStyles({ variant, size, rounded: !!props.rounded })">
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
          class="flex items-center justify-center gap-1"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: props.loading ? 0 : 1 }"
          :transition="{ ease: 'easeInOut', duration: 0.15 }"
        >
          <uixy-icon
            v-if="props.icon && !props.loading"
            :name="props.icon"
            :class="iconStyles({ position: props.iconPosition ?? 'left' })"
          />
          <slot />
        </motion.div>
      </animate-presence>
    </div>
  </uixy-link>

  <button
    v-else
    :disabled="props.disabled || props.loading"
    :type="props.type ?? 'button'"
    :tabindex="props.link ? -1 : 0"
    :class="buttonStyles({ variant, size, rounded: !!props.rounded }, $attrs.class as string)"
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
        class="flex items-center justify-center gap-1"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: props.loading ? 0 : 1 }"
        :transition="{ ease: 'easeInOut', duration: 0.15 }"
      >
        <uixy-icon
          v-if="props.icon && !props.loading"
          :name="props.icon"
          :class="iconStyles({ position: props.iconPosition ?? 'left' })"
        />
        <slot />
      </motion.div>
    </animate-presence>
  </button>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { UixyLink } from "../Link";
  import { UixyLoader } from "../Loader";
  import { UixyIcon } from "../Icon";
  import type { UixyButtonProps } from "./Button.types";
  import { buttonStyles, linkStyles, iconStyles } from "./Button.styles";

  const props = defineProps<UixyButtonProps>();

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
