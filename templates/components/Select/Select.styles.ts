import styles from "~/utils/styles";

export const selectStyles = styles(
  "relative select-none peer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 pl-3 pr-6 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 min-h-[38px] outline-offset-1 outline-gray-300",
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
  }
);

export const iconStyles = styles(
  "pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 select-none transition-transform duration-200 ease-in-out",
  {
    open: {
      true: "rotate-180",
      false: "",
    },
  }
);

export const labelStyles = styles(
  "transition-colors ease-in-out duration-150 text-sm font-500",
  {
    status: {
      default: "",
      error: "text-error-600",
      disabled:
        "text-gray-500 dark:text-gray-700 pointer-events-none select-none",
      valid: "",
    },
  }
);

export const itemStyles = styles(
  "relative py-2 px-3 rounded-1 cursor-pointer focus-visible:bg-gray-200 focus-visible:border-gray-100 hover:bg-gray-200 dark:focus-visible:bg-gray-900 dark:hover:bg-gray-900 dark:focus-visible:border-gray-600",
  {
    selected: {
      true: "bg-gray-200 dark:bg-gray-900",
      false: "",
    },
    disabled: {
      true: "pointer-events-none text-gray-500 dark:text-gray-700",
      false: "",
    },
  }
);

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
  }
);

export const badgesWrapperStyles = styles("flex flex-wrap gap-1", {
  disabled: {
    true: "opacity-30 transition-all duration-150 ease-in-out",
    false: "",
  },
});
