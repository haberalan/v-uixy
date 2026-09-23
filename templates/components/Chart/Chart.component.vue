<template>
  <div
    ref="wrapperRef"
    class="relative h-full w-full"
    :class="props.interactive ? 'cursor-crosshair touch-pan-y' : ''"
    :tabindex="props.interactive ? 0 : undefined"
    :role="props.interactive ? 'group' : 'img'"
    :aria-roledescription="props.interactive ? 'chart' : undefined"
    :aria-label="ariaLabel"
    @pointermove="handlePointerMove"
    @pointerdown="handlePointerDown"
    @pointerleave="handlePointerLeave"
    @pointercancel="handlePointerCancel"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
  >
    <svg
      v-if="ready"
      :width="chartWidth"
      :height="chartHeight"
      :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
      aria-hidden="true"
      class="block select-none overflow-visible"
    >
      <defs>
        <pattern
          :id="patternId"
          patternUnits="userSpaceOnUse"
          :x="gridX"
          :y="gridY"
          :width="cellSize + GAP"
          :height="cellSize + GAP"
        >
          <rect
            :width="cellSize"
            :height="cellSize"
            class="fill-gray-200 dark:fill-gray-900"
            shape-rendering="crispEdges"
          />
        </pattern>
      </defs>

      <rect
        :x="gridX"
        :y="gridY"
        :width="gridWidth"
        :height="gridHeight"
        :fill="`url(#${patternId})`"
      />

      <g v-if="props.axis" class="pointer-events-none">
        <template v-for="tick in yTicks" :key="tick.value">
          <text
            :x="yLabelX"
            :y="tick.y"
            text-anchor="end"
            dominant-baseline="middle"
            class="fill-gray-500 text-[11px] font-500 tabular-nums dark:fill-gray-600"
          >
            {{ tick.label }}
          </text>
          <rect
            :x="yDotX - 1"
            :y="tick.y - 1"
            width="2"
            height="2"
            class="fill-gray-400 dark:fill-gray-700"
            shape-rendering="crispEdges"
          />
        </template>
      </g>

      <g
        v-if="props.interactive"
        class="pointer-events-none"
        :style="followStyle"
      >
        <rect
          :x="-(cellSize + GAP) / 2"
          :y="gridY"
          :width="cellSize + GAP"
          :height="gridHeight"
          class="fill-black/[0.04] dark:fill-white/[0.06]"
        />
      </g>

      <g class="pointer-events-none" shape-rendering="crispEdges">
        <rect
          v-for="cell in cells"
          :key="cell.key"
          :x="cellX(cell.col)"
          :y="cellY(cell.row)"
          :width="cellSize"
          :height="cellSize"
          :class="cell.className"
          :fill="cell.fill"
          :style="{
            opacity: cell.filled ? 1 : 0,
            transition: revealTransition,
          }"
        />
      </g>

      <g
        v-if="props.interactive"
        class="pointer-events-none"
        :style="followStyle"
      >
        <line
          x1="0"
          x2="0"
          :y1="gridY"
          :y2="gridBottom"
          stroke-width="1"
          stroke-dasharray="2 4"
          class="stroke-gray-500 dark:stroke-gray-600"
        />
        <g :style="markerStyle">
          <circle
            r="4.5"
            stroke-width="2"
            class="fill-black stroke-white dark:fill-white dark:stroke-black"
          />
        </g>
      </g>

      <g v-if="props.axis" class="pointer-events-none">
        <text
          v-for="tick in xTicks"
          :key="tick.start"
          :x="tick.x"
          :y="xLabelY"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[11px] font-500 tracking-[0.08em] transition-[fill] duration-150"
          :class="
            tick.active
              ? 'fill-black dark:fill-white'
              : 'fill-gray-500 dark:fill-gray-600'
          "
        >
          {{ tick.label }}
        </text>
        <rect
          v-for="x in xSeparators"
          :key="x"
          :x="x - 1"
          :y="xLabelY - 1"
          width="2"
          height="2"
          class="fill-gray-400 dark:fill-gray-700"
          shape-rendering="crispEdges"
        />
      </g>
    </svg>

    <div
      v-if="props.interactive"
      ref="tooltipRef"
      class="pointer-events-none absolute top-0 left-0 z-10 origin-top-left"
      :style="tooltipStyle"
      aria-hidden="true"
    >
      <div
        class="min-w-[168px] rounded-3 border border-solid border-gray-300 bg-white p-1 shadow-lg dark:border-gray-900 dark:bg-gray-1000"
      >
        <div
          class="rounded-2 bg-gray-200 px-2 py-1 text-sm font-500 text-gray-600 dark:bg-gray-900 dark:text-gray-500"
        >
          {{ tooltipTitle }}
        </div>

        <div class="flex flex-col gap-1 px-2 py-2">
          <div
            v-for="(row, index) in tooltipRows"
            :key="index"
            class="flex items-center gap-2"
          >
            <span
              class="size-1.5 shrink-0 rounded-full"
              :class="row.swatchClass"
              :style="row.swatchStyle"
            />
            <span class="text-sm text-gray-600 dark:text-gray-500">
              {{ row.label }}
            </span>
            <span
              class="ml-auto text-sm font-600 tabular-nums text-black dark:text-white"
            >
              {{ row.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <span v-if="props.interactive" class="sr-only" aria-live="polite">
      {{ announcement }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useId, watch } from "vue";
  import type { UixyChartProps, UixyChartSeries } from "./Chart.types";

  type Point = { x: number; y: number };

  type Paint = { fill?: string; className?: string };

  type Cell = Paint & {
    key: string;
    col: number;
    row: number;
    filled: boolean;
  };

  type Segment = { series: number; start: number; end: number };

  type Stack = { segments: Segment[]; height: number };

  type LabelRun = { label: string; start: number; end: number };

  type Unit = { divisor: number; suffix: string };

  type Batch = { timer: ReturnType<typeof setTimeout>; tasks: (() => void)[] };

  const GAP = 2;
  const FADE_ROWS = 2;
  const TOP_HEADROOM = 0.08;

  const COLUMN_STEP = 0.05;
  const ROW_STEP = 0.04;
  const REVEAL_DURATION = 0.18;

  const MOVE_TRANSITION = "transform 0.18s cubic-bezier(0.22, 1, 0.36, 1)";
  const FADE_TRANSITION = "opacity 0.12s ease-out";
  const SCALE_TRANSITION = "scale 0.12s ease-out";

  const CHAR_WIDTH = 6.6;
  const X_AXIS_HEIGHT = 26;
  const X_LABEL_OFFSET = 16;
  const X_LABEL_PADDING = 24;
  const Y_LABEL_GAP = 16;
  const Y_DOT_GAP = 8;
  const Y_TICK_MIN_SPACING = 26;

  const TOOLTIP_OFFSET = 14;
  const TOOLTIP_MARGIN = 4;

  const HEX = /^#?([\da-f]{3}|[\da-f]{6})$/i;

  const UNITS: Unit[] = [
    { divisor: 1e9, suffix: "B" },
    { divisor: 1e6, suffix: "M" },
    { divisor: 1e3, suffix: "k" },
  ];

  const FADE = [
    "fill-gray-500 dark:fill-gray-600",
    "fill-gray-800 dark:fill-gray-300",
    "fill-gray-900 dark:fill-gray-200",
  ];

  const PALETTE = [
    { fill: "fill-black dark:fill-white", swatch: "bg-black dark:bg-white" },
    {
      fill: "fill-gray-400 dark:fill-gray-600",
      swatch: "bg-gray-400 dark:bg-gray-600",
    },
    {
      fill: "fill-gray-600 dark:fill-gray-500",
      swatch: "bg-gray-600 dark:bg-gray-500",
    },
  ];

  const props = withDefaults(defineProps<UixyChartProps>(), {
    rows: 8,
    animate: true,
    axis: true,
    interactive: true,
  });

  const patternId = `uixy-chart-grid-${useId()}`;

  const wrapperRef = ref<HTMLElement | null>(null);
  const tooltipRef = ref<HTMLElement | null>(null);

  const chartWidth = ref(0);
  const parentHeight = ref(0);
  const heightFromParent = ref<boolean | null>(null);
  const tooltipSize = ref({ width: 168, height: 92 });

  const hoveredColumn = ref<number | null>(null);
  const focusedColumn = ref<number | null>(null);

  const cells = ref<Cell[]>([]);

  const crosshairAt = ref<Point>({ x: 0, y: 0 });
  const tooltipAt = ref<Point>({ x: 0, y: 0 });
  const instant = ref(true);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const valueAt = (entry: UixyChartSeries, col: number) =>
    Math.max(0, entry.values[col] ?? 0);

  const series = computed<UixyChartSeries[]>(() => {
    if (props.series?.length) return props.series;
    if (props.data?.length)
      return [{ label: "Value", values: props.data.map((d) => d.value) }];
    return [];
  });

  const labels = computed<string[]>(() => {
    if (props.labels?.length) return props.labels;
    if (props.data?.length) return props.data.map((d) => d.label);
    return [];
  });

  const rows = computed(() => Math.max(1, Math.floor(props.rows)));

  const columnCount = computed(() =>
    Math.max(0, ...series.value.map((entry) => entry.values.length)),
  );

  const maxTotal = computed(() =>
    Math.max(
      0,
      ...Array.from({ length: columnCount.value }, (_, col) =>
        series.value.reduce((sum, entry) => sum + valueAt(entry, col), 0),
      ),
    ),
  );

  const niceStep = (raw: number) => {
    if (raw <= 0) return 1;

    const magnitude = 10 ** Math.floor(Math.log10(raw));
    const fraction = raw / magnitude;
    const nice =
      fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;

    return nice * magnitude;
  };

  const yScale = computed(() => {
    const target = maxTotal.value * (1 + TOP_HEADROOM) || 1;
    let best = { steps: 0, step: 0, max: Infinity };

    for (const steps of [3, 4, 5, 6]) {
      const step = niceStep(target / steps);
      const max = step * steps;

      if (max < best.max || (max === best.max && steps > best.steps))
        best = { steps, step, max };
    }

    return best;
  });

  const yTickValues = computed(() =>
    Array.from(
      { length: yScale.value.steps + 1 },
      (_, index) => index * yScale.value.step,
    ),
  );

  const unitFor = (value: number): Unit =>
    UNITS.find((unit) => value >= unit.divisor) ?? { divisor: 1, suffix: "" };

  const compact = (value: number, { divisor, suffix }: Unit) => {
    const scaled = value / divisor;
    const text =
      Number.isInteger(scaled) || Math.abs(scaled) >= 100
        ? String(Math.round(scaled))
        : scaled.toFixed(1).replace(/\.0$/, "");

    return `${text}${suffix}`;
  };

  const tickUnit = computed(() => unitFor(yScale.value.max));

  const formatTick = (value: number) =>
    props.format ? props.format(value) : compact(value, tickUnit.value);

  const formatValue = (value: number) =>
    props.format ? props.format(value) : compact(value, unitFor(value));

  const parseHex = (hex: string) => {
    let digits = hex.replace("#", "");
    if (digits.length === 3)
      digits = [...digits].map((digit) => digit + digit).join("");

    const n = parseInt(digits, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const mix = (from: string, to: string, amount: number) => {
    const a = parseHex(from);
    const b = parseHex(to);

    const channels = a.map((channel, index) =>
      Math.round(channel + (b[index]! - channel) * amount)
        .toString(16)
        .padStart(2, "0"),
    );

    return `#${channels.join("")}`;
  };

  const colorsOf = (index: number) => {
    const entry = series.value[index];

    return {
      color: entry?.color ?? (index === 0 ? props.color : undefined),
      baseColor:
        entry?.baseColor ?? (index === 0 ? props.baseColor : undefined),
    };
  };

  const colorKey = computed(() =>
    series.value.map((_, index) => Object.values(colorsOf(index))).join(),
  );

  const isSingleSeries = computed(() => series.value.length === 1);

  const fadedPaint = (depth: number): Paint => {
    const { color, baseColor } = colorsOf(0);

    if (!color)
      return { className: depth > FADE_ROWS ? PALETTE[0]!.fill : FADE[depth] };

    const blendable = HEX.test(color) && (!baseColor || HEX.test(baseColor));
    const body = baseColor ?? (blendable ? mix(color, "#000000", 0.4) : color);

    if (depth <= 0) return { fill: color };
    if (depth > FADE_ROWS || !blendable) return { fill: body };
    return { fill: mix(color, body, depth / (FADE_ROWS + 1)) };
  };

  const seriesPaint = (index: number): Paint => {
    const { color } = colorsOf(index);
    if (color) return { fill: color };
    return { className: PALETTE[index % PALETTE.length]!.fill };
  };

  const swatchOf = (index: number) => {
    const { color } = colorsOf(index);
    if (color) return { swatchStyle: { backgroundColor: color } };
    return { swatchClass: PALETTE[index % PALETTE.length]!.swatch };
  };

  const stacks = computed<Stack[]>(() =>
    Array.from({ length: columnCount.value }, (_, col) => {
      const segments: Segment[] = [];
      let total = 0;
      let height = 0;

      series.value.forEach((entry, index) => {
        const value = valueAt(entry, col);
        total += value;

        let end = Math.round((total / yScale.value.max) * rows.value);
        if (value > 0 && end <= height) end = height + 1;
        end = Math.min(rows.value, end);

        if (end > height) segments.push({ series: index, start: height, end });
        height = end;
      });

      return { segments, height };
    }),
  );

  const yAxisWidth = computed(() => {
    if (!props.axis) return 0;

    const longest = Math.max(
      ...yTickValues.value.map((value) => formatTick(value).length),
    );

    return Math.ceil(longest * CHAR_WIDTH) + Y_LABEL_GAP;
  });

  const xAxisHeight = computed(() => (props.axis ? X_AXIS_HEIGHT : 0));

  const fitCells = (space: number, count: number) =>
    Math.floor((space - (count - 1) * GAP) / count);

  const plotWidth = computed(() =>
    Math.max(0, chartWidth.value - yAxisWidth.value),
  );

  const naturalHeight = computed(() => {
    if (!columnCount.value) return 0;

    const size = Math.max(1, fitCells(plotWidth.value, columnCount.value));
    return rows.value * size + (rows.value - 1) * GAP + xAxisHeight.value;
  });

  const chartHeight = computed(() =>
    heightFromParent.value ? parentHeight.value : naturalHeight.value,
  );

  const plotHeight = computed(() =>
    Math.max(0, chartHeight.value - xAxisHeight.value),
  );

  const ready = computed(
    () =>
      chartWidth.value > 0 && chartHeight.value > 0 && columnCount.value > 0,
  );

  const cellSize = computed(() => {
    if (!columnCount.value) return 0;

    return Math.max(
      1,
      Math.min(
        fitCells(plotWidth.value, columnCount.value),
        fitCells(plotHeight.value, rows.value),
      ),
    );
  });

  const spanOf = (count: number) => count * cellSize.value + (count - 1) * GAP;

  const gridWidth = computed(() => spanOf(columnCount.value));
  const gridHeight = computed(() => spanOf(rows.value));

  const gridX = computed(
    () =>
      yAxisWidth.value +
      Math.max(0, Math.round((plotWidth.value - gridWidth.value) / 2)),
  );

  const gridY = computed(() =>
    Math.max(0, plotHeight.value - gridHeight.value),
  );

  const gridBottom = computed(() => gridY.value + gridHeight.value);

  const cellX = (col: number) => gridX.value + col * (cellSize.value + GAP);

  const cellY = (row: number) =>
    gridBottom.value - (row + 1) * cellSize.value - row * GAP;

  const columnCenter = (col: number) => cellX(col) + cellSize.value / 2;

  const stackTop = (col: number) => {
    const height = stacks.value[col]?.height ?? 0;
    return height ? cellY(height - 1) : gridBottom.value;
  };

  const yLabelX = computed(() => gridX.value - Y_LABEL_GAP);
  const yDotX = computed(() => gridX.value - Y_DOT_GAP);
  const xLabelY = computed(() => gridBottom.value + X_LABEL_OFFSET);

  const yTicks = computed(() => {
    const spacing = gridHeight.value / yScale.value.steps;
    const every = Math.max(
      1,
      Math.ceil(Y_TICK_MIN_SPACING / Math.max(1, spacing)),
    );

    return yTickValues.value
      .filter((_, index) => index % every === 0)
      .map((value) => ({
        value,
        label: formatTick(value),
        y: gridBottom.value - (value / yScale.value.max) * gridHeight.value,
      }));
  });

  const labelRuns = computed<LabelRun[]>(() => {
    const source = props.axisLabels?.length ? props.axisLabels : labels.value;
    const count = columnCount.value;

    if (!source.length || !count) return [];

    if (source.length !== count)
      return source
        .map((label, index) => ({
          label,
          start: Math.round((index * count) / source.length),
          end: Math.round(((index + 1) * count) / source.length),
        }))
        .filter((run) => run.end > run.start);

    const runs: LabelRun[] = [];

    source.forEach((label, index) => {
      const previous = runs[runs.length - 1];
      if (previous?.label === label) previous.end = index + 1;
      else runs.push({ label, start: index, end: index + 1 });
    });

    return runs;
  });

  const xTicks = computed(() => {
    const runs = labelRuns.value;
    if (!runs.length) return [];

    const widest = Math.max(
      ...runs.map((run) => run.label.length * CHAR_WIDTH + X_LABEL_PADDING),
    );
    const every = Math.max(
      1,
      Math.ceil(widest / Math.max(1, gridWidth.value / runs.length)),
    );
    const visible = runs.filter((_, index) => index % every === 0);
    const active = activeColumn.value;

    return visible.map((run, index) => {
      const until = visible[index + 1]?.start ?? columnCount.value;

      return {
        label: run.label,
        start: run.start,
        x: (columnCenter(run.start) + columnCenter(run.end - 1)) / 2,
        active: active !== null && active >= run.start && active < until,
      };
    });
  });

  const xSeparators = computed(() =>
    xTicks.value
      .slice(1)
      .map((tick, index) => (xTicks.value[index]!.x + tick.x) / 2),
  );

  const activeColumn = computed(() => {
    if (!props.interactive) return null;

    const col = hoveredColumn.value ?? focusedColumn.value;
    return col !== null && col < columnCount.value ? col : null;
  });

  const crosshair = computed<Point | null>(() => {
    const col = activeColumn.value;
    if (col === null || !ready.value) return null;

    return { x: columnCenter(col), y: stackTop(col) };
  });

  const tooltipTitle = computed(() => {
    const col = activeColumn.value;
    if (col === null) return "";

    return labels.value[col] ?? `#${col + 1}`;
  });

  const tooltipRows = computed(() => {
    const col = activeColumn.value;
    if (col === null) return [];

    return series.value.map((entry, index) => ({
      label: entry.label,
      value: formatValue(valueAt(entry, col)),
      ...swatchOf(index),
    }));
  });

  const announcement = computed(() => {
    if (focusedColumn.value === null || !tooltipRows.value.length) return "";

    const values = tooltipRows.value
      .map((row) => `${row.label} ${row.value}`)
      .join(", ");

    return `${tooltipTitle.value}: ${values}`;
  });

  const ariaLabel = computed(() => {
    if (!series.value.length) return "Chart";

    const names = series.value.map((entry) => entry.label).join(", ");

    return [
      `Chart with ${columnCount.value} columns`,
      `series: ${names}`,
      `peak ${formatValue(maxTotal.value)}`,
    ].join(", ");
  });

  const revealTransition = computed(() =>
    props.animate ? `opacity ${REVEAL_DURATION}s ease-out` : "none",
  );

  const followStyle = computed(() => ({
    transform: `translateX(${crosshairAt.value.x}px)`,
    opacity: crosshair.value ? 1 : 0,
    transition: instant.value
      ? FADE_TRANSITION
      : `${MOVE_TRANSITION}, ${FADE_TRANSITION}`,
  }));

  const markerStyle = computed(() => ({
    transform: `translateY(${crosshairAt.value.y}px)`,
    transition: instant.value ? "none" : MOVE_TRANSITION,
  }));

  const tooltipStyle = computed(() => ({
    transform: `translate3d(${tooltipAt.value.x}px, ${tooltipAt.value.y}px, 0)`,
    scale: crosshair.value ? 1 : 0.96,
    opacity: crosshair.value ? 1 : 0,
    transition: instant.value
      ? `${FADE_TRANSITION}, ${SCALE_TRANSITION}`
      : `${MOVE_TRANSITION}, ${FADE_TRANSITION}, ${SCALE_TRANSITION}`,
  }));

  const placeTooltip = ({ x, y }: Point) => {
    const size = tooltipSize.value;
    const right = x + TOOLTIP_OFFSET + size.width;
    const flipped = right > chartWidth.value - TOOLTIP_MARGIN;

    return {
      flipped,
      x: clamp(
        flipped ? x - TOOLTIP_OFFSET - size.width : x + TOOLTIP_OFFSET,
        TOOLTIP_MARGIN,
        chartWidth.value - size.width - TOOLTIP_MARGIN,
      ),
      y: clamp(
        y - TOOLTIP_OFFSET,
        TOOLTIP_MARGIN,
        chartHeight.value - size.height - TOOLTIP_MARGIN,
      ),
    };
  };

  let instantFrame = 0;
  let tooltipFlipped = false;

  const skipTransition = () => {
    instant.value = true;

    cancelAnimationFrame(instantFrame);
    instantFrame = requestAnimationFrame(() => {
      instantFrame = requestAnimationFrame(() => {
        instant.value = false;
      });
    });
  };

  watch(
    crosshair,
    (next, previous) => {
      if (!next) return;

      const { flipped, x, y } = placeTooltip(next);
      if (!previous || flipped !== tooltipFlipped) skipTransition();

      tooltipFlipped = flipped;
      crosshairAt.value = next;
      tooltipAt.value = { x, y };
    },
    { flush: "sync" },
  );

  const columnAt = (clientX: number) => {
    const left = wrapperRef.value!.getBoundingClientRect().left;
    const offset = clientX - left - gridX.value - cellSize.value / 2;

    return clamp(
      Math.round(offset / (cellSize.value + GAP)),
      0,
      columnCount.value - 1,
    );
  };

  const nextColumn = (key: string, from: number) => {
    switch (key) {
      case "ArrowRight":
        return from + 1;
      case "ArrowLeft":
        return from - 1;
      case "Home":
        return 0;
      case "End":
        return columnCount.value - 1;
      default:
        return null;
    }
  };

  const handlePointerMove = (event: PointerEvent) => {
    hoveredColumn.value = columnAt(event.clientX);
  };

  const handlePointerDown = (event: PointerEvent) => {
    focusedColumn.value = null;
    handlePointerMove(event);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "touch") hoveredColumn.value = null;
  };

  const handlePointerCancel = () => {
    hoveredColumn.value = null;
  };

  const handleOutsidePointerDown = (event: PointerEvent) => {
    if (!wrapperRef.value?.contains(event.target as Node))
      hoveredColumn.value = null;
  };

  const handleFocus = (event: FocusEvent) => {
    if ((event.target as HTMLElement).matches(":focus-visible"))
      focusedColumn.value ??= 0;
  };

  const handleBlur = () => {
    focusedColumn.value = null;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      hoveredColumn.value = null;
      focusedColumn.value = null;
      return;
    }

    const target = nextColumn(event.key, activeColumn.value ?? 0);
    if (target === null) return;

    event.preventDefault();
    hoveredColumn.value = null;
    focusedColumn.value = clamp(target, 0, columnCount.value - 1);
  };

  const batches = new Map<number, Batch>();
  let cellsShape = "";

  const schedule = (delay: number, task: () => void) => {
    const batch = batches.get(delay);

    if (batch) {
      batch.tasks.push(task);
      return;
    }

    batches.set(delay, {
      tasks: [task],
      timer: setTimeout(() => {
        batches.get(delay)?.tasks.forEach((run) => run());
        batches.delete(delay);
      }, delay),
    });
  };

  const cancelBatches = () => {
    batches.forEach(({ timer }) => clearTimeout(timer));
    batches.clear();
  };

  const flushBatches = () => {
    const tasks = [...batches.values()].flatMap((batch) => batch.tasks);

    cancelBatches();
    tasks.forEach((run) => run());
  };

  const ensureCells = () => {
    const shape = `${columnCount.value}x${rows.value}`;
    if (shape === cellsShape) return;
    cellsShape = shape;

    cells.value = Array.from({ length: columnCount.value }, (_, col) =>
      Array.from({ length: rows.value }, (_, row) => ({
        key: `${col}-${row}`,
        col,
        row,
        filled: false,
        className: PALETTE[0]!.fill,
      })),
    ).flat();
  };

  const targetPaint = (segment: Segment, row: number, height: number) =>
    isSingleSeries.value
      ? fadedPaint(height - 1 - row)
      : seriesPaint(segment.series);

  const syncCells = () => {
    flushBatches();
    ensureCells();

    if (!ready.value) return;

    let wave = 0;

    stacks.value.forEach(({ segments, height }, col) => {
      const firstCell = col * rows.value;
      const column = cells.value.slice(firstCell, firstCell + rows.value);
      const rising = height >= column.filter((cell) => cell.filled).length;
      const columnDelay = wave * COLUMN_STEP;
      let changed = false;

      column.forEach((cell, row) => {
        const segment = segments.find(
          ({ start, end }) => row >= start && row < end,
        );
        const filled = !!segment;
        const { fill, className } = segment
          ? targetPaint(segment, row, height)
          : cell;

        const unchanged =
          filled === cell.filled &&
          fill === cell.fill &&
          className === cell.className;

        if (unchanged) return;

        changed = true;

        const apply = () => Object.assign(cell, { filled, fill, className });
        const step = rising ? row : rows.value - 1 - row;
        const delay = props.animate
          ? Math.round((columnDelay + step * ROW_STEP) * 1000)
          : 0;

        if (delay > 0) schedule(delay, apply);
        else apply();
      });

      if (changed) wave++;
    });
  };

  watch([stacks, colorKey, () => props.animate, ready], syncCells, {
    immediate: true,
    flush: "post",
  });

  let observer: ResizeObserver | null = null;

  const measure = () => {
    const wrapper = wrapperRef.value;
    const tooltip = tooltipRef.value;

    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();

      if (heightFromParent.value === null && rect.width > 0)
        heightFromParent.value = rect.height > 0;

      chartWidth.value = rect.width;
      parentHeight.value = rect.height;
    }

    if (tooltip) {
      tooltipSize.value = {
        width: tooltip.offsetWidth,
        height: tooltip.offsetHeight,
      };
    }
  };

  onMounted(() => {
    observer = new ResizeObserver(measure);

    if (wrapperRef.value) observer.observe(wrapperRef.value);
    if (tooltipRef.value) observer.observe(tooltipRef.value);

    document.addEventListener("pointerdown", handleOutsidePointerDown);
  });

  onUnmounted(() => {
    observer?.disconnect();
    document.removeEventListener("pointerdown", handleOutsidePointerDown);
    cancelAnimationFrame(instantFrame);
    cancelBatches();
  });
</script>
