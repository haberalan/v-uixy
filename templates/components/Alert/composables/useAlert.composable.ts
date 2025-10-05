import type { UixyAlertItemProps } from "../Alert.types";

export const useAlert = () => {
  const push = inject("push-alert") as (
    alert: Omit<UixyAlertItemProps, "id">
  ) => void;

  const close = inject("close-alert") as (id: string) => void;

  if (!push || !close)
    throw new Error("useAlert composable must be used inside alert provider.");

  return {
    push,
    close,
  };
};
