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

  const androidBottomPadding = Platform.OS === "android" ? Math.max(insets.bottom, 28) : Math.max(insets.bottom, 12);
  const tabBarHeight = 62 + androidBottomPadding;

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
          paddingTop: 10,
          paddingBottom: androidBottomPadding,
        },
        tabBarItemStyle: {
          paddingVertical: 0,
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
