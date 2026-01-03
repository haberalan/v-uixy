<template>
  <uixy-card class="p-2 flex flex-col gap-4">
    <div
      ref="svRef"
      class="relative cursor-crosshair overflow-hidden rounded-1 w-64 h-48"
      :style="svBackgroundStyle"
      @mousedown="onSvMouseDown"
      @touchstart.prevent="onSvTouchStart"
    >
      <div
        class="pointer-events-none absolute -mt-2 -ml-2 size-4 rounded-full border-2 shadow-sm transition-colors border-white"
        :style="svHandleStyle"
      />
    </div>
    <div class="flex flex-col gap-4">
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        v-model.number="hue"
        :disabled="props.disabled"
        class="h-2.5 w-full appearance-none rounded-full outline-none slider-color-picker border border-gray-300 dark:border-gray-900"
        :style="hueSliderStyle"
      />
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        v-model.number="alpha"
        :disabled="props.disabled"
        class="h-2.5 w-full appearance-none rounded-full outline-none slider-color-picker border border-gray-300 dark:border-gray-900"
        :style="alphaSliderStyle"
      />
    </div>
    <div class="flex gap-2 items-center mt-2 justify-between">
      <uixy-card class="p-1">
        <div
          class="w-12 h-4 rounded-1 shadow-sm"
          :style="{ backgroundColor: model }"
        ></div>
      </uixy-card>
      <p class="text-xs font-500">{{ model }}</p>
    </div>
  </uixy-card>
</template>

<script setup lang="ts">
  import type { UixyColorPickerProps } from "./ColorPicker.types";
  import { UixyCard } from "../Card";

  const props = defineProps<UixyColorPickerProps>();

  const model = defineModel<string>({ default: "#ff0000" });

  const hue = ref(0);
  const sat = ref(100);
  const val = ref(100);
  const alpha = ref(100);

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

  const componentToHex = (c: number) => c.toString(16).padStart(2, "0");

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

  const rgbToHex8 = (r: number, g: number, b: number, a: number) =>
    `#${componentToHex(r)}${componentToHex(g)}${componentToHex(
      b
    )}${componentToHex(clamp(a, 0, 255))}`;

  const hexToRgbA = (
    hex?: string
  ): {
    r: number;
    g: number;
    b: number;
    a: number;
    hasAlpha: boolean;
  } | null => {
    if (!hex) return null;
    const cleaned = hex.trim().replace(/^#/, "");
    if (cleaned.length === 6) {
      const r = parseInt(cleaned.slice(0, 2), 16);
      const g = parseInt(cleaned.slice(2, 4), 16);
      const b = parseInt(cleaned.slice(4, 6), 16);
      return { r, g, b, a: 255, hasAlpha: false } as const;
    }
    if (cleaned.length === 8) {
      const r = parseInt(cleaned.slice(0, 2), 16);
      const g = parseInt(cleaned.slice(2, 4), 16);
      const b = parseInt(cleaned.slice(4, 6), 16);
      const a = parseInt(cleaned.slice(6, 8), 16);
      return { r, g, b, a, hasAlpha: true } as const;
    }
    return null;
  };

  const hsvToRgb = (h: number, s: number, v: number) => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r1 = 0,
      g1 = 0,
      b1 = 0;

    if (h >= 0 && h < 60) {
      r1 = c;
      g1 = x;
      b1 = 0;
    } else if (h < 120) {
      r1 = x;
      g1 = c;
      b1 = 0;
    } else if (h < 180) {
      r1 = 0;
      g1 = c;
      b1 = x;
    } else if (h < 240) {
      r1 = 0;
      g1 = x;
      b1 = c;
    } else if (h < 300) {
      r1 = x;
      g1 = 0;
      b1 = c;
    } else {
      r1 = c;
      g1 = 0;
      b1 = x;
    }
    return {
      r: Math.round((r1 + m) * 255),
      g: Math.round((g1 + m) * 255),
      b: Math.round((b1 + m) * 255),
    };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  };

  const svRef = ref<HTMLElement | null>(null);

  const rgb = computed(() =>
    hsvToRgb(hue.value, sat.value / 100, val.value / 100)
  );

  const updatingFromModel = ref(false);

  watch([hue, sat, val, alpha], () => {
    if (updatingFromModel.value) return;
    const a = Math.round((alpha.value / 100) * 255);
    if (a === 255) {
      model.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b);
    } else {
      model.value = rgbToHex8(rgb.value.r, rgb.value.g, rgb.value.b, a);
    }
  });

  const applyModel = (value?: string) => {
    const parsed = hexToRgbA(value ?? model.value ?? "#ff0000");
    if (!parsed) return;
    const hsv = rgbToHsv(parsed.r, parsed.g, parsed.b);
    updatingFromModel.value = true;
    hue.value = hsv.h;
    sat.value = Math.round(hsv.s * 100);
    val.value = Math.round(hsv.v * 100);
    alpha.value = clamp(Math.round((parsed.a / 255) * 100), 0, 100);

    let normalized: string;
    if (!parsed.hasAlpha || parsed.a === 255) {
      normalized = rgbToHex(parsed.r, parsed.g, parsed.b);
    } else {
      normalized = rgbToHex8(parsed.r, parsed.g, parsed.b, parsed.a);
    }
    if (model.value !== normalized) model.value = normalized;
    updatingFromModel.value = false;
  };

  onMounted(() => applyModel());
  watch(model, (v) => applyModel(v));

  const svBackgroundStyle = computed(() => ({
    background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hue.value}, 100%, 50%))`,
  }));

  const svHandleStyle = computed(() => ({
    left: `${sat.value}%`,
    top: `${100 - val.value}%`,
  }));

  const hueSliderStyle = computed(() => ({
    background:
      "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
  }));

  const alphaSliderStyle = computed(() => {
    const { r, g, b } = rgb.value;
    return {
      background: `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0), rgba(${r}, ${g}, ${b}, 1))`,
    } as Record<string, string>;
  });

  const updateSvFromEvent = (e: MouseEvent) => {
    if (!svRef.value) return;
    const rect = svRef.value.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100);
    sat.value = Math.round(x);
    val.value = Math.round(100 - y);
  };

  const updateSvFromTouch = (e: TouchEvent) => {
    if (!svRef.value) return;
    const t = e.touches?.[0] ?? e.changedTouches?.[0];
    if (!t) return;
    const rect = svRef.value.getBoundingClientRect();
    const x = clamp(((t.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((t.clientY - rect.top) / rect.height) * 100, 0, 100);
    sat.value = Math.round(x);
    val.value = Math.round(100 - y);
  };

  let dragging = false;

  const onSvMouseDown = (e: MouseEvent) => {
    if (props.disabled) return;

    dragging = true;

    updateSvFromEvent(e);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;

    updateSvFromEvent(e);
  };

  const onMouseUp = () => {
    dragging = false;

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  const onSvTouchStart = (e: TouchEvent) => {
    if (props.disabled) return;

    updateSvFromTouch(e);

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
  };

  const onTouchMove = (e: TouchEvent) => {
    updateSvFromTouch(e);
  };

  const onTouchEnd = () => {
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
  };
</script>
