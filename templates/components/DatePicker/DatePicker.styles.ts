import styles from "~/utils/styles";

export const triggerStyles = styles(
  "relative flex w-full items-center gap-2 cursor-pointer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 outline-offset-1 outline-gray-300 dark:outline-gray-800 select-none",
  {
    status: {
      default:
        "bg-white dark:bg-gray-1000 hover:border-gray-400 dark:hover:border-gray-700",
      error:
        "bg-white dark:bg-gray-1000 border-error-700 dark:border-error-900 text-error-600 dark:text-error-500",
      disabled:
        "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-700 pointer-events-none cursor-not-allowed",
    },
    open: {
      true: "border-gray-500 dark:border-gray-600",
      false: "",
    },
    size: {
      sm: "pl-2.5 pr-2.5 py-1.5 text-xs min-h-[32px]",
      md: "pl-3 pr-3 py-2 text-sm min-h-[38px]",
      xl: "pl-3.5 pr-3.5 py-2.5 text-base min-h-[42px]",
    },
  },
);

export const triggerValueStyles = styles("flex-1 truncate text-left", {
  placeholder: {
    true: "text-gray-500 dark:text-gray-700",
    false: "text-gray-900 dark:text-gray-100",
  },
  disabled: {
    true: "text-gray-400 dark:text-gray-700",
    false: "",
  },
});

export const triggerIconStyles = styles(
  "shrink-0 text-gray-400 dark:text-gray-600",
  {
    disabled: {
      true: "dark:text-gray-700",
      false: "",
    },
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      xl: "h-5 w-5",
    },
  },
);

export const closeIconStyles = styles(
  "shrink-0 cursor-pointer text-gray-400 hover:text-black dark:text-gray-600 dark:hover:text-white",
  {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      xl: "h-5 w-5",
    },
  },
);

export const labelStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs font-500",
  {
    status: {
      default: "",
      error: "text-error-600",
      disabled: "text-gray-500 dark:text-gray-700",
    },
  },
);

export const helperStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs",
  {
    status: {
      default: "text-gray-600",
      error: "text-error-600",
      disabled: "text-gray-400 dark:text-gray-800",
    },
  },
);

export const panelStyles = styles(
  "flex flex-col gap-3 rounded-2 border border-gray-300 bg-gray-100 p-3 shadow-lg dark:border-gray-900 dark:bg-black",
);

export const sectionLabelStyles = styles(
  "text-xs font-500 text-gray-500 dark:text-gray-600",
);

export const footerStyles = styles("flex items-center justify-between gap-2");
