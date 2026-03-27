import AsyncStorage from "@react-native-async-storage/async-storage";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChips } from "../../src/components/ChoiceChips";
import { useAppTheme } from "../../src/context/ThemeContext";
import { STORAGE_KEYS, ThemeMode } from "../../src/lib/taskTypes";

export default function SettingsScreen() {
  const { colors, mode, setMode } = useAppTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const rawSettings = await AsyncStorage.getItem(STORAGE_KEYS.settings);
      if (!rawSettings) {
        return;
      }

      const parsedSettings = JSON.parse(rawSettings) as { notificationsEnabled?: boolean };
      if (typeof parsedSettings.notificationsEnabled === "boolean") {
        setNotificationsEnabled(parsedSettings.notificationsEnabled);
      }
    };

    loadSettings();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ notificationsEnabled: value }));
  };

  return (
    <SafeAreaView edges={["top"]} style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content} testID="settings-screen">
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>Settings</Text>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>App preferences</Text>

        <View style={[styles.block, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>Theme</Text>
          <ChoiceChips
            onChange={(value) => setMode(value as ThemeMode)}
            options={[
              { label: "Dark", value: "dark" },
              { label: "Light", value: "light" },
            ]}
            testIDPrefix="theme-mode"
            value={mode}
          />
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface }]}> 
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Notifications</Text>
              <Text style={[styles.rowBody, { color: colors.textSecondary }]}>UI toggle for future reminders</Text>
            </View>
            <Switch
              onValueChange={toggleNotifications}
              testID="notifications-toggle"
              thumbColor={notificationsEnabled ? colors.accentText : "#FFFFFF"}
              trackColor={{ false: colors.border, true: colors.accentPrimary }}
              value={notificationsEnabled}
            />
          </View>
        </View>

        <View style={[styles.block, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>Future sync</Text>

          {[
            { icon: "chrome", label: "Continue with Google" },
            { icon: "facebook", label: "Continue with Facebook" },
          ].map((item) => (
            <Pressable
              key={item.label}
              accessibilityLabel={item.label}
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: colors.surfaceMuted, opacity: pressed ? 0.82 : 1 },
              ]}
              testID={`social-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Feather color={colors.textPrimary} name={item.icon as never} size={18} />
              <Text style={[styles.socialLabel, { color: colors.textPrimary }]}>{item.label}</Text>
              <Text style={[styles.comingSoon, { color: colors.textSecondary }]}>Soon</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.aboutCard, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.blockTitle, { color: colors.textPrimary }]}>About DayStack</Text>
          <Text style={[styles.aboutBody, { color: colors.textSecondary }]}>DayStack keeps routines, one-time tasks, and fast daily checkoffs in one simple local-first space.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 20,
    paddingBottom: 120,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  block: {
    borderRadius: 28,
    gap: 18,
    padding: 20,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowText: {
    flex: 1,
    gap: 6,
    paddingRight: 16,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  socialButton: {
    alignItems: "center",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  socialLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  comingSoon: {
    fontSize: 13,
    fontWeight: "500",
  },
  aboutCard: {
    borderRadius: 28,
    gap: 12,
    padding: 20,
  },
  aboutBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});