<template>
  <teleport to="body">
    <animate-presence>
      <template v-if="open">
        <motion.div
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          :transition="{ ease: 'easeInOut', duration: 0.15 }"
          @click.self="handleClick"
          class="fixed left-0 top-0 z-20 size-full bg-white/5 backdrop-blur-[2px] dark:bg-gray-900/5"
        />
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          :variants="ANIMATIONS[props.direction ?? 'right']"
          :transition="{ ease: 'easeInOut', duration: 0.3 }"
          :class="
            sheetStyles({ direction: props.direction ?? 'right' }, $attrs.class as string)
          "
          v-bind="filteredAttrs"
        >
          <slot />
        </motion.div>
      </template>
    </animate-presence>
  </teleport>
</template>

<script setup lang="ts">
  import { AnimatePresence, motion } from "motion-v";
  import { useScale } from "../Scale";
  import type { UixySheetProps } from "./Sheet.types";
  import { sheetStyles } from "./Sheet.styles";

  const props = defineProps<UixySheetProps>();

  const ANIMATIONS = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
    },
  };

  defineOptions({
    inheritAttrs: false,
  });

  const attrs = useAttrs();

  const filteredAttrs = computed(() => {
    const { class: _, ...rest } = attrs;

    return rest;
  });

  const { setScale } = useScale();

  const open = defineModel<boolean>();

  const handleClick = () => {
    open.value = false;
  };

  watch(
    () => open.value,
    (v) => {
      if (v) return setScale(0.98);

      setScale(1);
    }
  );
</script>
