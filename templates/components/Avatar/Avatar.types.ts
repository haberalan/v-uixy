export interface UixyAvatarProps {
  src: string;
  alt: string;
  variant?: "rounded" | "squared" | "default";
  loading?: HTMLImageElement["loading"];
}
