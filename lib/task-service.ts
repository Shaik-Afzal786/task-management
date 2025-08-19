import type { Task } from "@/types"

export const TaskService = {
  // Get all tasks for a user
  getTasks: async (userId: string): Promise<Task[]> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[userId] || []
        resolve(userTasks)
      }, 300)
    })
  },

  // Create a new task
  createTask: async (taskData: Omit<Task, "id" | "createdAt">): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[taskData.userId] || []

        const newTask: Task = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...taskData,
        }

        userTasks.push(newTask)
        tasks[taskData.userId] = userTasks
        localStorage.setItem("tasks", JSON.stringify(tasks))

        resolve(newTask)
      }, 300)
    })
  },

  // Update an existing task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[updates.userId] || []

        const taskIndex = userTasks.findIndex((task: Task) => task.id === taskId)

        if (taskIndex === -1) {
          reject(new Error("Task not found"))
          return
        }

        const updatedTask = {
          ...userTasks[taskIndex],
          ...updates,
        }

        userTasks[taskIndex] = updatedTask
        tasks[updates.userId] = userTasks
        localStorage.setItem("tasks", JSON.stringify(tasks))

        resolve(updatedTask)
      }, 300)
    })
  },

  // Delete a task
  deleteTask: async (taskId: string, userId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[userId] || []

        const taskIndex = userTasks.findIndex((task: Task) => task.id === taskId)

        if (taskIndex === -1) {
          reject(new Error("Task not found"))
          return
        }

        userTasks.splice(taskIndex, 1)
        tasks[userId] = userTasks
        localStorage.setItem("tasks", JSON.stringify(tasks))

        resolve()
      }, 300)
    })
  },

  // Export tasks to JSON
  exportTasks: async (userId: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[userId] || []
        const exportData = JSON.stringify(userTasks, null, 2)
        resolve(exportData)
      }, 300)
    })
  },

  // Import tasks from JSON
  importTasks: async (userId: string, tasksJson: string): Promise<Task[]> => {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          const importedTasks = JSON.parse(tasksJson)

          if (!Array.isArray(importedTasks)) {
            reject(new Error("Invalid tasks data"))
            return
          }

          const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
          
          // Add imported tasks with the correct userId
          const tasksWithUserId = importedTasks.map((task: Omit<Task, "userId">) => ({
            ...task,
            userId,
          }))

          // Save tasks
          tasks[userId] = tasksWithUserId
          localStorage.setItem("tasks", JSON.stringify(tasks))

          resolve(tasksWithUserId)
        }, 300)
      } catch (error) {
        reject(new Error("Failed to parse imported tasks"))
      }
    })
  },

  // Clear all tasks for a user
  clearAllTasks: async (userId: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        tasks[userId] = []
        localStorage.setItem("tasks", JSON.stringify(tasks))
        resolve()
      }, 300)
    })
  },

  // Apply data retention policy
  applyDataRetention: async (userId: string, retentionPeriod: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (retentionPeriod === "forever") {
          resolve()
          return
        }

        const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
        const userTasks = tasks[userId] || []

        // Calculate cutoff date based on retention period
        const now = new Date()
        const cutoffDate = new Date()

        switch (retentionPeriod) {
          case "30days":
            cutoffDate.setDate(now.getDate() - 30)
            break
          case "90days":
            cutoffDate.setDate(now.getDate() - 90)
            break
          case "1year":
            cutoffDate.setFullYear(now.getFullYear() - 1)
            break
          default:
            resolve()
            return
        }

        // Filter out completed tasks older than the cutoff date
        const filteredTasks = userTasks.filter((task: Task) => {
          if (task.status !== "completed") return true
          const taskDate = new Date(task.createdAt)
          return taskDate >= cutoffDate
        })

        tasks[userId] = filteredTasks
        localStorage.setItem("tasks", JSON.stringify(tasks))
        resolve()
      }, 300)
    })
  },
}
