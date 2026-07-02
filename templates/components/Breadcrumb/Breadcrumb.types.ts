import { type UixyLinkProps } from "../Link";
import type { IconName } from "~/types/icons";

export interface UixyBreadcrumbItem {
  label: string;
  link?: UixyLinkProps;
  icon?: IconName;
  current?: boolean;
}

export interface UixyBreadcrumbProps {
  items: UixyBreadcrumbItem[];
  separator?: IconName;
  size?: "sm" | "md";
  maxItems?: number;
}

export interface ItemNode {
  kind: "item";
  item: UixyBreadcrumbItem;
  current: boolean;
}

export interface EllipsisNode {
  kind: "ellipsis";
  item?: undefined;
  current?: undefined;
}

export type BreadcrumbNode = ItemNode | EllipsisNode;
