import styles from "~/utils/styles";

export const scrollAreaStyles = styles("scrollbar w-full overflow-x-auto", {
  scrollY: {
    true: "overflow-y-auto",
    false: "",
  },
});

export const tableStyles = styles(
  "w-full caption-bottom border-separate border-spacing-0 text-xs",
);

export const captionStyles = styles(
  "px-4 py-3 text-left text-xs text-gray-600 dark:text-gray-500",
);

export const thStyles = styles(
  "whitespace-nowrap border-b border-gray-300 bg-white align-middle text-xs font-500 text-gray-600 dark:border-gray-900 dark:bg-gray-1000 dark:text-gray-500",
  {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    density: {
      compact: "h-9 px-3",
      comfortable: "h-10 px-4",
    },
    sticky: {
      true: "sticky top-0 z-10",
      false: "",
    },
  },
);

export const thContentStyles = styles("flex w-full items-center gap-2");

export const thLabelStyles = styles("flex min-w-0 flex-1 items-center gap-1", {
  align: {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  },
});

export const sortButtonStyles = styles(
  "inline-flex cursor-pointer select-none items-center gap-1 transition-colors hover:text-black dark:hover:text-white",
);

export const sortIconStyles = styles(
  "h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-gray-600",
  {
    active: {
      true: "text-black dark:text-white",
      false: "",
    },
  },
);

export const filterTriggerStyles = styles(
  "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-800",
  {
    active: {
      true: "text-black dark:text-white",
      false: "text-gray-500 dark:text-gray-600",
    },
  },
);

export const filterPanelStyles = styles("flex w-56 flex-col gap-2 p-2");

export const rowStyles = styles("transition-colors", {
  selected: {
    true: "bg-gray-100 dark:bg-gray-900",
    false: "hover:bg-gray-100 dark:hover:bg-gray-900",
  },
});

export const tdStyles = styles(
  "border-b border-gray-300 align-middle text-gray-900 dark:border-gray-900 dark:text-gray-100",
  {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    density: {
      compact: "px-3 py-2",
      comfortable: "px-4 py-3",
    },
    last: {
      true: "border-b-0",
      false: "",
    },
  },
);

export const footerCellStyles = styles(
  "border-t border-gray-300 bg-gray-100 align-middle font-500 text-gray-800 dark:border-gray-900 dark:bg-gray-900 dark:text-gray-300",
  {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    density: {
      compact: "px-3 py-2",
      comfortable: "px-4 py-3",
    },
  },
);

export const emptyStyles = styles(
  "flex flex-col items-center justify-center gap-2 py-16 text-xs text-gray-500 dark:text-gray-500",
);

export const paginationBarStyles = styles(
  "flex flex-wrap items-center justify-between gap-3 px-2 pt-1 pb-0 text-xs",
);

export const paginationInfoStyles = styles(
  "text-xs text-gray-600 dark:text-gray-500",
);

export const paginationControlsStyles = styles("flex items-center gap-1");

export const paginationButtonStyles = styles(
  "flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-1 px-1.5 text-xs transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:cursor-default disabled:text-gray-400 dark:hover:bg-gray-800 dark:disabled:text-gray-700",
  {
    active: {
      true: "bg-gray-800 text-gray-100 hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-200",
      false: "text-gray-800 dark:text-gray-300",
    },
  },
);

export const paginationEllipsisStyles = styles(
  "flex h-6 min-w-6 items-center justify-center text-gray-500 dark:text-gray-600",
);
