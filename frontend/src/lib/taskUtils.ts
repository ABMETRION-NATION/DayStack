import {
  RecurrenceRule,
  Task,
  TaskOccurrence,
  TaskSummary,
  TaskFilterMode,
} from "./taskTypes";

const DAY_MS = 24 * 60 * 60 * 1000;
const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const fromDateKey = (dateKey: string) => new Date(`${dateKey}T12:00:00`);

export const addDays = (dateKey: string, amount: number) => {
  const nextDate = fromDateKey(dateKey);
  nextDate.setDate(nextDate.getDate() + amount);
  return toDateKey(nextDate);
};

export const isValidDateKey = (value: string) => {
  if (!DATE_KEY_PATTERN.test(value)) {
    return false;
  }

  const parsed = fromDateKey(value);
  return !Number.isNaN(parsed.getTime()) && toDateKey(parsed) === value;
};

export const occurrenceKey = (taskId: string, dateKey: string) => `${taskId}__${dateKey}`;

const diffInDays = (laterDateKey: string, earlierDateKey: string) => {
  return Math.round(
    (fromDateKey(laterDateKey).getTime() - fromDateKey(earlierDateKey).getTime()) / DAY_MS,
  );
};

export const isRecurringTask = (task: Task) => task.recurrence.type !== "none";

export const getRecurrenceLabel = (recurrence: RecurrenceRule) => {
  switch (recurrence.type) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "interval":
      return `Every ${Math.max(1, recurrence.intervalDays ?? 1)} days`;
    case "weekdays":
      return `${(recurrence.weekdays ?? []).length || 0} weekdays`;
    default:
      return "One-time";
  }
};

export const occursOn = (task: Task, dateKey: string) => {
  if (task.recurrence.type === "none") {
    return task.dueDate === dateKey;
  }

  if (dateKey < task.dueDate) {
    return false;
  }

  switch (task.recurrence.type) {
    case "daily":
      return true;
    case "weekly":
      return fromDateKey(task.dueDate).getDay() === fromDateKey(dateKey).getDay();
    case "interval": {
      const interval = Math.max(1, task.recurrence.intervalDays ?? 1);
      return diffInDays(dateKey, task.dueDate) % interval === 0;
    }
    case "weekdays":
      return (task.recurrence.weekdays ?? []).includes(fromDateKey(dateKey).getDay());
    default:
      return false;
  }
};

export const buildOccurrence = (
  task: Task,
  dateKey: string,
  completions: Record<string, string>,
): TaskOccurrence => ({
  key: occurrenceKey(task.id, dateKey),
  taskId: task.id,
  title: task.title,
  category: task.category,
  notes: task.notes,
  dateKey,
  recurrenceLabel: getRecurrenceLabel(task.recurrence),
  isCompleted: Boolean(completions[occurrenceKey(task.id, dateKey)]),
  isRecurring: isRecurringTask(task),
});

export const getTasksForDate = (
  tasks: Task[],
  completions: Record<string, string>,
  dateKey: string,
) => {
  return tasks
    .filter((task) => occursOn(task, dateKey))
    .map((task) => buildOccurrence(task, dateKey, completions))
    .sort((left, right) => {
      if (left.isCompleted !== right.isCompleted) {
        return Number(left.isCompleted) - Number(right.isCompleted);
      }

      return left.title.localeCompare(right.title);
    });
};

export const getUpcomingTasks = (
  tasks: Task[],
  completions: Record<string, string>,
  startDateKey: string,
  limit = 5,
) => {
  const upcoming: TaskOccurrence[] = [];
  let cursor = addDays(startDateKey, 1);

  for (let index = 0; index < 45 && upcoming.length < limit; index += 1) {
    upcoming.push(...getTasksForDate(tasks, completions, cursor));
    cursor = addDays(cursor, 1);
  }

  return upcoming.slice(0, limit);
};

export const getNextOccurrenceDate = (task: Task, referenceDateKey: string) => {
  if (task.recurrence.type === "none") {
    return task.dueDate;
  }

  let cursor = referenceDateKey > task.dueDate ? referenceDateKey : task.dueDate;

  for (let index = 0; index < 90; index += 1) {
    if (occursOn(task, cursor)) {
      return cursor;
    }

    cursor = addDays(cursor, 1);
  }

  return task.dueDate;
};

export const formatDateShort = (dateKey: string) =>
  fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

export const formatDateLong = (dateKey: string) =>
  fromDateKey(dateKey).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const formatDueLabel = (dateKey: string, referenceDateKey: string) => {
  const difference = diffInDays(dateKey, referenceDateKey);

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "Tomorrow";
  }

  if (difference === -1) {
    return "Yesterday";
  }

  return formatDateShort(dateKey);
};

export const getTaskSections = (
  tasks: Task[],
  completions: Record<string, string>,
  categoryFilter: string,
  filterMode: TaskFilterMode,
  referenceDateKey: string,
) => {
  const summaries = tasks
    .filter((task) => categoryFilter === "All" || task.category === categoryFilter)
    .filter((task) => {
      if (filterMode === "recurring") {
        return isRecurringTask(task);
      }

      if (filterMode === "one-time") {
        return !isRecurringTask(task);
      }

      return true;
    })
    .map<TaskSummary>((task) => ({
      task,
      nextDate: getNextOccurrenceDate(task, referenceDateKey),
      completedToday: Boolean(completions[occurrenceKey(task.id, referenceDateKey)]),
      canToggleToday: occursOn(task, referenceDateKey),
    }))
    .sort((left, right) => {
      if (left.nextDate !== right.nextDate) {
        return left.nextDate.localeCompare(right.nextDate);
      }

      return left.task.title.localeCompare(right.task.title);
    });

  const recurring = summaries.filter((item) => isRecurringTask(item.task));
  const oneTime = summaries.filter((item) => !isRecurringTask(item.task));

  return [
    { title: "Recurring", data: recurring },
    { title: "One-time", data: oneTime },
  ].filter((section) => section.data.length > 0);
};

export const getWeeklyBars = (completions: Record<string, string>) => {
  const today = new Date();
  const day = today.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + offset);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    const dateKey = toDateKey(current);
    const count = Object.keys(completions).filter((key) => key.endsWith(`__${dateKey}`)).length;

    return {
      dateKey,
      count,
      label: current.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 3),
    };
  });
};

export const getCompletedThisWeek = (completions: Record<string, string>) =>
  getWeeklyBars(completions).reduce((sum, item) => sum + item.count, 0);

export const getCurrentStreak = (completions: Record<string, string>) => {
  const completedDays = new Set(
    Object.keys(completions).map((key) => key.split("__")[1]).filter(Boolean),
  );

  let streak = 0;
  let cursor = toDateKey(new Date());

  while (completedDays.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
};

export const getTotalCompleted = (completions: Record<string, string>) =>
  Object.keys(completions).length;