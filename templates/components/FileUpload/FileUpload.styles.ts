import styles from "~/utils/styles";

export const dropzoneStyles = styles(
  "relative flex w-full flex-col items-center justify-center gap-2 rounded-2 border border-dashed px-6 py-8 text-center transition-colors duration-150 ease-in-out outline-offset-2 outline-gray-300",
  {
    state: {
      default:
        "cursor-pointer border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-1000 dark:hover:border-gray-700 dark:hover:bg-gray-900",
      dragging:
        "cursor-copy border-gray-500 bg-gray-100 dark:border-gray-500 dark:bg-gray-900",
      error:
        "cursor-pointer border-error-700 bg-white hover:bg-gray-100 dark:border-error-900 dark:bg-gray-1000 dark:hover:bg-gray-900",
      disabled:
        "pointer-events-none cursor-not-allowed border-gray-300 bg-gray-200 dark:border-gray-900 dark:bg-gray-900",
    },
  }
);

export const dropzoneIconStyles = styles(
  "h-6 w-6 transition-colors duration-150 ease-in-out",
  {
    state: {
      default: "text-gray-400 dark:text-gray-600",
      dragging: "text-gray-700 dark:text-gray-300",
      error: "text-error-600 dark:text-error-500",
      disabled: "text-gray-400 dark:text-gray-700",
    },
  }
);

export const dropzoneLabelStyles = styles(
  "text-sm font-500 text-gray-800 dark:text-gray-200",
  {
    state: {
      default: "",
      dragging: "",
      error: "",
      disabled: "text-gray-500 dark:text-gray-700",
    },
  }
);

export const dropzoneHintStyles = styles(
  "text-xs text-gray-500 dark:text-gray-600"
);

export const fileListStyles = styles("flex flex-col gap-2");

export const fileRowStyles = styles(
  "flex items-center gap-3 rounded-1 border border-gray-300 bg-white px-3 py-2 dark:border-gray-900 dark:bg-gray-1000"
);

export const fileIconStyles = styles(
  "h-5 w-5 shrink-0 text-gray-500 dark:text-gray-500"
);

export const fileNameStyles = styles(
  "flex-1 min-w-0 truncate text-sm text-gray-800 dark:text-gray-200"
);

export const fileSizeStyles = styles(
  "shrink-0 text-xs text-gray-500 dark:text-gray-600"
);

export const helperStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs",
  {
    status: {
      default: "text-gray-600",
      error: "text-error-600",
      disabled: "text-gray-400 dark:text-gray-800",
    },
  }
);
