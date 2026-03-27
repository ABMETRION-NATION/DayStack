import Feather from "@expo/vector-icons/Feather";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTasks } from "../../src/context/TasksContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import { getCompletedThisWeek, getCurrentStreak, getTotalCompleted, getWeeklyBars } from "../../src/lib/taskUtils";

export default function StatsScreen() {
  const { colors } = useAppTheme();
  const { completions, ready } = useTasks();
  const weeklyBars = useMemo(() => getWeeklyBars(completions), [completions]);
  const totalCompleted = getTotalCompleted(completions);
  const weeklyCompleted = getCompletedThisWeek(completions);
  const streak = getCurrentStreak(completions);
  const maxCount = Math.max(...weeklyBars.map((item) => item.count), 1);

  if (!ready) {
    return (
      <SafeAreaView style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.textPrimary} testID="stats-loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.content} testID="stats-screen">
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>Stats</Text>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Your progress</Text>

        <View style={styles.grid}>
          <View style={[styles.primaryCard, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Total completed</Text>
            <Text style={[styles.largeValue, { color: colors.textPrimary }]}>{totalCompleted}</Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: colors.surface }]}> 
            <View style={styles.iconRow}>
              <Feather color={colors.textPrimary} name="zap" size={18} />
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Current streak</Text>
            </View>
            <Text style={[styles.mediumValue, { color: colors.textPrimary }]}>{streak} days</Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: colors.surface }]}> 
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>This week</Text>
            <Text style={[styles.mediumValue, { color: colors.textPrimary }]}>{weeklyCompleted}</Text>
          </View>
        </View>

        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>Weekly activity</Text>
          <View style={styles.chartWrap}>
            {weeklyBars.map((item) => {
              const height = 28 + (item.count / maxCount) * 92;

              return (
                <View key={item.dateKey} style={styles.barColumn}>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceMuted }]}> 
                    <View
                      style={[
                        styles.barFill,
                        { backgroundColor: colors.accentPrimary, height },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barCount, { color: colors.textPrimary }]}>{item.count}</Text>
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  primaryCard: {
    borderRadius: 28,
    gap: 14,
    minHeight: 180,
    padding: 24,
    width: "100%",
  },
  smallCard: {
    borderRadius: 24,
    gap: 12,
    minHeight: 140,
    padding: 20,
    width: "47%",
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  largeValue: {
    fontSize: 54,
    fontWeight: "800",
  },
  mediumValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  iconRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  chartCard: {
    borderRadius: 28,
    gap: 20,
    padding: 24,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  chartWrap: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    minHeight: 170,
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  barTrack: {
    alignItems: "center",
    borderRadius: 999,
    height: 140,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: 22,
  },
  barFill: {
    borderRadius: 999,
    width: 22,
  },
  barCount: {
    fontSize: 13,
    fontWeight: "700",
  },
  barLabel: {
    fontSize: 12,
  },
});