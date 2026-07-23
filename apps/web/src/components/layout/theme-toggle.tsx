"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "highway-traffic-theme";

type ThemeMode = "light" | "dark";

function resolveTheme() {
  if (typeof window === "undefined") {
    return "light" as ThemeMode;
  }

  const currentTheme = document.documentElement.dataset.theme;
  if (currentTheme === "light" || currentTheme === "dark") {
    return currentTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const nextTheme = resolveTheme();
    setTheme(nextTheme);
    setIsMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }

  const label = isMounted ? `Giao diện: ${theme === "light" ? "Sáng" : "Tối"}` : "Đổi giao diện";

  return (
    <button
      aria-label={label}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <span className={`theme-toggle-indicator${theme === "dark" ? " is-dark" : ""}`} />
      <span>{label}</span>
    </button>
  );
}
