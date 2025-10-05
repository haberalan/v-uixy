import styles from "~/utils/styles";

export const inputOTPStyles = styles(
  "peer w-10 relative shadow-sm focus-visible:z-10 text-center h-12 transition-colors ease-in-out duration-150 border border-gray-300 dark:border-gray-900 p-0 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-700 dark:outline-gray-800 font-500 text-lg outline-offset-1 outline-gray-300",
  {
    status: {
      default:
        "bg-white dark:bg-gray-1000 focus-visible:border-gray-500 dark:focus-visible:border-gray-600",
      disabled: "bg-gray-200 text-gray-400 dark:bg-gray-900 dark:text-gray-700",
    },
    place: {
      left: "rounded-l-1",
      leftEdge: "rounded-l-3",
      right: "rounded-r-1",
      rightEdge: "rounded-r-3",
      center: "",
    },
  }
);
