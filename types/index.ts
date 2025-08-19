export type TaskStatus = "todo" | "in-progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"
export type TaskCategory = "work" | "personal" | "education" | "health" | "finance" | "other"
export type TaskView = "list" | "board" | "calendar" | "stats"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  category: TaskCategory
  dueDate: string
  createdAt: string
  userId: string
  tags: string[]
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  defaultView: TaskView
  sidebarCollapsed: boolean
  notifications: {
    enabled: boolean
    dueDateReminders: boolean
    reminderTime: "30min" | "1hour" | "3hours" | "1day" | "2days"
    browserNotifications: boolean
  }
  display: {
    taskDensity: "compact" | "comfortable"
    showCompletedTasks: boolean
    defaultSorting: "dueDate" | "priority" | "title" | "createdAt"
    defaultSortDirection: "asc" | "desc"
  }
  data: {
    autoBackup: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
    dataRetention: "30days" | "90days" | "1year" | "forever"
  }
}
