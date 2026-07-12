import styles from "~/utils/styles";

export const checkboxStyles = styles("flex items-center gap-2");

export const inputStyles = styles(
  "size-4 cursor-pointer appearance-none rounded-1 border border-black transition-all duration-150 ease-in-out checked:bg-black hover:bg-gray-300 checked:hover:bg-gray-800 disabled:pointer-events-none disabled:border-gray-500 disabled:bg-gray-300 checked:disabled:bg-gray-500 dark:border-gray-100 dark:checked:bg-gray-100 dark:hover:bg-gray-800 dark:checked:hover:bg-gray-200 dark:disabled:border-gray-600 dark:disabled:bg-gray-900 dark:checked:disabled:bg-gray-600",
  {
    indeterminate: {
      true: "bg-black hover:bg-gray-800 disabled:bg-gray-300 dark:bg-gray-100 dark:hover:bg-gray-200 dark:disabled:bg-gray-900",
      false: "",
    },
  },
);

export const iconStyles = styles("h-3 w-3", {
  disabled: {
    true: "text-gray-500",
    false: "",
  },
  checked: {
    true: "dark:text-black text-white",
    false: "text-transparent",
  },
});

export const labelStyles = styles("text-sm", {
  disabled: {
    true: "text-gray-500 dark:text-gray-600",
    false: "",
  },
});
