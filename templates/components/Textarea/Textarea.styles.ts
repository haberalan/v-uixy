import styles from "~/utils/styles";

export const textareaStyles = styles(
  "peer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 px-3 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 outline-offset-1 outline-gray-300 scrollbar",
  {
    status: {
      default:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600",
      error:
        "bg-white dark:bg-gray-1000 border-error-700 dark:border-error-900 text-error-600 dark:text-error-500",
      disabled:
        "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-700 resize-none",
      valid:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600",
    },
    noResize: {
      true: "resize-none",
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
      disabled: "text-gray-500 dark:text-gray-700",
      valid: "",
    },
  }
);

export const helperStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs",
  {
    status: {
      default: "text-gray-600",
      error: "text-error-600",
      disabled: "text-gray-400 dark:text-gray-800",
      valid: "text-gray-600",
    },
    align: {
      left: "text-left",
      right: "text-right",
      center: "text-center",
    },
  }
);
