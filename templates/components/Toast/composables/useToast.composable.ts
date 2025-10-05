import type { UixyToastItemProps } from "../Toast.types";

export const useToast = () => {
  const push = inject("push-toast") as (
    Toast: Omit<UixyToastItemProps, "id">
  ) => void;

  const close = inject("close-toast") as (id: string) => void;

  if (!push || !close)
    throw new Error("useToast composable must be used inside Toast provider.");

  return {
    push,
    close,
  };
};
