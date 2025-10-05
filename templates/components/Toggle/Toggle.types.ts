import type { IconName } from "~/types/icons";

export interface UixyToggleProps {
  variant: "primary" | "secondary";
  icon: IconName;
  label?: string;
  disabled?: boolean;
}
