import type { UserSettings } from "@/types"

// Default settings
const defaultSettings: UserSettings = {
  theme: "system",
  defaultView: "list",
  sidebarCollapsed: false,
  notifications: {
    enabled: true,
    dueDateReminders: true,
    reminderTime: "1day",
    browserNotifications: false,
  },
  display: {
    taskDensity: "comfortable",
    showCompletedTasks: true,
    defaultSorting: "dueDate",
    defaultSortDirection: "asc",
  },
  data: {
    autoBackup: false,
    backupFrequency: "weekly",
    dataRetention: "forever",
  },
}

export const SettingsService = {
  // Get user settings
  getSettings: async (userId: string): Promise<UserSettings> => {
    return new Promise((resolve) => {
      // Simulate API call delay
      setTimeout(() => {
        const settingsKey = `user_settings_${userId}`
        const storedSettings = localStorage.getItem(settingsKey)

        if (storedSettings) {
          resolve(JSON.parse(storedSettings))
        } else {
          // If no settings found, return defaults
          resolve(defaultSettings)
        }
      }, 300)
    })
  },

  // Save user settings
  saveSettings: async (userId: string, settings: UserSettings): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const settingsKey = `user_settings_${userId}`
        localStorage.setItem(settingsKey, JSON.stringify(settings))
        resolve()
      }, 300)
    })
  },

  // Reset settings to default
  resetSettings: async (userId: string): Promise<UserSettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const settingsKey = `user_settings_${userId}`
        localStorage.setItem(settingsKey, JSON.stringify(defaultSettings))
        resolve(defaultSettings)
      }, 300)
    })
  },

  // Apply settings throughout the application
  applySettings: (settings: UserSettings): void => {
    // Apply theme
    const root = document.documentElement
    root.classList.remove("light", "dark")

    if (settings.theme !== "system") {
      root.classList.add(settings.theme)
    } else {
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
      } else {
        root.classList.add("light")
      }
    }

    // Apply other settings as needed
    // This would typically be handled by context providers
  },
}
