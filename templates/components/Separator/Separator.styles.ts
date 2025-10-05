import styles from "~/utils/styles";

export const separatorStyles = styles(
  "bg-gray-300 dark:bg-gray-900 self-stretch justify-stretch shrink-0",
  {
    variant: {
      vertical: "w-[1px] min-h-full",
      horizontal: "h-[1px] w-full",
    },
  }
);
