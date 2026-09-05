import { ref, computed, watch, onBeforeUnmount, nextTick, type Ref } from "vue";

type Direction = "top" | "bottom";
type Align = "center" | "start";

interface UsePositionOptions {
  direction?: Direction;
  align?: Align;
}

const GAP = 6;

function hasFixedParent(el: HTMLElement | null): boolean {
  while (el) {
    const style = window.getComputedStyle(el);
    if (style.position === "fixed" || style.position === "sticky") return true;
    el = el.parentElement;
  }
  return false;
}

export function usePosition({
  direction = "bottom",
  align = "center",
}: UsePositionOptions) {
  const refElement = ref<HTMLElement>();

  const active = ref(false);
  const target = ref<HTMLElement | null>(null);

  const baseStyles = computed(() => ({
    position: hasFixedParent(target.value) ? "fixed" : "absolute",
    width: "max-content",
    zIndex: 70,
  }));

  const styles = ref<Record<string, string | number>>({
    ...baseStyles.value,
  });

  const updatePosition = async () => {
    if (!active.value || !target.value || !refElement.value) return;

    await nextTick();

    const tooltipRect = refElement.value.getBoundingClientRect();
    const targetRect = target.value.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let top: number;
    const scrollY = hasFixedParent(target.value) ? 0 : window.scrollY;

    const spaceBelow = winH - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const fitsBelow = spaceBelow >= tooltipRect.height + GAP;
    const fitsAbove = spaceAbove >= tooltipRect.height + GAP;

    const effectiveDirection =
      direction === "top"
        ? fitsAbove || !fitsBelow
          ? "top"
          : "bottom"
        : fitsBelow || !fitsAbove
          ? "bottom"
          : "top";

    top =
      effectiveDirection === "top"
        ? targetRect.top - tooltipRect.height - GAP + scrollY
        : targetRect.bottom + GAP + scrollY;

    let left =
      align === "start"
        ? targetRect.left
        : targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
    const newStyles: Record<string, string | number> = {
      ...baseStyles.value,
      top,
    };

    if (left < 0) {
      newStyles.left = 0;
    } else if (left + tooltipRect.width > winW) {
      newStyles.right = 0;
    } else {
      newStyles.left = left;
    }

    styles.value = {
      ...newStyles,
      left: newStyles.left + "px",
      right: newStyles.right + "px",
      top: newStyles.top + "px",
    };
  };

  let resizeObserver: ResizeObserver | null = null;

  const observeResize = () => {
    if (typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver(() => {
      void updatePosition();
    });
    if (target.value) resizeObserver.observe(target.value);
    if (refElement.value) resizeObserver.observe(refElement.value);
  };

  const unobserveResize = () => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  };

  watch(
    [active, () => direction, () => align],
    ([isActive]) => {
      if (isActive) {
        updatePosition();
        observeResize();
        window.addEventListener("resize", updatePosition);
      } else {
        unobserveResize();
        window.removeEventListener("resize", updatePosition);
      }
    },
    { flush: "post" },
  );

  onBeforeUnmount(() => {
    unobserveResize();
    window.removeEventListener("resize", updatePosition);
  });

  function handleOpen(e: MouseEvent) {
    target.value = e.currentTarget as HTMLElement;
    active.value = !active.value;
  }

  function handleLeave() {
    active.value = false;
  }

  return {
    active,
    styles,
    refElement,
    handleOpen,
    handleLeave,
  };
}
