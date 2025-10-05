import styles from "~/utils/styles";

export const loaderStyles = styles(
  "inline-block border-solid border-current border-b-transparent rounded-full animate-spin",
  {
    size: {
      sm: "border-2 h-4 w-4",
      md: "border-4 h-8 w-8",
      lg: "border-8 h-12 w-12",
    },
  }
);
