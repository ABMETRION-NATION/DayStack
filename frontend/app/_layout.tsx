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

  const isAndroid = Platform.OS === "android";
  const horizontalInset = 16;
  const floatingBottom = isAndroid ? Math.max(insets.bottom, 16) + 28 : Math.max(insets.bottom, 10);
  const tabBarHeight = 72;
  const reservedScreenBottom = tabBarHeight + floatingBottom + 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: colors.background,
          paddingBottom: reservedScreenBottom,
        },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: "absolute",
          left: horizontalInset,
          right: horizontalInset,
          bottom: floatingBottom,
          height: tabBarHeight,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 8,
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          borderRadius: 24,
          elevation: 16,
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 6 },
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
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
