import styles from "~/utils/styles";

export const iconButtonStyles = styles(
  "relative cursor-pointer font-500 aspect-square rounded-1 transition-all duration-200 ease-in-out hover:shadow-xs flex items-center justify-center disabled:pointer-events-none",
  {
    variant: {
      primary:
        "bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-200 dark:bg-gray-300 text-gray-100 dark:text-black dark:disabled:bg-gray-400 dark:disabled:text-gray-500 disabled:text-gray-600",
      secondary:
        "bg-gray-300 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-100 text-black dark:disabled:bg-gray-600 dark:disabled:text-gray-700 disabled:text-gray-500",
      tertiary:
        "bg-transparent border border-solid border-gray-300 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 text-black dark:text-gray-100 dark:disabled:border-gray-900 dark:disabled:text-gray-500 dark:disabled:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400",
      quaternary:
        "dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:text-gray-700",
    },
    size: {
      sm: "p-1",
      md: "p-2",
      lg: "p-3",
    },
  }
);

export const linkStyles = styles("rounded-1", {
  disabled: {
    true: "pointer-events-none",
    false: "",
  },
});
