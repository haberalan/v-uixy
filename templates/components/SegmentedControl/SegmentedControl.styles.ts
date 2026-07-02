import styles from "~/utils/styles";

export const segmentedTrackStyles = styles(
  "relative inline-flex items-center gap-1 rounded-1 bg-gray-200 p-0.5 dark:bg-gray-900",
  {
    fullWidth: {
      true: "flex w-full",
      false: "",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
      false: "",
    },
  },
);

export const segmentStyles = styles(
  "relative flex items-center justify-center rounded-1 font-500 cursor-pointer select-none transition-colors duration-150 ease-in-out outline-offset-2 outline-gray-300",
  {
    size: {
      sm: "px-2.5 py-1 text-xs",
      md: "px-3 py-1 text-sm",
      lg: "px-4 py-1.5 text-sm",
    },
    selected: {
      true: "text-black dark:text-white",
      false:
        "text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-gray-100",
    },
    disabled: {
      true: "cursor-not-allowed text-gray-400 hover:text-gray-400 dark:text-gray-700 dark:hover:text-gray-700",
      false: "",
    },
    fullWidth: {
      true: "flex-1",
      false: "",
    },
  },
);

export const segmentPillStyles = styles(
  "absolute inset-0 rounded-1 bg-white shadow-xs dark:bg-gray-700",
);

export const segmentContentStyles = styles(
  "relative z-10 flex items-center gap-1.5",
);

export const segmentIconStyles = styles("shrink-0", {
  size: {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-4 w-4",
  },
});
