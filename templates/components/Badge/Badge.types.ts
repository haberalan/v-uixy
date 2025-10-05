import { type UixyLinkProps } from "../Link";
import type { IconName } from "~/types/icons";

export interface UixyBadgeProps {
  variant: "primary" | "secondary" | "tertiary";
  size: "xs" | "sm" | "md" | "lg";
  shape: "rounded" | "pill";
  disabled?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
  link?: UixyLinkProps;
}
