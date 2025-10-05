<template>
  <div class="flex flex-col">
    <div :class="tabsNavWrapperStyles()">
      <motion.div
        v-for="tab in props.tabs"
        :key="tab.value"
        @click="active = tab.value"
        :class="tabsNavInnerWrapperStyles()"
      >
        {{ tab.label }}
        <animate-presence mode="wait" :initial="false">
          <motion.div
            v-if="active === tab.value"
            :layoutId
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2, ease: 'easeInOut' }"
            :class="tabsNavStyles({ variant: props.variant })"
          />
        </animate-presence>
      </motion.div>
    </div>
    <slot name="nav-extra" />
    <div>
      <animate-presence mode="wait" :initial="false">
        <motion.div
          :key="active"
          :initial="{ opacity: 0, y: 4 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 4 }"
          :transition="{ duration: 0.2, ease: 'easeInOut' }"
        >
          <slot :name="active" />
        </motion.div>
      </animate-presence>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    tabsNavStyles,
    tabsNavInnerWrapperStyles,
    tabsNavWrapperStyles,
  } from "./Tabs.styles";
  import type { UixyTabsProps } from "./Tabs.types";
  import { motion, AnimatePresence } from "motion-v";
  import { v4 as uuidv4 } from "uuid";

  const props = defineProps<UixyTabsProps>();

  const active = defineModel<UixyTabsProps["tabs"][0]["value"]>();

  const layoutId = computed(() => `uixy-tabs-${uuidv4()}`);

  onBeforeMount(() => {
    if (props.tabs.length > 0) active.value = props.tabs[0].value;
  });
</script>
