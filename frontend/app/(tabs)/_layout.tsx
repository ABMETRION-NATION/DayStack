import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "../../src/context/ThemeContext";

const HomeTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Feather color={color} name="home" size={size} />
);

const TasksTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Feather color={color} name="check-square" size={size} />
);

const StatsTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Feather color={color} name="bar-chart-2" size={size} />
);

const SettingsTabIcon = ({ color, size }: { color: string; size: number }) => (
  <Feather color={color} name="settings" size={size} />
);

export default function TabsLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const safeBottomInset = Math.max(insets.bottom, 12);
  const tabBarBaseHeight = 60;
  const tabBarHeight = tabBarBaseHeight + safeBottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: { display: "none" },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingBottom: safeBottomInset,
          paddingTop: 10,
          paddingHorizontal: 4,
          elevation: 8,
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          ...(Platform.OS === "android"
            ? {
                paddingBottom: safeBottomInset + 4,
              }
            : {}),
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home",
          tabBarButtonTestID: "nav-home-tab",
          tabBarIcon: HomeTabIcon,
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          tabBarAccessibilityLabel: "Tasks",
          tabBarButtonTestID: "nav-tasks-tab",
          tabBarIcon: TasksTabIcon,
          title: "Tasks",
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarAccessibilityLabel: "Stats",
          tabBarButtonTestID: "nav-stats-tab",
          tabBarIcon: StatsTabIcon,
          title: "Stats",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarAccessibilityLabel: "Settings",
          tabBarButtonTestID: "nav-settings-tab",
          tabBarIcon: SettingsTabIcon,
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
