<template>
  <div class="relative w-full h-full">
    <svg
      width="100%"
      height="100%"
      :viewBox="`0 0 ${vbWidth} ${vbHeight}`"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Pixel chart"
      class="block select-none pointer-events-none overflow-visible"
      shape-rendering="crispEdges"
    >
      <rect
        v-for="cell in renderCells"
        :key="`base-${cell.key}`"
        :x="cell.x"
        :y="cell.y"
        :width="CELL"
        :height="CELL"
        class="fill-gray-200 dark:fill-gray-900"
      />

      <rect
        v-for="cell in renderCells"
        :key="`color-${cell.key}`"
        :x="cell.x"
        :y="cell.y"
        :width="CELL"
        :height="CELL"
        :class="cell.cls"
        :fill="cell.fill"
        :style="{
          opacity: cell.filled ? 1 : 0,
          transition: props.animate
            ? `opacity ${REVEAL_DURATION}s ease-out`
            : 'none',
        }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed, onUnmounted, ref, watch } from "vue";
  import type { UixyChartProps, UixyChartSeries } from "./Chart.types";

  const CELL = 12;
  const GAP = 2;

  const COLUMN_STEP = 0.05;
  const ROW_STEP = 0.04;
  const REVEAL_DURATION = 0.18;

  const TOP_HEADROOM = 0.15;
  const FADE_ROWS = 2;

  const DEFAULT_CLASSES = [
    "fill-gray-500 dark:fill-gray-600",
    "fill-gray-800 dark:fill-gray-300",
    "fill-gray-900 dark:fill-gray-200",
    "fill-black dark:fill-white",
  ];

  const props = withDefaults(defineProps<UixyChartProps>(), {
    rows: 8,
    animate: true,
  });

  type Paint = { fill?: string; cls?: string };

  type Cell = {
    key: string;
    x: number;
    y: number;
    filled: boolean;
    fill?: string;
    cls?: string;
  };

  const parseHex = (hex: string) => {
    let h = hex.replace("#", "").trim();
    if (h.length === 3)
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    const n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };

  const toHex = (r: number, g: number, b: number) => {
    const channel = (v: number) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, "0");
    return `#${channel(r)}${channel(g)}${channel(b)}`;
  };

  const mix = (a: string, b: string, t: number) => {
    const from = parseHex(a);
    const to = parseHex(b);
    return toHex(
      from.r + (to.r - from.r) * t,
      from.g + (to.g - from.g) * t,
      from.b + (to.b - from.b) * t,
    );
  };

  const peak = computed(() => props.color ?? "#000000");
  const base = computed(
    () =>
      props.baseColor ??
      (props.color ? mix(props.color, "#000000", 0.4) : "#000000"),
  );

  const paintForDepth = (depth: number): Paint => {
    if (!props.color) {
      const index = depth <= 0 ? 0 : depth > FADE_ROWS ? 3 : depth;
      return { cls: DEFAULT_CLASSES[index] };
    }
    if (depth <= 0) return { fill: peak.value };
    if (depth > FADE_ROWS) return { fill: base.value };
    return { fill: mix(peak.value, base.value, depth / (FADE_ROWS + 1)) };
  };

  const basePaint = (): Paint =>
    props.color ? { fill: base.value } : { cls: DEFAULT_CLASSES[3] };

  const rows = computed(() => Math.max(1, Math.floor(props.rows)));

  const series = computed<UixyChartSeries[]>(() => {
    if (props.series?.length) return props.series;
    if (props.data?.length)
      return [{ label: "data", values: props.data.map((d) => d.value) }];
    return [];
  });

  const columnCount = computed(() =>
    Math.max(0, ...series.value.map((s) => s.values.length)),
  );

  const columnTotals = computed(() =>
    Array.from({ length: columnCount.value }, (_, c) =>
      series.value.reduce((sum, s) => sum + Math.max(0, s.values[c] ?? 0), 0),
    ),
  );

  const usableRows = computed(() =>
    Math.max(1, Math.floor(rows.value * (1 - TOP_HEADROOM))),
  );

  const scale = computed(
    () => usableRows.value / Math.max(1, Math.max(0, ...columnTotals.value)),
  );

  const barHeights = computed(() =>
    columnTotals.value.map((total) =>
      Math.min(usableRows.value, Math.round(total * scale.value)),
    ),
  );

  const vbWidth = computed(
    () => columnCount.value * CELL + Math.max(0, columnCount.value - 1) * GAP,
  );
  const vbHeight = computed(() => rows.value * CELL + (rows.value - 1) * GAP);

  type Scheduled = {
    apply: () => void;
    done: boolean;
    timer?: ReturnType<typeof setTimeout>;
  };

  let prevHeights: number[] = [];
  let prevPaint: Record<string, Paint> = {};
  let scheduled: Scheduled[] = [];

  const renderCells = ref<Cell[]>([]);

  const flushScheduled = () => {
    scheduled.forEach((s) => {
      if (s.timer) clearTimeout(s.timer);
      if (!s.done) s.apply();
    });
    scheduled = [];
  };

  const ensureCells = () => {
    const needed = columnCount.value * rows.value;
    if (renderCells.value.length === needed) return;

    const cells: Cell[] = [];
    for (let col = 0; col < columnCount.value; col++) {
      const x = col * (CELL + GAP);
      for (let row = 0; row < rows.value; row++) {
        const y = vbHeight.value - (row + 1) * CELL - row * GAP;
        cells.push({
          key: `${col}-${row}`,
          x,
          y,
          filled: false,
          cls: DEFAULT_CLASSES[3],
        });
      }
    }

    renderCells.value = cells;
    prevHeights = [];
    prevPaint = {};
  };

  type CellTarget = {
    cell: Cell;
    filled: boolean;
    paint: Paint;
    waveStep: number;
    changed: boolean;
  };

  const build = () => {
    flushScheduled();
    ensureCells();

    const heights = barHeights.value;
    const nextPaint: Record<string, Paint> = {};

    const columns = Array.from({ length: columnCount.value }, (_, col) => {
      const height = heights[col] ?? 0;
      const prevHeight = prevHeights[col] ?? 0;
      const rising = height >= prevHeight;
      let columnChanged = height !== prevHeight;

      const targets: CellTarget[] = [];
      for (let row = 0; row < rows.value; row++) {
        const cell = renderCells.value[col * rows.value + row]!;
        const filled = row < height;
        const paint = filled
          ? paintForDepth(height - 1 - row)
          : (prevPaint[cell.key] ?? basePaint());
        nextPaint[cell.key] = paint;

        const changed =
          cell.filled !== filled ||
          cell.fill !== paint.fill ||
          cell.cls !== paint.cls;
        if (changed) columnChanged = true;

        targets.push({
          cell,
          filled,
          paint,
          waveStep: rising ? row : rows.value - 1 - row,
          changed,
        });
      }

      return { columnChanged, targets };
    });

    let activeColumn = 0;
    columns.forEach(({ columnChanged, targets }) => {
      const columnDelay = activeColumn * COLUMN_STEP;
      if (columnChanged) activeColumn++;

      targets.forEach(({ cell, filled, paint, waveStep, changed }) => {
        if (!changed) return;

        const apply = () => {
          cell.filled = filled;
          cell.fill = paint.fill;
          cell.cls = paint.cls;
        };

        const delay = props.animate ? columnDelay + waveStep * ROW_STEP : 0;
        if (delay <= 0) {
          apply();
          return;
        }

        const record: Scheduled = { apply, done: false };
        record.timer = setTimeout(() => {
          record.done = true;
          apply();
        }, delay * 1000);
        scheduled.push(record);
      });
    });

    prevHeights = heights.slice();
    prevPaint = nextPaint;
  };

  watch(
    [
      barHeights,
      () => props.color,
      () => props.baseColor,
      () => props.animate,
      rows,
      columnCount,
    ],
    build,
    { immediate: true },
  );

  onUnmounted(() => {
    scheduled.forEach((s) => s.timer && clearTimeout(s.timer));
  });
</script>
