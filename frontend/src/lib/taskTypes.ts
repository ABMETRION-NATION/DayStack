export const CATEGORY_OPTIONS = ["Home", "Work", "Health", "Hobby"] as const;

export const WEEKDAY_OPTIONS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
] as const;

export type Category = (typeof CATEGORY_OPTIONS)[number];
export type ThemeMode = "dark" | "light";
export type TaskFilterMode = "all" | "recurring" | "one-time";
export type EditorRecurrenceMode = "none" | "daily" | "weekly" | "custom";
export type CustomRecurrenceMode = "interval" | "weekdays";
export type RecurrenceType = "none" | "daily" | "weekly" | "interval" | "weekdays";

export interface RecurrenceRule {
  type: RecurrenceType;
  intervalDays?: number;
  weekdays?: number[];
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  dueDate: string;
  notes: string;
  recurrence: RecurrenceRule;
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  category: Category;
  dueDate: string;
  notes: string;
  recurrence: RecurrenceRule;
}

export interface TaskOccurrence {
  key: string;
  taskId: string;
  title: string;
  category: Category;
  notes: string;
  dateKey: string;
  recurrenceLabel: string;
  isCompleted: boolean;
  isRecurring: boolean;
}

export interface TaskSummary {
  task: Task;
  nextDate: string;
  completedToday: boolean;
  canToggleToday: boolean;
}

export const STORAGE_KEYS = {
  tasks: "@daystack/tasks/v1",
  completions: "@daystack/completions/v1",
  theme: "@daystack/theme/v1",
  settings: "@daystack/settings/v1",
} as const;