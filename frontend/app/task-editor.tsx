import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChips } from "../src/components/ChoiceChips";
import { useTasks } from "../src/context/TasksContext";
import { useAppTheme } from "../src/context/ThemeContext";
import {
  CATEGORY_OPTIONS,
  CustomRecurrenceMode,
  EditorRecurrenceMode,
  TaskDraft,
  WEEKDAY_OPTIONS,
} from "../src/lib/taskTypes";
import { formatDateLong, isValidDateKey, toDateKey } from "../src/lib/taskUtils";

const defaultDraft: TaskDraft = {
  title: "",
  category: "Home",
  dueDate: toDateKey(new Date()),
  notes: "",
  recurrence: { type: "none" },
};

export default function TaskEditorScreen() {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { tasks, upsertTask } = useTasks();
  const existingTask = useMemo(() => tasks.find((task) => task.id === id), [id, tasks]);

  const [title, setTitle] = useState(defaultDraft.title);
  const [category, setCategory] = useState(defaultDraft.category);
  const [dueDate, setDueDate] = useState(defaultDraft.dueDate);
  const [notes, setNotes] = useState(defaultDraft.notes);
  const [recurrenceMode, setRecurrenceMode] = useState<EditorRecurrenceMode>("none");
  const [customMode, setCustomMode] = useState<CustomRecurrenceMode>("interval");
  const [intervalDays, setIntervalDays] = useState("3");
  const [weekdayValues, setWeekdayValues] = useState<string[]>(["1", "3", "5"]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!existingTask) {
      return;
    }

    setTitle(existingTask.title);
    setCategory(existingTask.category);
    setDueDate(existingTask.dueDate);
    setNotes(existingTask.notes);

    switch (existingTask.recurrence.type) {
      case "daily":
        setRecurrenceMode("daily");
        break;
      case "weekly":
        setRecurrenceMode("weekly");
        break;
      case "interval":
        setRecurrenceMode("custom");
        setCustomMode("interval");
        setIntervalDays(String(existingTask.recurrence.intervalDays ?? 3));
        break;
      case "weekdays":
        setRecurrenceMode("custom");
        setCustomMode("weekdays");
        setWeekdayValues((existingTask.recurrence.weekdays ?? []).map(String));
        break;
      default:
        setRecurrenceMode("none");
    }
  }, [existingTask]);

  const toggleWeekday = (value: string) => {
    setWeekdayValues((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value].sort(),
    );
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Task name is required.");
      return;
    }

    if (!isValidDateKey(dueDate)) {
      setError("Use a valid date in YYYY-MM-DD format.");
      return;
    }

    let recurrence: TaskDraft["recurrence"] = { type: "none" };

    if (recurrenceMode === "daily") {
      recurrence = { type: "daily" };
    } else if (recurrenceMode === "weekly") {
      recurrence = { type: "weekly" };
    } else if (recurrenceMode === "custom") {
      if (customMode === "interval") {
        const parsedInterval = Number(intervalDays);
        if (!parsedInterval || parsedInterval < 1) {
          setError("Every X days must be at least 1.");
          return;
        }

        recurrence = { type: "interval", intervalDays: parsedInterval };
      } else {
        if (weekdayValues.length === 0) {
          setError("Pick at least one weekday.");
          return;
        }

        recurrence = {
          type: "weekdays",
          weekdays: weekdayValues.map(Number),
        };
      }
    }

    upsertTask(
      {
        title: trimmedTitle,
        category,
        dueDate,
        notes: notes.trim(),
        recurrence,
      },
      existingTask?.id,
    );
    router.back();
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.screen}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          testID="task-editor-screen"
        >
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>Task</Text>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
                {existingTask ? "Edit task" : "New task"}
              </Text>
            </View>

            <Pressable
              accessibilityLabel="Close editor"
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.closeButton,
                { backgroundColor: colors.surface, opacity: pressed ? 0.82 : 1 },
              ]}
              testID="task-editor-close"
            >
              <Feather color={colors.textPrimary} name="x" size={18} />
            </Pressable>
          </View>

          <View style={styles.formBlock}>
            <TextInput
              onChangeText={setTitle}
              placeholder="Task name"
              placeholderTextColor={colors.textTertiary}
              style={[styles.titleInput, { backgroundColor: colors.surface, color: colors.textPrimary }]}
              testID="task-title-input"
              value={title}
            />

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
              <ChoiceChips
                onChange={(value) => setCategory(value as TaskDraft["category"])}
                options={CATEGORY_OPTIONS.map((item) => ({
                  color: colors.categoryColors[item.toLowerCase() as keyof typeof colors.categoryColors],
                  label: item,
                  value: item,
                }))}
                testIDPrefix="editor-category"
                value={category}
              />
            </View>

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Due date</Text>
              <TextInput
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textTertiary}
                style={[styles.standardInput, { backgroundColor: colors.surface, color: colors.textPrimary }]}
                testID="task-due-date-input"
                value={dueDate}
              />
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>{formatDateLong(dueDate)}</Text>
            </View>

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Repeat</Text>
              <ChoiceChips
                onChange={(value) => setRecurrenceMode(value as EditorRecurrenceMode)}
                options={[
                  { label: "One-time", value: "none" },
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Custom", value: "custom" },
                ]}
                testIDPrefix="editor-repeat"
                value={recurrenceMode}
              />
            </View>

            {recurrenceMode === "custom" ? (
              <View style={[styles.customCard, { backgroundColor: colors.surface }]}> 
                <ChoiceChips
                  onChange={(value) => setCustomMode(value as CustomRecurrenceMode)}
                  options={[
                    { label: "Every X days", value: "interval" },
                    { label: "Weekdays", value: "weekdays" },
                  ]}
                  testIDPrefix="editor-custom-mode"
                  value={customMode}
                />

                {customMode === "interval" ? (
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={setIntervalDays}
                    placeholder="Every X days"
                    placeholderTextColor={colors.textTertiary}
                    style={[styles.standardInput, { backgroundColor: colors.surfaceMuted, color: colors.textPrimary }]}
                    testID="task-interval-input"
                    value={intervalDays}
                  />
                ) : (
                  <ChoiceChips
                    onToggleValue={toggleWeekday}
                    options={WEEKDAY_OPTIONS.map((item) => ({ label: item.label, value: String(item.value) }))}
                    testIDPrefix="editor-weekday"
                    values={weekdayValues}
                  />
                )}
              </View>
            ) : null}

            <View style={styles.fieldWrap}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Notes</Text>
              <TextInput
                multiline
                onChangeText={setNotes}
                placeholder="Add a note"
                placeholderTextColor={colors.textTertiary}
                style={[
                  styles.notesInput,
                  { backgroundColor: colors.surface, color: colors.textPrimary },
                ]}
                testID="task-notes-input"
                textAlignVertical="top"
                value={notes}
              />
            </View>

            {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

            <Pressable
              accessibilityLabel="Save task"
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { backgroundColor: colors.accentPrimary, opacity: pressed ? 0.82 : 1 },
              ]}
              testID="task-save-button"
            >
              <Text style={[styles.saveButtonText, { color: colors.accentText }]}>Save task</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    marginBottom: 28,
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
  closeButton: {
    alignItems: "center",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  formBlock: {
    gap: 20,
  },
  titleInput: {
    borderRadius: 24,
    fontSize: 26,
    fontWeight: "700",
    minHeight: 70,
    paddingHorizontal: 20,
  },
  fieldWrap: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  standardInput: {
    borderRadius: 18,
    fontSize: 16,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  notesInput: {
    borderRadius: 20,
    fontSize: 16,
    minHeight: 140,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  helperText: {
    fontSize: 13,
  },
  customCard: {
    borderRadius: 24,
    gap: 16,
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    alignItems: "center",
    borderRadius: 18,
    justifyContent: "center",
    minHeight: 58,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});