import styles from "~/utils/styles";

export const inputStyles = styles(
  "peer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 outline-offset-1 outline-gray-300",
  {
    status: {
      default:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600",
      error:
        "bg-white dark:bg-gray-1000 border-error-700 dark:border-error-900 text-error-600 dark:text-error-500",
      disabled: "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-700",
      valid:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600",
    },
    size: {
      sm: "px-2.5 py-1.5 text-xs",
      md: "px-3 py-2 text-sm",
      xl: "px-3.5 py-2.5 text-base",
    },
    icon: {
      left: "pl-8",
      right: "pr-8",
      none: "",
    },
  },
  {
    "size.sm+icon.left": "pl-7",
    "size.sm+icon.right": "pr-7",
    "size.xl+icon.left": "pl-9",
    "size.xl+icon.right": "pr-9",
  },
);

export const iconStyles = styles(
  "select-none pointer-events-none absolute transition-colors duration-150 ease-in-out",
  {
    status: {
      default:
        "text-gray-400 peer-focus:text-black hover:text-black dark:text-gray-700 dark:peer-focus:text-gray-500 dark:hover:text-gray-500",
      error:
        "text-error-700 hover:text-error-600 dark:text-error-600 dark:hover:text-error-500",
      disabled: "text-gray-400 dark:text-gray-700 pointer-events-none!",
      valid:
        "text-gray-400 peer-focus:text-black hover:text-black dark:text-gray-700 dark:peer-focus:text-gray-500 dark:hover:text-gray-500",
    },
    size: {
      sm: "h-4 w-4 bottom-1.5",
      md: "h-5 w-5 bottom-2",
      xl: "h-5 w-5 bottom-2.5",
    },
    icon: {
      left: "left-2",
      right: "right-2",
      none: "",
    },
    targetable: {
      true: "pointer-events-auto cursor-pointer",
      false: "",
    },
  },
  {
    "size.sm+icon.left": "left-1.5",
    "size.sm+icon.right": "right-1.5",
    "size.xl+icon.left": "left-2.5",
    "size.xl+icon.right": "right-2.5",
  },
);

export const labelStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs font-500",
  {
    status: {
      default: "",
      error: "text-error-600",
      disabled: "text-gray-500 dark:text-gray-700",
      valid: "",
    },
  },
);

export const helperStyles = styles(
  "transition-colors ease-in-out duration-150 text-xs",
  {
    status: {
      default: "text-gray-600",
      error: "text-error-600",
      disabled: "text-gray-400 dark:text-gray-800",
      valid: "text-gray-600",
    },
  },
);
