<template>
  <div
    ref="rootRef"
    class="flex w-full flex-col items-center gap-4"
    :role="props.interactive ? 'group' : 'img'"
    :aria-roledescription="props.interactive ? 'pie chart' : undefined"
    :aria-label="ariaLabel"
  >
    <div
      ref="ringRef"
      class="relative aspect-square w-full rounded-full"
      :class="props.interactive ? 'cursor-crosshair touch-pan-y' : ''"
      :tabindex="props.interactive ? 0 : undefined"
      @pointermove="handlePointerMove"
      @pointerdown="handlePointerDown"
      @pointerleave="handlePointerLeave"
      @pointercancel="clearHover"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
      <svg
        v-if="ready"
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        aria-hidden="true"
        class="pointer-events-none block select-none"
      >
        <g
          v-for="cell in cells"
          :key="cell.key"
          :transform="cellTransform(cell)"
        >
          <rect
            :x="-cellSize / 2"
            :y="-cellSize / 2"
            :width="cellSize"
            :height="cellSize"
            class="fill-gray-200 dark:fill-gray-900"
          />
          <rect
            :x="-cellSize / 2"
            :y="-cellSize / 2"
            :width="cellSize"
            :height="cellSize"
            :class="cell.className"
            :fill="cell.fill"
            :style="cellStyle(cell)"
          />
        </g>
      </svg>

      <div
        v-if="ready && showCenter"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        aria-hidden="true"
      >
        <span class="text-xs text-gray-500 dark:text-gray-600">
          {{ centerCaption }}
        </span>
        <span
          class="font-600 tabular-nums text-black dark:text-white"
          :style="{ fontSize: `${centerFontSize}px`, lineHeight: 1.15 }"
        >
          {{ centerValue }}
        </span>
        <span
          class="text-xs tabular-nums text-gray-500 dark:text-gray-600"
          :class="activeSlice ? '' : 'invisible'"
        >
          {{ activeSlice?.shareLabel ?? "–" }}
        </span>
      </div>
    </div>

    <ul
      v-if="props.legend && slices.length"
      class="flex flex-wrap justify-center gap-x-4 gap-y-1.5"
      aria-hidden="true"
    >
      <li
        v-for="slice in slices"
        :key="slice.index"
        class="flex items-center gap-1.5 text-xs transition-opacity duration-150"
        :class="isDimmed(slice.index) ? 'opacity-40' : ''"
        @pointerenter="handleLegendEnter(slice.index)"
        @pointerdown="handleLegendEnter(slice.index)"
        @pointerleave="handlePointerLeave"
      >
        <span
          class="size-2 shrink-0"
          :class="slice.swatchClass"
          :style="slice.swatchStyle"
        />
        <span class="text-gray-600 dark:text-gray-500">{{ slice.label }}</span>
        <span class="font-500 tabular-nums text-black dark:text-white">
          {{ slice.shareLabel }}
        </span>
      </li>
    </ul>

    <span v-if="props.interactive" class="sr-only" aria-live="polite">
      {{ announcement }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";
  import type { UixyPieChartProps } from "./PieChart.types";

  type Paint = { fill?: string; className?: string };

  type RingCell = {
    key: string;
    seed: number;
    turn: number;
    radius: number;
  };

  type Cell = RingCell & Paint & { slice: number | null; filled: boolean };

  type Slice = {
    index: number;
    label: string;
    value: number;
    share: number;
    end: number;
    shareLabel: string;
    swatchClass?: string;
    swatchStyle?: { backgroundColor: string };
  };

  type Unit = { divisor: number; suffix: string };

  type Batch = { timer: ReturnType<typeof setTimeout>; tasks: (() => void)[] };

  const GAP = 3;
  const MIN_RESOLUTION = 7;
  const MAX_THICKNESS_RATIO = 0.35;
  const HIT_TOLERANCE = 0.5;

  const HIDDEN_SCALE = 0.3;
  const DIMMED_SCALE = 0.55;

  const DISSOLVE_DURATION = 0.6;
  const POP_TRANSITION = "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)";
  const FADE_TRANSITION = "opacity 0.18s ease-out";

  const CENTER_MIN_SIZE = 56;
  const CENTER_FONT_RATIO = 0.22;
  const CENTER_FONT_MIN = 14;
  const CENTER_FONT_MAX = 40;

  const UNITS: Unit[] = [
    { divisor: 1e9, suffix: "B" },
    { divisor: 1e6, suffix: "M" },
    { divisor: 1e3, suffix: "k" },
  ];

  const PALETTE = [
    { fill: "fill-black dark:fill-white", swatch: "bg-black dark:bg-white" },
    {
      fill: "fill-gray-500 dark:fill-gray-600",
      swatch: "bg-gray-500 dark:bg-gray-600",
    },
    {
      fill: "fill-gray-700 dark:fill-gray-400",
      swatch: "bg-gray-700 dark:bg-gray-400",
    },
    {
      fill: "fill-gray-400 dark:fill-gray-700",
      swatch: "bg-gray-400 dark:bg-gray-700",
    },
    {
      fill: "fill-gray-600 dark:fill-gray-500",
      swatch: "bg-gray-600 dark:bg-gray-500",
    },
  ];

  const props = withDefaults(defineProps<UixyPieChartProps>(), {
    resolution: 27,
    thickness: 5,
    total: "Total",
    legend: true,
    animate: true,
    interactive: true,
  });

  const rootRef = ref<HTMLElement | null>(null);
  const ringRef = ref<HTMLElement | null>(null);

  const size = ref(0);

  const hoveredSlice = ref<number | null>(null);
  const focusedSlice = ref<number | null>(null);

  const cells = ref<Cell[]>([]);

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  const noise = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  const unitFor = (value: number): Unit =>
    UNITS.find((unit) => value >= unit.divisor) ?? { divisor: 1, suffix: "" };

  const compact = (value: number) => {
    const { divisor, suffix } = unitFor(value);
    const scaled = value / divisor;
    const text =
      Number.isInteger(scaled) || Math.abs(scaled) >= 100
        ? String(Math.round(scaled))
        : scaled.toFixed(1).replace(/\.0$/, "");

    return `${text}${suffix}`;
  };

  const formatValue = (value: number) =>
    props.format ? props.format(value) : compact(value);

  const formatShare = (share: number) => {
    if (share > 0 && share < 0.005) return "<1%";
    return `${Math.round(share * 100)}%`;
  };

  const swatchOf = (index: number, color?: string) => {
    if (color) return { swatchStyle: { backgroundColor: color } };
    return { swatchClass: PALETTE[index % PALETTE.length]!.swatch };
  };

  const paintOf = (index: number): Paint => {
    const color = props.data[index]?.color;
    if (color) return { fill: color };
    return { className: PALETTE[index % PALETTE.length]!.fill };
  };

  const total = computed(() =>
    props.data.reduce((sum, entry) => sum + Math.max(0, entry.value), 0),
  );

  const slices = computed<Slice[]>(() => {
    let end = 0;

    return props.data.map((entry, index) => {
      const value = Math.max(0, entry.value);
      const share = total.value ? value / total.value : 0;
      end += share;

      return {
        index,
        label: entry.label,
        value,
        share,
        end,
        shareLabel: formatShare(share),
        ...swatchOf(index, entry.color),
      };
    });
  });

  const visibleSlices = computed(() =>
    slices.value.filter((slice) => slice.share > 0),
  );

  const sliceAtTurn = (turn: number) =>
    visibleSlices.value.find((slice) => turn < slice.end) ??
    visibleSlices.value[visibleSlices.value.length - 1];

  const resolution = computed(() =>
    Math.max(MIN_RESOLUTION, Math.floor(props.resolution)),
  );

  const thickness = computed(() =>
    clamp(
      Math.round(props.thickness),
      1,
      Math.floor(resolution.value * MAX_THICKNESS_RATIO),
    ),
  );

  const outerRadius = computed(() => resolution.value / 2);
  const innerRadius = computed(() => outerRadius.value - thickness.value);

  const turnOf = (dx: number, dy: number) =>
    (Math.atan2(dx, -dy) / (2 * Math.PI) + 1) % 1;

  const ring = computed(() => {
    const list: RingCell[] = [];

    for (let band = 0; band < thickness.value; band++) {
      const radius = outerRadius.value - 0.5 - band;
      const count = Math.floor(2 * Math.PI * radius);

      for (let step = 0; step < count; step++) {
        list.push({
          key: `${band}-${step}`,
          seed: list.length + 1,
          turn: (step + 0.5) / count,
          radius,
        });
      }
    }

    return list;
  });

  const pitch = computed(() => size.value / resolution.value);
  const cellSize = computed(() => Math.max(1, pitch.value - GAP));

  const cellTransform = ({ turn, radius }: RingCell) => {
    const angle = turn * 2 * Math.PI;
    const x = size.value / 2 + Math.sin(angle) * radius * pitch.value;
    const y = size.value / 2 - Math.cos(angle) * radius * pitch.value;

    return `translate(${x} ${y}) rotate(${turn * 360})`;
  };

  const ready = computed(() => size.value > 0);

  const holeSize = computed(() => 2 * innerRadius.value * pitch.value);

  const showCenter = computed(() => holeSize.value >= CENTER_MIN_SIZE);

  const centerFontSize = computed(() =>
    clamp(
      Math.round(holeSize.value * CENTER_FONT_RATIO),
      CENTER_FONT_MIN,
      CENTER_FONT_MAX,
    ),
  );

  const activeIndex = computed(() => {
    if (!props.interactive) return null;

    const index = hoveredSlice.value ?? focusedSlice.value;
    return index !== null && slices.value[index]?.share ? index : null;
  });

  const activeSlice = computed(() =>
    activeIndex.value === null ? null : slices.value[activeIndex.value]!,
  );

  const isDimmed = (index: number | null) =>
    activeIndex.value !== null && index !== activeIndex.value;

  const cellTransition = computed(() =>
    props.animate ? `${FADE_TRANSITION}, ${POP_TRANSITION}` : "none",
  );

  const cellStyle = (cell: Cell) => {
    const scale = !cell.filled
      ? HIDDEN_SCALE
      : isDimmed(cell.slice)
        ? DIMMED_SCALE
        : 1;

    return {
      opacity: cell.filled ? 1 : 0,
      transform: `scale(${scale})`,
      transition: cellTransition.value,
    };
  };

  const centerCaption = computed(() => activeSlice.value?.label ?? props.total);

  const centerValue = computed(() =>
    formatValue(activeSlice.value?.value ?? total.value),
  );

  const announcement = computed(() => {
    const slice = activeSlice.value;
    if (focusedSlice.value === null || !slice) return "";

    return `${slice.label}: ${formatValue(slice.value)}, ${slice.shareLabel}`;
  });

  const ariaLabel = computed(() => {
    if (!visibleSlices.value.length) return "Pie chart, no data";

    const parts = visibleSlices.value.map(
      (slice) =>
        `${slice.label} ${formatValue(slice.value)} (${slice.shareLabel})`,
    );

    return `Pie chart: ${parts.join(", ")}`;
  });

  const sliceAt = (clientX: number, clientY: number) => {
    const rect = ringRef.value!.getBoundingClientRect();
    const dx = clientX - rect.left - size.value / 2;
    const dy = clientY - rect.top - size.value / 2;
    const distance = Math.hypot(dx, dy) / pitch.value;

    const inside =
      distance >= innerRadius.value - HIT_TOLERANCE &&
      distance <= outerRadius.value + HIT_TOLERANCE;

    if (!inside) return null;
    return sliceAtTurn(turnOf(dx, dy))?.index ?? null;
  };

  const stepSlice = (key: string, from: number | null) => {
    const indexes = visibleSlices.value.map((slice) => slice.index);
    const position = from === null ? -1 : indexes.indexOf(from);
    const last = indexes.length - 1;

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        return indexes[position >= last ? 0 : position + 1];
      case "ArrowLeft":
      case "ArrowUp":
        return indexes[position <= 0 ? last : position - 1];
      case "Home":
        return indexes[0];
      case "End":
        return indexes[last];
      default:
        return undefined;
    }
  };

  const clearHover = () => {
    hoveredSlice.value = null;
  };

  const handlePointerMove = (event: PointerEvent) => {
    hoveredSlice.value = sliceAt(event.clientX, event.clientY);
  };

  const handlePointerDown = (event: PointerEvent) => {
    focusedSlice.value = null;
    handlePointerMove(event);
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "touch") clearHover();
  };

  const handleLegendEnter = (index: number) => {
    focusedSlice.value = null;
    hoveredSlice.value = index;
  };

  const handleOutsidePointerDown = (event: PointerEvent) => {
    if (!rootRef.value?.contains(event.target as Node)) clearHover();
  };

  const handleFocus = (event: FocusEvent) => {
    if (!(event.target as HTMLElement).matches(":focus-visible")) return;
    focusedSlice.value ??= visibleSlices.value[0]?.index ?? null;
  };

  const handleBlur = () => {
    focusedSlice.value = null;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      clearHover();
      focusedSlice.value = null;
      return;
    }

    if (!visibleSlices.value.length) return;

    const target = stepSlice(event.key, activeIndex.value);
    if (target === undefined) return;

    event.preventDefault();
    clearHover();
    focusedSlice.value = target;
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
    const shape = `${resolution.value}/${thickness.value}`;
    if (shape === cellsShape) return;
    cellsShape = shape;

    cells.value = ring.value.map((cell) => ({
      ...cell,
      slice: null,
      filled: false,
      className: PALETTE[0]!.fill,
    }));
  };

  const syncCells = () => {
    flushBatches();
    ensureCells();

    if (!ready.value) return;

    cells.value.forEach((cell) => {
      const slice = total.value ? sliceAtTurn(cell.turn) : undefined;
      const index = slice?.index ?? null;
      const filled = index !== null;
      const { fill, className } = index !== null ? paintOf(index) : cell;

      const unchanged =
        filled === cell.filled &&
        index === cell.slice &&
        fill === cell.fill &&
        className === cell.className;

      if (unchanged) return;

      const apply = () =>
        Object.assign(cell, { filled, slice: index, fill, className });

      const delay = props.animate
        ? Math.round(noise(cell.seed) * DISSOLVE_DURATION * 1000)
        : 0;

      if (delay > 0) schedule(delay, apply);
      else apply();
    });
  };

  watch([slices, ring, () => props.animate, ready], syncCells, {
    immediate: true,
    flush: "post",
  });

  let observer: ResizeObserver | null = null;

  const measure = () => {
    if (!ringRef.value) return;
    size.value = ringRef.value.getBoundingClientRect().width;
  };

  onMounted(() => {
    observer = new ResizeObserver(measure);
    if (ringRef.value) observer.observe(ringRef.value);

    document.addEventListener("pointerdown", handleOutsidePointerDown);
  });

  onUnmounted(() => {
    observer?.disconnect();
    document.removeEventListener("pointerdown", handleOutsidePointerDown);
    cancelBatches();
  });
</script>
