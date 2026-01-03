import styles from "~/utils/styles";

export const badgeStyles = styles(
  "transition-all duration-200 ease-in-out flex items-center gap-1",
  {
    variant: {
      primary:
        "bg-gray-800 hover:bg-gray-700 border border-transparent dark:hover:bg-gray-200 dark:bg-gray-300 text-gray-100 dark:text-black dark:disabled:bg-gray-400 dark:disabled:text-gray-500 disabled:text-gray-600",
      secondary:
        "bg-gray-300 hover:bg-gray-200 border border-transparent dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100 text-black dark:disabled:bg-gray-600 dark:disabled:text-gray-700 disabled:text-gray-500",
      tertiary:
        "bg-transparent border border-solid border-gray-300 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 text-black dark:text-gray-100 dark:disabled:border-gray-900 dark:disabled:text-gray-500 dark:disabled:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400",
    },
    size: {
      xs: "px-2 text-xs",
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-1 text-sm",
      lg: "px-4 py-1 text-md",
    },
    shape: {
      rounded: "rounded-full",
      pill: "rounded-1",
    },
    clickable: {
      true: "cursor-pointer",
      false: "pointer-events-none",
    },
  }
);

export const iconStyles = styles("shrink-0", {
  size: {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-4 h-4",
  },
  position: {
    left: "",
    right: "order-1",
  },
});

export const linkStyles = styles("", {
  shape: {
    rounded: "rounded-full",
    pill: "rounded-1",
  },
  disabled: {
    true: "pointer-events-none",
    false: "",
  },
});
