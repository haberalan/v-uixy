import {
  onWatcherCleanup,
  watch,
  computed,
  ref,
  onUnmounted,
  type Ref,
} from "vue";
import type { UixySelectOptionType, UixySelectProps } from "../Select.types";

const normalizeForSearch = (str: string): string =>
  str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const getValue = (option: UixySelectOptionType): string =>
  option.value ?? option.label;

const collectLeafValues = (option: UixySelectOptionType): string[] => {
  if (!option.children || option.children.length === 0)
    return [getValue(option)];
  return option.children.flatMap(collectLeafValues);
};

const findInTree = (
  options: UixySelectOptionType[],
  value: string,
): UixySelectOptionType | null => {
  for (const opt of options) {
    if (getValue(opt) === value) return opt;
    if (opt.children?.length) {
      const found = findInTree(opt.children, value);
      if (found) return found;
    }
  }
  return null;
};

export const useSelect = <T extends string | string[]>(
  props: UixySelectProps,
  model: Ref<T>,
  emit: (event: "change", v: string) => void,
  dropdownRef?: Ref<HTMLElement | undefined>,
) => {
  const open = ref(false);
  const search = ref("");
  const refOptions = ref<HTMLDivElement>();
  const lastScrollAt = ref(0);
  const expandedItems = ref<string[]>([]);

  const filterTreeOptions = (
    items: UixySelectOptionType[],
    searchTerm: string,
  ): UixySelectOptionType[] => {
    if (!searchTerm) return items;
    const normSearch = normalizeForSearch(searchTerm);
    const filterNode = (
      node: UixySelectOptionType,
    ): UixySelectOptionType | null => {
      const matches = normalizeForSearch(node.label).includes(normSearch);
      let filteredChildren: UixySelectOptionType[] = [];
      if (node.children?.length) {
        filteredChildren = node.children
          .map(filterNode)
          .filter((n): n is UixySelectOptionType => n !== null);
      }
      if (matches || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return items
      .map(filterNode)
      .filter((n): n is UixySelectOptionType => n !== null);
  };

  const filteredOptions = computed(() => {
    const list = props.options ?? [];
    if (props.tree) return filterTreeOptions(list, search.value);
    return list.filter((option) =>
      normalizeForSearch(option.label).includes(
        normalizeForSearch(search.value),
      ),
    );
  });

  const collectParentsWithMatchingDescendants = (
    items: UixySelectOptionType[],
    searchTerm: string,
  ): string[] => {
    if (!searchTerm) return [];
    const lowerSearch = searchTerm.toLowerCase();
    const parentsToExpand: string[] = [];
    const checkNode = (node: UixySelectOptionType): boolean => {
      const nodeMatches = node.label.toLowerCase().includes(lowerSearch);
      let hasMatchingDescendant = false;
      if (node.children?.length) {
        for (const child of node.children) {
          if (checkNode(child)) hasMatchingDescendant = true;
        }
      }
      if (hasMatchingDescendant) parentsToExpand.push(getValue(node));
      return nodeMatches || hasMatchingDescendant;
    };
    for (const item of items) checkNode(item);
    return parentsToExpand;
  };

  const effectiveExpandedItems = computed(() => {
    if (!search.value) return expandedItems.value;
    const autoExpanded = collectParentsWithMatchingDescendants(
      props.options,
      search.value,
    );
    return Array.from(new Set([...expandedItems.value, ...autoExpanded]));
  });

  const toggleExpand = (value: string) => {
    const idx = expandedItems.value.indexOf(value);
    if (idx >= 0) expandedItems.value.splice(idx, 1);
    else expandedItems.value.push(value);
  };

  const isSelected = (option: UixySelectOptionType): boolean => {
    const v = getValue(option);
    if (props.tree && props.multiple && option.children?.length) {
      const leaves = collectLeafValues(option);
      const arr = (model.value as string[]) ?? [];
      return leaves.length > 0 && leaves.every((l) => arr.includes(l));
    }
    return Array.isArray(model.value)
      ? (model.value as string[]).includes(v)
      : (model.value as string) === v;
  };

  const isPartiallySelected = (option: UixySelectOptionType): boolean => {
    if (!props.tree || !props.multiple || !option.children?.length)
      return false;
    const leaves = collectLeafValues(option);
    const arr = (model.value as string[]) ?? [];
    const selected = leaves.filter((l) => arr.includes(l)).length;
    return selected > 0 && selected < leaves.length;
  };

  const setMultiValues = (next: string[]) => {
    (model.value as string[]) = next;
  };

  const toggleMultiValue = (v: string) => {
    const prev = Array.isArray(model.value) ? (model.value as string[]) : [];
    if (prev.includes(v)) {
      setMultiValues(prev.filter((item) => item !== v));
      return;
    }
    if (props.max && prev.length >= props.max) {
      setMultiValues([...prev.slice(1), v]);
      return;
    }
    setMultiValues([...prev, v]);
  };

  const cascadeMultiTree = (option: UixySelectOptionType) => {
    const leaves = collectLeafValues(option);
    const prev = Array.isArray(model.value) ? (model.value as string[]) : [];
    const allSelected = leaves.every((l) => prev.includes(l));
    if (allSelected) {
      setMultiValues(prev.filter((v) => !leaves.includes(v)));
      return;
    }
    const merged = Array.from(new Set([...prev, ...leaves]));
    if (props.max && merged.length > props.max) {
      setMultiValues(merged.slice(merged.length - props.max));
      return;
    }
    setMultiValues(merged);
  };

  const applyChange = (v: string) => {
    if (!props.multiple) {
      (model.value as string) = v;
      return;
    }
    if (props.tree) {
      const node = findInTree(props.options, v);
      if (node?.children?.length) {
        cascadeMultiTree(node);
        return;
      }
    }
    toggleMultiValue(v);
  };

  const handleClick = (value: string) => {
    applyChange(value);
    emit("change", value);
    if (props.clearSearchOnSelect) search.value = "";
    if (!props.multiple) open.value = false;
  };

  const handleClickSelectedOption = (item: string) => {
    applyChange(item);
    emit("change", item);
  };

  const handleDeselect = () => {
    (model.value as string) = "";
  };

  const getLabel = (value: string): string => {
    if (!value) return "";
    return findInTree(props.options, value)?.label ?? value;
  };

  const customAddVisible = computed(() => {
    if (!props.allowCustom || !search.value) return false;
    const lowerSearch = search.value.toLowerCase();
    return !filteredOptions.value.some(
      (opt) => opt.label.toLowerCase() === lowerSearch,
    );
  });

  const handleCustomAdd = () => {
    handleClick(search.value);
  };

  const handleOpen = (e?: MouseEvent) => {
    if (
      props.disabled ||
      (e && "badge" in (e?.target as HTMLDivElement).dataset)
    )
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
    option: UixySelectOptionType,
  ) => {
    const key = e.key;
    if ((key === "Enter" || key === " ") && !option.disabled) {
      e.preventDefault();
      return handleClick(getValue(option));
    }
    if (key !== "ArrowDown" && key !== "ArrowUp") return;
    const container = dropdownRef?.value ?? refOptions.value;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(
        "[select-dropdown] input, [select-dropdown] li",
      ),
    ).filter(
      (el) =>
        el.tabIndex >= 0 &&
        el.getAttribute("aria-disabled") !== "true" &&
        !el.hasAttribute("disabled"),
    );
    if (!focusables.length) return;
    const currentEl = (e.currentTarget as HTMLElement) || null;
    let index = currentEl ? focusables.indexOf(currentEl) : -1;
    e.preventDefault();
    const val = key === "ArrowDown" ? 1 : -1;
    index = (index + val + focusables.length) % focusables.length;
    focusables[index]?.focus();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (Date.now() - lastScrollAt.value < 250) return;
    const target = e.target as Node;
    if (refOptions.value?.contains(target)) return;
    if (dropdownRef?.value?.contains(target)) return;
    const el = target as HTMLElement;
    if (el.closest?.("[select-dropdown]")) return;
    open.value = false;
  };

  const markScroll = () => {
    lastScrollAt.value = Date.now();
  };

  watch(
    () => open.value,
    (isOpen, prevVal) => {
      if (!isOpen) {
        expandedItems.value = [];
      }
      if (prevVal) return;
      requestAnimationFrame(() => {
        window.addEventListener("click", handleClickOutside);
        window.addEventListener("scroll", markScroll, true);
        window.addEventListener("wheel", markScroll, { passive: true });
        window.addEventListener("touchmove", markScroll, { passive: true });
      });
      onWatcherCleanup(() => {
        window.removeEventListener("click", handleClickOutside);
        window.removeEventListener("scroll", markScroll, true);
        window.removeEventListener("wheel", markScroll as any);
        window.removeEventListener("touchmove", markScroll as any);
      });
    },
  );

  onUnmounted(() => {
    window.removeEventListener("click", handleClickOutside);
    window.removeEventListener("scroll", markScroll, true);
    window.removeEventListener("wheel", markScroll as any);
    window.removeEventListener("touchmove", markScroll as any);
  });

  return {
    open,
    search,
    refOptions,
    filteredOptions,
    expandedItems,
    effectiveExpandedItems,
    customAddVisible,
    isSelected,
    isPartiallySelected,
    getLabel,
    toggleExpand,
    handleOpen,
    handleKeydownSelect,
    handleKeydownOption,
    handleClickSelectedOption,
    handleClick,
    handleDeselect,
    handleCustomAdd,
  };
};
