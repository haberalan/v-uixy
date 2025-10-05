import styles from "~/utils/styles";

export const sheetStyles = styles(
  "fixed top-0 z-50 h-full w-full max-w-[320px] border-gray-300 bg-gray-100 shadow-xl dark:border-gray-900 dark:bg-black",
  {
    direction: {
      left: "left-0 border-r",
      right: "right-0 border-l",
    },
  }
);
