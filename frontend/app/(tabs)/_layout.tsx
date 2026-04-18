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
  const bottomInset = Math.max(insets.bottom, 12);

  // Extra reserved space for Android system navigation area
  const androidBottomReserve = isAndroid ? 28 : 0;

  // Extra lift to push the interactive tab buttons above the system buttons
  const androidTabLift = isAndroid ? 14 : 0;

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
          height: 60 + bottomInset + androidBottomReserve,
          paddingTop: 8,
          paddingBottom: bottomInset + androidBottomReserve,
        },
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 4,
          marginBottom: androidTabLift,
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
