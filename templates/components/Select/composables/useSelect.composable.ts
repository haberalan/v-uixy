import { onWatcherCleanup, watch } from "vue";
import type { UixySelectOptionType } from "../Select.types";

export const useSelect = <T>(
  options: UixySelectOptionType[],
  disabled: boolean,
  onChange: (e: string) => void
) => {
  const open = ref(false);
  const search = ref("");
  const refOptions = ref<HTMLDivElement>();

  const filteredOptions = computed(() =>
    options.filter((option) =>
      option.label.toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const handleOpen = (e?: MouseEvent) => {
    if (disabled || (e && "badge" in (e?.target as HTMLDivElement).dataset))
      return;

    open.value = !open.value;
  };

  const handleKeydownSelect = (e: KeyboardEvent) => {
    const key = e.key;

    if (key === "Tab") return;

    if (key === "ArrowDown" || key === "Enter" || key === " ") {
      e.preventDefault();
      open.value = !open.value;
    }
  };

  const handleKeydownOption = (
    e: KeyboardEvent,
    option: UixySelectOptionType
  ) => {
    const key = e.key;

    if ((key === "Enter" || key === " ") && !option.disabled) {
      e.preventDefault();
      return onChange(option.label);
    }

    if (key !== "ArrowDown" && key !== "ArrowUp") return;

    const container = refOptions.value;

    if (!container) return;

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[select-dropdown] input, [select-dropdown] li"
      )
    ).filter(
      (el) =>
        el.tabIndex >= 0 &&
        el.getAttribute("aria-disabled") !== "true" &&
        !el.hasAttribute("disabled")
    );

    if (!focusables.length) return;

    const currentEl = (e.currentTarget as HTMLElement) || null;
    let index = currentEl ? focusables.indexOf(currentEl) : -1;

    e.preventDefault();

    const val = key === "ArrowDown" ? 1 : -1;

    index = (index + val + focusables.length) % focusables.length;

    const nextEl = focusables[index];
    nextEl?.focus();
  };

  const handleClickSelectedOption = (item: string) => {
    onChange(item);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (refOptions.value && !refOptions.value.contains(e.target as Node))
      open.value = false;
  };

  watch(
    () => open.value,
    (_, prevVal) => {
      if (prevVal) return;

      requestAnimationFrame(() => {
        window.addEventListener("click", handleClickOutside);
      });

      onWatcherCleanup(() => {
        window.removeEventListener("click", handleClickOutside);
      });
    }
  );

  onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
  });

  return {
    open,
    search,
    refOptions,
    filteredOptions,
    handleOpen,
    handleKeydownSelect,
    handleKeydownOption,
    handleClickSelectedOption,
  };
};
