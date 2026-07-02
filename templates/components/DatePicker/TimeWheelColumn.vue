<template>
  <div
    ref="containerRef"
    class="relative overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    :class="props.disabled ? 'pointer-events-none opacity-40' : ''"
    :style="{ height: `${itemHeight * visibleCount}px`, scrollSnapType: 'y mandatory' }"
    @scroll="onScroll"
  >
    <div :style="{ height: `${spacer}px` }" aria-hidden="true" />
    <button
      v-for="(value, index) in props.values"
      :key="index"
      type="button"
      class="flex w-full items-center justify-center font-500 tabular-nums select-none transition-colors"
      style="scroll-snap-align: center"
      :style="itemStyle(index)"
      @click="selectIndex(index)"
    >
      {{ props.format ? props.format(value) : value }}
    </button>
    <div :style="{ height: `${spacer}px` }" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      values: (number | string)[];
      disabled?: boolean;
      itemHeight?: number;
      visibleCount?: number;
      format?: (value: number | string) => string;
    }>(),
    {
      itemHeight: 34,
      visibleCount: 5,
    }
  );

  const model = defineModel<number | string>();

  const containerRef = ref<HTMLElement>();

  const scrollTop = ref(0);

  const itemHeight = computed(() => props.itemHeight);

  const visibleCount = computed(() => props.visibleCount);

  const spacer = computed(
    () => (itemHeight.value * (visibleCount.value - 1)) / 2
  );

  const currentIndex = computed(() => {
    const idx = props.values.findIndex((v) => v === model.value);
    return idx === -1 ? 0 : idx;
  });

  const itemStyle = (index: number) => {
    const distance =
      Math.abs(index * itemHeight.value - scrollTop.value) / itemHeight.value;
    const opacity = Math.max(0.25, 1 - distance * 0.32);
    const scale = Math.max(0.78, 1 - distance * 0.12);
    return {
      height: `${itemHeight.value}px`,
      lineHeight: `${itemHeight.value}px`,
      opacity,
      transform: `scale(${scale})`,
    };
  };

  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let rafId = 0;

  const onScroll = () => {
    const el = containerRef.value;
    if (!el) return;

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        scrollTop.value = el.scrollTop;
        rafId = 0;
      });
    }

    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 110);
  };

  const settle = () => {
    const el = containerRef.value;
    if (!el) return;

    const index = Math.max(
      0,
      Math.min(props.values.length - 1, Math.round(el.scrollTop / itemHeight.value))
    );

    const value = props.values[index];
    if (value !== undefined && value !== model.value) model.value = value;
  };

  const scrollToIndex = (index: number) => {
    const el = containerRef.value;
    if (!el) return;

    const top = index * itemHeight.value;
    if (Math.abs(el.scrollTop - top) < 1) return;

    el.scrollTo({ top, behavior: "smooth" });
  };

  const selectIndex = (index: number) => {
    if (props.disabled) return;

    const value = props.values[index];
    if (value !== undefined && value !== model.value) model.value = value;

    scrollToIndex(index);
  };

  onMounted(() => {
    nextTick(() => {
      const el = containerRef.value;
      if (el) {
        el.scrollTop = currentIndex.value * itemHeight.value;
        scrollTop.value = el.scrollTop;
      }
    });
  });

  watch(
    () => model.value,
    () => {
      const el = containerRef.value;
      if (!el) return;

      const target = currentIndex.value * itemHeight.value;
      if (Math.abs(el.scrollTop - target) > 1) scrollToIndex(currentIndex.value);
    }
  );

  onUnmounted(() => {
    if (settleTimer) clearTimeout(settleTimer);
    if (rafId) cancelAnimationFrame(rafId);
  });
</script>
