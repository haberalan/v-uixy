import styles from "~/utils/styles";

export const sliderWrapperStyles = styles("relative flex w-full");

export const sliderStyles = styles(
  "pointer-events-none absolute top-0 h-2 bg-black dark:bg-gray-100",
  {
    disabled: {
      true: "bg-gray-500 dark:bg-gray-500",
      false: "",
    },
  }
);
