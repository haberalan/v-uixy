import styles from "~/utils/styles";

export const toggleStyles = styles(
  "border flex items-center justify-center gap-2 min-w-[32px] w-fit px-1 py-1 rounded-1 transition-all ease-in-out duration-150",
  {
    variant: {
      primary: "border-transparent",
      secondary: "border-gray-300 dark:border-gray-900",
    },
    toggled: {
      true: "bg-gray-200 dark:bg-gray-900 text-black dark:text-gray-300",
      false:
        "hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-600 hover:text-black dark:hover:text-gray-300",
    },
    disabled: {
      true: "pointer-events-none text-gray-400 border-gray-200 dark:text-gray-800 dark:border-gray-800",
      false: "cursor-pointer",
    },
  }
);
