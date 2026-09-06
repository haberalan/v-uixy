import styles from "~/utils/styles";

export const selectStyles = styles(
  "relative select-none peer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 outline-offset-1 outline-gray-300",
  {
    status: {
      default:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600 cursor-pointer",
      error:
        "bg-white dark:bg-gray-1000 border-error-700 dark:border-error-900 text-error-600 dark:text-error-500 cursor-pointer",
      disabled:
        "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-700 pointer-events-none",
      valid:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600 cursor-pointer",
    },
    size: {
      sm: "pl-2.5 pr-5 py-1.5 text-xs min-h-[32px]",
      md: "pl-3 pr-6 py-2 text-sm min-h-[38px]",
      xl: "pl-3.5 pr-7 py-2.5 text-base min-h-[42px]",
    },
  },
);

export const iconStyles = styles(
  "pointer-events-none absolute top-1/2 -translate-y-1/2 select-none transition-transform duration-200 ease-in-out",
  {
    open: {
      true: "rotate-180",
      false: "",
    },
    size: {
      sm: "h-3.5 w-3.5 right-1.5",
      md: "h-4 w-4 right-2",
      xl: "h-4 w-4 right-2.5",
    },
  },
);

export const deselectIconStyles = styles(
  "absolute top-1/2 -translate-y-1/2 cursor-pointer z-10 text-gray-500 dark:text-gray-600 hover:text-black dark:hover:text-gray-400",
  {
    size: {
      sm: "h-3.5 w-3.5 right-6",
      md: "h-4 w-4 right-7",
      xl: "h-4 w-4 right-8",
    },
  },
);

export const labelStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs font-500",
  {
    status: {
      default: "",
      error: "text-error-600",
      disabled:
        "text-gray-500 dark:text-gray-700 pointer-events-none select-none",
      valid: "",
    },
  },
);

export const itemStyles = styles(
  "relative rounded-1 cursor-pointer focus-visible:bg-gray-200 focus-visible:border-gray-100 hover:bg-gray-200 dark:focus-visible:bg-gray-900 dark:hover:bg-gray-900 dark:focus-visible:border-gray-600",
  {
    selected: {
      true: "bg-gray-200 dark:bg-gray-900",
      false: "",
    },
    disabled: {
      true: "pointer-events-none text-gray-500 dark:text-gray-700",
      false: "",
    },
    size: {
      sm: "py-1.5 px-2.5",
      md: "py-2 px-3",
      xl: "py-2.5 px-3.5",
    },
  },
);

export const listItemPaddingStyles = styles("", {
  size: {
    sm: "py-1.5 px-2.5",
    md: "py-2 px-3",
    xl: "py-2.5 px-3.5",
  },
});

export const dropdownPanelStyles = styles(
  "scrollbar max-h-60 overflow-y-auto rounded-1 border border-gray-300 bg-white p-1 shadow-sm dark:border-gray-900 dark:bg-gray-1000",
  {
    size: {
      sm: "text-xs",
      md: "text-sm",
      xl: "text-base",
    },
  },
);

export const checkIconStyles = styles("absolute", {
  size: {
    sm: "size-3.5 top-1.5 right-1.5",
    md: "size-4 top-2 right-2",
    xl: "size-5 top-2.5 right-2.5",
  },
});

export const helperStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs",
  {
    status: {
      default: "text-gray-600",
      error: "text-error-600",
      disabled:
        "text-gray-400 dark:text-gray-800 pointer-events-none select-none",
      valid: "text-gray-600",
    },
  },
);

export const badgesWrapperStyles = styles("flex flex-wrap gap-1", {
  disabled: {
    true: "opacity-30 transition-all duration-150 ease-in-out",
    false: "",
  },
});
