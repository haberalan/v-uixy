import styles from "~/utils/styles";

export const inputStyles = styles(
  "peer transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 rounded-1 px-3 py-2 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 outline-offset-1 outline-gray-300",
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
    icon: {
      left: "pl-8",
      right: "pr-8",
      none: "",
    },
  }
);

export const iconStyles = styles(
  "select-none pointer-events-none h-5 w-5 absolute bottom-2 transition-colors duration-150 ease-in-out",
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
    icon: {
      left: "left-2",
      right: "right-2",
      none: "",
    },
    targetable: {
      true: "pointer-events-auto cursor-pointer",
      false: "",
    },
  }
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
  }
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
  }
);
