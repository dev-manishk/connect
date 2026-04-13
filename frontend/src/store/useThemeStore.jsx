import { create } from "zustand";

export const useThemeStore = create((Set) => ({
  theme: localStorage.getItem("connect-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("connect-theme", theme);
    Set({ theme });
  },
}));
