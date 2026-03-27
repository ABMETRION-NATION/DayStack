import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChips } from "../../src/components/ChoiceChips";
import { TaskRow } from "../../src/components/TaskRow";
import { useTasks } from "../../src/context/TasksContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import { CATEGORY_OPTIONS, TaskFilterMode } from "../../src/lib/taskTypes";
import { formatDueLabel, getRecurrenceLabel, getTaskSections, toDateKey } from "../../src/lib/taskUtils";

const FILTER_OPTIONS: { label: string; value: TaskFilterMode }[] = [
  { label: "All", value: "all" },
  { label: "Recurring", value: "recurring" },
  { label: "One-time", value: "one-time" },
];

export default function TasksScreen() {
  const { colors } = useAppTheme();
  const { deleteTask, ready, tasks, completions, toggleTaskCompletion } = useTasks();
  const todayKey = toDateKey(new Date());
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filterMode, setFilterMode] = useState<TaskFilterMode>("all");

  const sections = useMemo(
    () => getTaskSections(tasks, completions, categoryFilter, filterMode, todayKey),
    [categoryFilter, completions, filterMode, tasks, todayKey],
  );

  const handleToggle = async (taskId: string) => {
    await Haptics.selectionAsync();
    toggleTaskCompletion(taskId, todayKey);
  };

  if (!ready) {
    return (
      <SafeAreaView style={[styles.loadingScreen, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.textPrimary} testID="tasks-loading" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={[styles.screen, { backgroundColor: colors.background }]}>
      <SectionList
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No tasks match this filter.</Text>
            <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>Try another category or add a new task.</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.headerRow}>
              <View style={styles.headerTextWrap}>
                <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>Tasks</Text>
                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Everything in one list</Text>
              </View>

              <Pressable
                accessibilityLabel="Add new task"
                onPress={() => router.push("../task-editor")}
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: colors.accentPrimary, opacity: pressed ? 0.82 : 1 },
                ]}
                testID="tasks-open-editor"
              >
                <Feather color={colors.accentText} name="plus" size={18} />
              </Pressable>
            </View>

            <View style={styles.filterWrap}>
              <ChoiceChips
                onChange={setCategoryFilter}
                options={[
                  { label: "All", value: "All" },
                  ...CATEGORY_OPTIONS.map((category) => ({
                    color: colors.categoryColors[category.toLowerCase() as keyof typeof colors.categoryColors],
                    label: category,
                    value: category,
                  })),
                ]}
                size="compact"
                testIDPrefix="tasks-category"
                value={categoryFilter}
              />

              <ChoiceChips
                onChange={(value) => setFilterMode(value as TaskFilterMode)}
                options={FILTER_OPTIONS}
                size="compact"
                testIDPrefix="tasks-filter"
                value={filterMode}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TaskRow
            category={item.task.category}
            completed={item.completedToday}
            onDelete={() => deleteTask(item.task.id)}
            onPress={() => router.push({ pathname: "../task-editor", params: { id: item.task.id } })}
            onToggle={item.canToggleToday ? () => handleToggle(item.task.id) : undefined}
            showCheckbox={item.canToggleToday}
            subtitle={item.task.notes || getRecurrenceLabel(item.task.recurrence)}
            testID={`task-item-${item.task.id}`}
            title={item.task.title}
            trailingText={formatDueLabel(item.nextDate, todayKey)}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
        )}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        testID="tasks-screen"
        keyExtractor={(item) => item.task.id}
      />
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
  headerWrap: {
    marginBottom: 20,
  },
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTextWrap: {
    flex: 1,
    gap: 8,
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
  addButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 48,
    justifyContent: "center",
    marginLeft: 16,
    width: 48,
  },
  filterWrap: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
  },
  emptyCard: {
    borderRadius: 24,
    gap: 8,
    marginTop: 12,
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
});