import styles from "~/utils/styles";

export const breadcrumbListStyles = styles("flex flex-wrap items-center", {
  size: {
    sm: "gap-1 text-xs",
    md: "gap-1.5 text-sm",
  },
});

export const breadcrumbItemStyles = styles("inline-flex items-center");

export const breadcrumbLinkStyles = styles(
  "inline-flex items-center gap-1.5 rounded-1 text-gray-600 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors duration-150 ease-in-out outline-offset-2 outline-gray-300",
);

export const breadcrumbCurrentStyles = styles(
  "inline-flex items-center gap-1.5 font-500 text-gray-900 dark:text-gray-100 select-none",
);

export const breadcrumbSeparatorStyles = styles(
  "inline-flex items-center text-gray-400 dark:text-gray-700 select-none",
);

export const breadcrumbEllipsisStyles = styles(
  "inline-flex items-center justify-center rounded-1 p-0.5 text-gray-500 hover:text-black dark:text-gray-600 dark:hover:text-white transition-colors duration-150 ease-in-out cursor-pointer outline-offset-2 outline-gray-300",
);

export const breadcrumbIconStyles = styles("shrink-0", {
  size: {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
  },
});

export const breadcrumbSeparatorIconStyles = styles("shrink-0", {
  size: {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
  },
});
