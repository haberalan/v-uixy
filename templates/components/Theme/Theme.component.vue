<template>
  <client-only>
    <slot />
  </client-only>
</template>

<script setup lang="ts">
  const getTheme = () => {
    if (typeof window !== "undefined") {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const t = window.localStorage.getItem("theme");

      if (t) return t as "light" | "dark";

      return darkModeMediaQuery.matches ? "dark" : "light";
    }

    return "dark";
  };

  const theme = ref<"light" | "dark">(getTheme());

  const changeTheme = (val: "light" | "dark") => {
    window.localStorage.setItem("theme", val);

    theme.value = val;
  };

  const listener = (event: StorageEvent) => {
    if (event.key === "theme") {
      theme.value = event.newValue as "light" | "dark";
    }
  };

  const updateClasses = (val: "light" | "dark") => {
    const body = document.querySelector("body");

    if (!body) return;

    const root = document.documentElement;

    root.classList.add("disable-transitions");

    body.classList.remove("light", "dark");
    body.classList.add(val as unknown as string);

    requestAnimationFrame(() => {
      root.classList.remove("disable-transitions");
    });
  };

  watch(
    () => theme.value,
    (newVal) => {
      updateClasses(newVal);
    }
  );

  onMounted(() => {
    window.addEventListener("storage", listener);

    updateClasses(getTheme());

    setTimeout(() => {
      const body = document.querySelector("body");

      if (!body) return;

      body.classList.add("loaded");
    }, 300);
  });

  onUnmounted(() => {
    window.removeEventListener("storage", listener);
  });

  provide("theme", theme);
  provide("changeTheme", changeTheme);
</script>
