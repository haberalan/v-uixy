import { computed, nextTick, onScopeDispose, ref, type ComputedRef } from "vue";

const BASE_Z = 60;
const STEP_Z = 10;

let seq = 0;

const layers = ref<number[]>([]);

export interface UseOverlayLayerReturn {
  id: number;
  zIndex: ComputedRef<number>;
  isTop: ComputedRef<boolean>;
  isActive: ComputedRef<boolean>;
  acquire: () => void;
  release: () => void;
}

export function useOverlayLayer(): UseOverlayLayerReturn {
  const id = ++seq;

  const index = computed(() => layers.value.indexOf(id));
  const isActive = computed(() => index.value !== -1);

  const zIndex = computed(() =>
    isActive.value ? BASE_Z + (index.value + 1) * STEP_Z : BASE_Z + STEP_Z,
  );

  const isTop = computed(
    () => isActive.value && index.value === layers.value.length - 1,
  );

  const acquire = () => {
    if (!layers.value.includes(id)) layers.value = [...layers.value, id];
  };

  const release = () => {
    if (layers.value.includes(id))
      layers.value = layers.value.filter((x) => x !== id);
  };

  onScopeDispose(release);

  return { id, zIndex, isTop, isActive, acquire, release };
}

const MANAGED_ATTR = "data-uixy-inert-managed";
const OVERLAY_ATTR = "data-uixy-overlay";
export const MODAL_ATTR = "data-uixy-modal";

const modalStack = ref<number[]>([]);

const zOf = (el: Element): number => {
  const raw = window.getComputedStyle(el).zIndex;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const getTopModalEl = (): HTMLElement | null => {
  if (typeof document === "undefined") return null;
  const els = Array.from(
    document.querySelectorAll<HTMLElement>(`[${MODAL_ATTR}]`),
  );
  if (els.length === 0) return null;
  return els.reduce((a, b) => (zOf(b) >= zOf(a) ? b : a));
};

function reconcileInert() {
  if (typeof document === "undefined") return;

  document.querySelectorAll(`[${MANAGED_ATTR}]`).forEach((el) => {
    el.removeAttribute("inert");
    el.removeAttribute("aria-hidden");
    el.removeAttribute(MANAGED_ATTR);
  });

  const topEl = getTopModalEl();
  if (!topEl) return;

  const topZ = zOf(topEl);

  Array.from(document.body.children).forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    if (el === topEl || el.contains(topEl)) return;

    if (el.hasAttribute(OVERLAY_ATTR) && zOf(el) > topZ) return;

    el.setAttribute("inert", "");
    el.setAttribute("aria-hidden", "true");
    el.setAttribute(MANAGED_ATTR, "");
  });
}

export interface UseModalLayerReturn {
  zIndex: ComputedRef<number>;
  isTopModal: ComputedRef<boolean>;
  open: () => void;
  close: () => void;
}

export function useModalLayer(): UseModalLayerReturn {
  const layer = useOverlayLayer();

  const isTopModal = computed(
    () => modalStack.value[modalStack.value.length - 1] === layer.id,
  );

  const open = () => {
    layer.acquire();
    if (!modalStack.value.includes(layer.id))
      modalStack.value = [...modalStack.value, layer.id];
    nextTick(reconcileInert);
  };

  const close = () => {
    layer.release();
    modalStack.value = modalStack.value.filter((x) => x !== layer.id);
    nextTick(reconcileInert);
  };

  onScopeDispose(close);

  return { zIndex: layer.zIndex, isTopModal, open, close };
}
