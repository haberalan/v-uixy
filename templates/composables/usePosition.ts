import { ref, computed, watch, onBeforeUnmount, nextTick, type Ref } from "vue";

type Direction = "top" | "bottom";

interface UsePositionOptions {
  direction?: Direction;
}

function hasFixedParent(el: HTMLElement | null): boolean {
  while (el) {
    const style = window.getComputedStyle(el);
    if (style.position === "fixed" || style.position === "sticky") return true;
    el = el.parentElement;
  }
  return false;
}

export function usePosition({ direction = "bottom" }: UsePositionOptions) {
  const refElement = ref<HTMLElement>();

  const active = ref(false);
  const target = ref<HTMLElement | null>(null);

  const baseStyles = computed(() => ({
    position: hasFixedParent(target.value) ? "fixed" : "absolute",
    width: "max-content",
    zIndex: 20,
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

    let top: number;
    const scrollY = hasFixedParent(target.value) ? 0 : window.scrollY;

    top =
      direction === "top"
        ? targetRect.top - tooltipRect.height - 6 + scrollY
        : targetRect.bottom + 6 + scrollY;

    let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
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

  watch(
    [active, () => direction],
    ([isActive]) => {
      if (isActive) {
        updatePosition();
        window.addEventListener("resize", updatePosition);
      } else {
        window.removeEventListener("resize", updatePosition);
      }
    },
    { flush: "post" }
  );

  onBeforeUnmount(() => {
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
