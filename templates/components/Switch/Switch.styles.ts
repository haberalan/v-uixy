import styles from "~/utils/styles";

export const switchStyles = styles(
  "pointer-events-none absolute mx-[2px] h-4 w-4 rounded-full bg-gray-100 shadow-xs transition-colors duration-200 ease-in-out",
  {
    disabled: {
      true: "bg-gray-400 dark:bg-gray-600",
      false: "",
    },
    checked: {
      true: "dark:bg-black",
      false: "",
    },
  }
);

export const labelStyles = styles("text-sm", {
  disabled: {
    true: "text-gray-500 dark:text-gray-600",
    false: "",
  },
});
