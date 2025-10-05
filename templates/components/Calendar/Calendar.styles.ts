import styles from "~/utils/styles";

export const calendarStyles = styles(
  "flex w-fit flex-col items-center rounded-2 border border-gray-300 bg-gray-100 p-3 shadow-xs dark:border-gray-900 dark:bg-black"
);

export const calendarDayStyles = styles(
  "flex cursor-pointer size-[28px] items-center justify-center rounded-1 p-1 transition",
  {
    currentMonth: {
      true: "dark:text-gray-300",
      false: "text-gray-500 dark:text-gray-600",
    },
    selected: {
      true: "bg-black text-white hover:bg-black dark:bg-white dark:!text-black dark:hover:bg-white",
      false: "hover:bg-gray-300 dark:hover:bg-gray-700",
    },
    disabled: {
      true: "cursor-default pointer-events-none",
      false: "cursor-pointer",
    },
  }
);
