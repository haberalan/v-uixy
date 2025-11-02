<template>
  <div ref="wrapperRef" class="relative w-full aspect-square">
    <svg
      ref="svgRef"
      width="100%"
      height="100%"
      :viewBox="`0 0 ${size} ${size}`"
      role="img"
      aria-label="Pie chart"
      class="block select-none pointer-events-none"
    >
      <motion.g
        :initial="{ transform: `rotate(0, ${center}, ${center})` }"
        :animate="{ transform: `rotate(0, ${center}, ${center})` }"
        :transition="groupTransition"
      >
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          class="stroke-gray-300 dark:stroke-gray-800"
          :stroke-width="thickness"
          vector-effect="non-scaling-stroke"
          shape-rendering="geometricPrecision"
        />
        <template v-if="isReady">
          <motion.circle
            v-for="seg in segmentsTimed"
            :key="seg.key"
            :initial="{
              strokeDasharray: `0 ${circumference}`,
              strokeDashoffset: seg.offset,
              opacity: 0.8,
            }"
            :animate="{
              strokeDasharray: `${seg.length} ${circumference}`,
              strokeDashoffset: seg.offset,
              opacity: 1,
            }"
            :transition="transitionFor(seg)"
            :cx="center"
            :cy="center"
            :r="radius"
            fill="none"
            :stroke="seg.color"
            :stroke-width="thickness - 2"
            stroke-linecap="butt"
            vector-effect="non-scaling-stroke"
            shape-rendering="geometricPrecision"
          />
        </template>
      </motion.g>
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";
  import { motion } from "motion-v";
  import type { UixyPieChartProps } from "./PieChart.types";

  type SegBase = { key: string; length: number; offset: number; color: string };
  type SegTimed = SegBase & { dur: number; delay: number };

  const INITIAL_TOTAL_DURATION = 1.2;
  const UPDATE_DURATION = 0.45;
  const OVERLAP = 0.02;
  const SIZE_EPSILON = 0.5;
  const EASING = "linear";

  const props = withDefaults(defineProps<UixyPieChartProps>(), {
    thickness: 18,
    animate: true,
  });

  const wrapperRef = ref<HTMLElement | null>(null);
  const svgRef = ref<SVGSVGElement | null>(null);
  const measuredSize = ref<number>(180);
  const roRef = ref<ResizeObserver | null>(null);
  const isReady = ref(false);
  const initialTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const size = computed(() => measuredSize.value);
  const center = computed(() => measuredSize.value / 2);
  const radius = computed(() =>
    Math.max(1, measuredSize.value / 2 - props.thickness / 2 - 2)
  );

  const circumference = computed(() => 2 * Math.PI * radius.value);

  const groupTransition = computed(() =>
    !isReady.value || isInitial.value
      ? { duration: 0 }
      : { duration: 0.35, easing: EASING }
  );

  const total = computed(() =>
    props.data.reduce((acc, d) => acc + Math.max(0, d.value), 0)
  );

  const segmentsBase = computed<SegBase[]>(() => {
    const totalVal = total.value || 1;
    let acc = 0;
    const list: SegBase[] = [];

    props.data.forEach((d, i) => {
      const frac = Math.max(0, d.value) / totalVal;
      const baseLen = frac * circumference.value;
      const drawLen = Math.max(0, baseLen);

      if (drawLen > 0) {
        list.push({
          key: `seg-${i}-${d.color ?? "c"}`,
          length: drawLen,
          offset: -acc,
          color: d.color || "#999999",
        });
      }

      acc += baseLen;
    });

    return list;
  });

  const segmentsTimed = computed<SegTimed[]>(() => {
    const totalDur = Math.max(0.01, INITIAL_TOTAL_DURATION);
    let running = 0;

    return segmentsBase.value.map((s) => {
      const dur = (s.length / Math.max(1e-6, circumference.value)) * totalDur;
      const delay = Math.max(0, running - OVERLAP);
      const segT: SegTimed = { ...s, dur, delay };
      running += dur;
      return segT;
    });
  });

  const isInitial = ref(true);

  watch(
    () => ({ ready: isReady.value }),
    ({ ready }) => {
      if (!ready) return;

      if (initialTimer.value) return;

      const totalDur = INITIAL_TOTAL_DURATION;

      initialTimer.value = setTimeout(() => {
        isInitial.value = false;
        if (initialTimer.value) {
          clearTimeout(initialTimer.value);
          initialTimer.value = null;
        }
      }, Math.ceil(totalDur * 1000) + 16);
    },
    { immediate: true }
  );

  onMounted(() => {
    startResizeObserver();
  });

  onUnmounted(() => {
    stopResizeObserver();

    if (initialTimer.value) {
      clearTimeout(initialTimer.value);
      initialTimer.value = null;
    }
  });

  const transitionFor = (seg: SegTimed) => {
    if (isInitial.value)
      return { delay: seg.delay, duration: seg.dur, easing: EASING } as const;

    return { delay: 0, duration: UPDATE_DURATION, easing: EASING };
  };

  const measure = () => {
    const el = wrapperRef.value ?? svgRef.value;

    if (!el) return;

    const rect = el.getBoundingClientRect();
    const next = Math.max(1, Math.min(rect.width || 0, rect.height || 0));

    if (Math.abs(next - measuredSize.value) > SIZE_EPSILON)
      measuredSize.value = next;

    if (!isReady.value && next > 1) isReady.value = true;
  };

  const startResizeObserver = () => {
    if (roRef.value) return;

    roRef.value = new ResizeObserver(measure);

    const el = wrapperRef.value ?? svgRef.value;

    if (el) roRef.value.observe(el);

    requestAnimationFrame(measure);
  };

  const stopResizeObserver = () => {
    if (!roRef.value) return;

    const el = wrapperRef.value ?? svgRef.value;

    if (el) roRef.value.unobserve(el);

    roRef.value.disconnect();
    roRef.value = null;
  };
</script>
