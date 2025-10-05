import styles from "~/utils/styles";

export const avatarWrapperStyles = styles(
  "relative flex w-fit items-center justify-center overflow-hidden bg-gray-200 text-black dark:bg-gray-900 dark:text-gray-100",
  {
    variant: {
      rounded: "rounded-full",
      squared: "rounded-2",
      default: "",
    },
  }
);

export const avatarImageStyles = styles(
  "flex aspect-square items-center overflow-hidden text-center text-[0]",
  {
    show: {
      true: "",
      false: "opacity-0",
    },
    variant: {
      rounded: "rounded-full",
      squared: "rounded-2",
      default: "",
    },
  }
);
