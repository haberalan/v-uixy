export const useTheme = () => {
  const theme = inject("theme") as Ref<"light" | "dark">;

  const changeTheme = inject("changeTheme") as (
    theme: "light" | "dark"
  ) => void;

  if (!theme || !changeTheme)
    throw new Error("useTheme composable must be used inside theme provider.");

  return {
    theme,
    changeTheme,
  };
};
