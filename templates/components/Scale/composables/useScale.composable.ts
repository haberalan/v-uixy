export const useScale = () => {
  const setScale = inject("setScale") as (val: number) => void;

  const setDuration = inject("setDuration") as (val: number) => void;

  if (!setScale || !setDuration)
    throw new Error("useScale composable must be used inside Scale provider.");

  return {
    setScale,
    setDuration,
  };
};
