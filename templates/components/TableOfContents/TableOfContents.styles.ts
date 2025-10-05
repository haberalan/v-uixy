import styles from "~/utils/styles";

export const tableOfContentsStyles = styles(
  "flex w-full max-w-[200px] flex-col gap-4"
);

export const itemStyles = styles(
  "text-xs line-clamp-1 transition-all duration-150 ease-in-out cursor-pointer",
  {
    node: {
      H2: "ml-0",
      H3: "ml-1",
      H4: "ml-2",
      H5: "ml-3",
      H6: "ml-4",
    },
    active: {
      true: "pl-1 font-600",
      false:
        "text-gray-700 pl-0 dark:text-gray-600 hover:pl-1 hover:text-gray-600 dark:hover:text-gray-100",
    },
  }
);
