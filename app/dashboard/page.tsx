"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { TaskList } from "@/components/dashboard/task-list"
import { TaskBoard } from "@/components/dashboard/task-board"
import { TaskCalendar } from "@/components/dashboard/task-calendar"
import { TaskStats } from "@/components/dashboard/task-stats"
import { TaskService } from "@/lib/task-service"
import { SettingsService } from "@/lib/settings-service"
import type { Task, TaskView, UserSettings } from "@/types"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<TaskView>("list")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    if (user) {
      loadSettings()
      loadTasks()
    }
  }, [user])

  useEffect(() => {
    filterTasks()
  }, [tasks, activeCategory, searchQuery, userSettings])

  const loadSettings = async () => {
    if (!user) return
    try {
      const settings = await SettingsService.getSettings(user.id)
      setUserSettings(settings)
      setActiveView(settings.defaultView)
    } catch (error) {
      console.error("Failed to load settings:", error)
    }
  }

  const loadTasks = async () => {
    setIsLoading(true)
    try {
      const userTasks = await TaskService.getTasks(user?.id || "")
      setTasks(userTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTasks = () => {
    if (!tasks.length) return

    let filtered = [...tasks]

    // Apply settings for completed tasks
    if (userSettings && !userSettings.display.showCompletedTasks) {
      filtered = filtered.filter((task) => task.status !== "completed")
    }

    // Filter by category
    if (activeCategory) {
      filtered = filtered.filter((task) => task.category === activeCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Apply sorting based on settings
    if (userSettings) {
      const { defaultSorting, defaultSortDirection } = userSettings.display
      filtered.sort((a, b) => {
        let comparison = 0

        switch (defaultSorting) {
          case "dueDate":
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            break
          case "priority": {
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            comparison =
              priorityOrder[a.priority as keyof typeof priorityOrder] -
              priorityOrder[b.priority as keyof typeof priorityOrder]
            break
          }
          case "title":
            comparison = a.title.localeCompare(b.title)
            break
          case "createdAt":
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          default:
            comparison = 0
        }

        return defaultSortDirection === "asc" ? comparison : -comparison
      })
    }

    setFilteredTasks(filtered)
  }

  const handleTaskCreate = async (task: Omit<Task, "id" | "createdAt" | "userId">) => {
    if (!user) return

    try {
      const newTask = await TaskService.createTask({
        ...task,
        userId: user.id,
      })

      setTasks((prev) => [...prev, newTask])

      // Show notification if enabled
      if (userSettings?.notifications.enabled && userSettings.notifications.browserNotifications) {
        showTaskNotification("Task Created", `New task created: ${newTask.title}`)
      }
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await TaskService.updateTask(taskId, updates)
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))

      // Show notification for status change if enabled
      if (
        updates.status === "completed" &&
        userSettings?.notifications.enabled &&
        userSettings.notifications.browserNotifications
      ) {
        showTaskNotification("Task Completed", `Task completed: ${updatedTask.title}`)
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleViewChange = (view: TaskView) => {
    setActiveView(view)
  }

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const showTaskNotification = (title: string, body: string) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <DashboardHeader onSearch={handleSearch} onCreateTask={handleTaskCreate} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        <main className="flex-1 overflow-auto p-4">
          {activeView === "stats" ? (
            <TaskStats tasks={tasks} />
          ) : activeView === "board" ? (
            <TaskBoard
              tasks={filteredTasks}
              onUpdateTask={handleTaskUpdate}
              onDeleteTask={handleTaskDelete}
              density={userSettings?.display.taskDensity || "comfortable"}
            />
          ) : activeView === "calendar" ? (
            <TaskCalendar tasks={filteredTasks} onUpdateTask={handleTaskUpdate} onDeleteTask={handleTaskDelete} />
          ) : (
            <TaskList
              tasks={filteredTasks}
              onUpdateTask={handleTaskUpdate}
              onDeleteTask={handleTaskDelete}
              density={userSettings?.display.taskDensity || "comfortable"}
            />
          )}
        </main>
      </div>
    </div>
  )
}
