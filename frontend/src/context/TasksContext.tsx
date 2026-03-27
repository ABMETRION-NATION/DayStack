import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { STORAGE_KEYS, Task, TaskDraft } from "../lib/taskTypes";
import { toDateKey } from "../lib/taskUtils";

type TasksContextValue = {
  completions: Record<string, string>;
  deleteTask: (taskId: string) => void;
  quickAddTask: (title: string, category: Task["category"]) => void;
  ready: boolean;
  tasks: Task[];
  toggleTaskCompletion: (taskId: string, dateKey: string) => void;
  updateTask: (taskId: string, draft: TaskDraft) => void;
  upsertTask: (draft: TaskDraft, taskId?: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

const sortTasks = (tasks: Task[]) => {
  return [...tasks].sort((left, right) => {
    if (left.dueDate !== right.dueDate) {
      return left.dueDate.localeCompare(right.dueDate);
    }

    return left.createdAt.localeCompare(right.createdAt);
  });
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [savedTasks, savedCompletions] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.tasks),
        AsyncStorage.getItem(STORAGE_KEYS.completions),
      ]);

      if (savedTasks) {
        setTasks(sortTasks(JSON.parse(savedTasks) as Task[]));
      }

      if (savedCompletions) {
        setCompletions(JSON.parse(savedCompletions) as Record<string, string>);
      }

      setReady(true);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks)),
      AsyncStorage.setItem(STORAGE_KEYS.completions, JSON.stringify(completions)),
    ]);
  }, [completions, ready, tasks]);

  const upsertTask = (draft: TaskDraft, taskId?: string) => {
    if (taskId) {
      setTasks((currentTasks) =>
        sortTasks(
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, ...draft } : task,
          ),
        ),
      );
      return;
    }

    const createdTask: Task = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...draft,
    };

    setTasks((currentTasks) => sortTasks([...currentTasks, createdTask]));
  };

  const updateTask = (taskId: string, draft: TaskDraft) => upsertTask(draft, taskId);

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    setCompletions((currentCompletions) => {
      const nextCompletions = { ...currentCompletions };

      Object.keys(nextCompletions).forEach((key) => {
        if (key.startsWith(`${taskId}__`)) {
          delete nextCompletions[key];
        }
      });

      return nextCompletions;
    });
  };

  const toggleTaskCompletion = (taskId: string, dateKey: string) => {
    const key = `${taskId}__${dateKey}`;

    setCompletions((currentCompletions) => {
      const nextCompletions = { ...currentCompletions };

      if (nextCompletions[key]) {
        delete nextCompletions[key];
      } else {
        nextCompletions[key] = new Date().toISOString();
      }

      return nextCompletions;
    });
  };

  const quickAddTask = (title: string, category: Task["category"]) => {
    upsertTask({
      title: title.trim(),
      category,
      dueDate: toDateKey(new Date()),
      notes: "",
      recurrence: { type: "none" },
    });
  };

  const value = {
    completions,
    deleteTask,
    quickAddTask,
    ready,
    tasks,
    toggleTaskCompletion,
    updateTask,
    upsertTask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export const useTasks = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks must be used inside TasksProvider");
  }

  return context;
};