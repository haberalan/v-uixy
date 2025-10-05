import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  override: {
    classGroups: {
      "font-size": [
        "text-display-2xl",
        "text-display-xl",
        "text-display-lg",
        "text-display-md",
        "text-display-sm",
        "text-3xl",
        "text-2xl",
        "text-xl",
        "text-lg",
        "text-md",
        "text-sm",
        "text-xs",
        "text-button-lg",
        "text-button-md",
        "text-button-sm",
      ],
      "text-color": [
        "text-gray-100",
        "text-gray-200",
        "text-gray-300",
        "text-gray-400",
        "text-gray-500",
        "text-gray-600",
        "text-gray-700",
        "text-gray-800",
        "text-gray-900",
        "text-gray-1000",
        "text-white",
        "text-black",
      ],
    },
  },
});

export { twMerge };
