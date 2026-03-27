import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChips } from "../../src/components/ChoiceChips";
import { TaskRow } from "../../src/components/TaskRow";
import { useTasks } from "../../src/context/TasksContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import { CATEGORY_OPTIONS } from "../../src/lib/taskTypes";
import { formatDateShort, getTasksForDate, getUpcomingTasks, toDateKey } from "../../src/lib/taskUtils";

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { quickAddTask, ready, tasks, completions, toggleTaskCompletion } = useTasks();
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState<(typeof CATEGORY_OPTIONS)[number]>("Home");

  const todayKey = toDateKey(new Date());
  const todayTasks = useMemo(
    () => getTasksForDate(tasks, completions, todayKey),
    [completions, tasks, todayKey],
  );
  const upcomingTasks = useMemo(
    () => getUpcomingTasks(tasks, completions, todayKey, 5),
    [completions, tasks, todayKey],
  );

  const completedToday = todayTasks.filter((task) => task.isCompleted).length;
  const progress = todayTasks.length === 0 ? 0 : completedToday / todayTasks.length;

  const handleToggle = async (taskId: string) => {
    await Haptics.selectionAsync();
    toggleTaskCompletion(taskId, todayKey);
  };

  const handleQuickAdd = () => {
    const trimmedTitle = quickTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    quickAddTask(trimmedTitle, quickCategory);
    setQuickTitle("");
  };

  if (!ready) {
    return (
      <SafeAreaView style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.textPrimary} testID="home-loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        testID="home-screen"
      >
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Today · {formatDateShort(todayKey)}</Text>
            <Text style={[styles.progressValue, { color: colors.textPrimary }]}>
              {completedToday} of {todayTasks.length}
            </Text>
            <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>tasks completed</Text>
          </View>

          <Pressable
            accessibilityLabel="Open add task"
            onPress={() => router.push("../task-editor")}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.accentPrimary, opacity: pressed ? 0.82 : 1 },
            ]}
            testID="home-open-editor"
          >
            <Feather color={colors.accentText} name="plus" size={18} />
          </Pressable>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.accentPrimary, width: `${progress * 100}%` },
            ]}
          />
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Today&apos;s stack</Text>
          <View>
            {todayTasks.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}> 
                <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Nothing due today.</Text>
                <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>Use quick add below or create a recurring routine.</Text>
              </View>
            ) : (
              todayTasks.map((task) => (
                <TaskRow
                  key={task.key}
                  category={task.category}
                  completed={task.isCompleted}
                  onPress={() => router.push({ pathname: "../task-editor", params: { id: task.taskId } })}
                  onToggle={() => handleToggle(task.taskId)}
                  subtitle={task.notes || task.recurrenceLabel}
                  testID={`today-task-${task.taskId}`}
                  title={task.title}
                  trailingText={task.recurrenceLabel}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming</Text>
          <View style={{ opacity: 0.7 }}>
            {upcomingTasks.length === 0 ? (
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>Your next 5 tasks will appear here.</Text>
            ) : (
              upcomingTasks.map((task) => (
                <TaskRow
                  key={task.key}
                  category={task.category}
                  onPress={() => router.push({ pathname: "../task-editor", params: { id: task.taskId } })}
                  showCheckbox={false}
                  subtitle={task.notes || task.recurrenceLabel}
                  testID={`upcoming-task-${task.key}`}
                  title={task.title}
                  trailingText={formatDateShort(task.dateKey)}
                />
              ))
            )}
          </View>
        </View>

        <View style={[styles.quickAddCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.quickAddTitle, { color: colors.textPrimary }]}>Quick add</Text>
          <TextInput
            onChangeText={setQuickTitle}
            placeholder="Add something for today"
            placeholderTextColor={colors.textTertiary}
            style={[styles.input, { backgroundColor: colors.surfaceMuted, color: colors.textPrimary }]}
            testID="quick-add-input"
            value={quickTitle}
          />

          <ChoiceChips
            onChange={(value) => setQuickCategory(value as (typeof CATEGORY_OPTIONS)[number])}
            options={CATEGORY_OPTIONS.map((category) => ({
              color: colors.categoryColors[category.toLowerCase() as keyof typeof colors.categoryColors],
              label: category,
              value: category,
            }))}
            size="compact"
            testIDPrefix="quick-category"
            value={quickCategory}
          />

          <Pressable
            accessibilityLabel="Save quick task"
            onPress={handleQuickAdd}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.accentPrimary, opacity: pressed ? 0.82 : 1 },
            ]}
            testID="quick-add-button"
          >
            <Text style={[styles.primaryButtonText, { color: colors.accentText }]}>Add task</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    paddingBottom: 120,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTextWrap: {
    flex: 1,
    gap: 6,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  progressValue: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 40,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  addButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    marginLeft: 16,
    width: 48,
  },
  progressTrack: {
    borderRadius: 999,
    height: 4,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  sectionWrap: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyCard: {
    borderRadius: 24,
    gap: 8,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 12,
  },
  quickAddCard: {
    borderRadius: 28,
    gap: 16,
    padding: 20,
  },
  quickAddTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  input: {
    borderRadius: 18,
    fontSize: 18,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 56,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});