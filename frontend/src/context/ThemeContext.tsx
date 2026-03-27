import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { STORAGE_KEYS, ThemeMode } from "../lib/taskTypes";

const palettes = {
  dark: {
    background: "#09090B",
    surface: "#18181B",
    surfaceMuted: "#111113",
    border: "#27272A",
    textPrimary: "#FAFAFA",
    textSecondary: "#A1A1AA",
    textTertiary: "#52525B",
    accentPrimary: "#FFFFFF",
    accentText: "#09090B",
    success: "#22C55E",
    destructive: "#EF4444",
    categoryColors: {
      home: "#60A5FA",
      work: "#F59E0B",
      health: "#34D399",
      hobby: "#A78BFA",
    },
  },
  light: {
    background: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F4F5",
    border: "#E5E5E5",
    textPrimary: "#09090B",
    textSecondary: "#52525B",
    textTertiary: "#A1A1AA",
    accentPrimary: "#09090B",
    accentText: "#FAFAFA",
    success: "#16A34A",
    destructive: "#DC2626",
    categoryColors: {
      home: "#3B82F6",
      work: "#D97706",
      health: "#059669",
      hobby: "#7C3AED",
    },
  },
} as const;

type ThemeContextValue = {
  colors: (typeof palettes)[ThemeMode];
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const loadTheme = async () => {
      const savedMode = await AsyncStorage.getItem(STORAGE_KEYS.theme);
      if (savedMode === "dark" || savedMode === "light") {
        setModeState(savedMode);
      }
    };

    loadTheme();
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(STORAGE_KEYS.theme, nextMode);
  };

  const value = useMemo(
    () => ({
      colors: palettes[mode],
      isDark: mode === "dark",
      mode,
      setMode,
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside ThemeProvider");
  }

  return context;
};