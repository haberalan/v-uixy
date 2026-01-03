import styles from "~/utils/styles";

export const checkboxStyles = styles("flex items-center gap-2");

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

export const labelStyles = styles("text-xs", {
  disabled: {
    true: "text-gray-500 dark:text-gray-600",
    false: "",
  },
});
