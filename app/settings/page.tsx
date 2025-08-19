"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { DashboardHeader } from "@/components/dashboard/header"
import { TaskService } from "@/lib/task-service"
import { SettingsService } from "@/lib/settings-service"
import { Loader2 } from "lucide-react"
import type { UserSettings } from "@/types"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const router = useRouter()

  const [settings, setSettings] = useState<UserSettings>({
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
  })

  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean | "unknown">("unknown")

  // Load user settings
  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  // Check notification permission
  useEffect(() => {
    if (typeof Notification !== "undefined") {
      if (Notification.permission === "granted") {
        setHasNotificationPermission(true)
      } else if (Notification.permission === "denied") {
        setHasNotificationPermission(false)
      } else {
        setHasNotificationPermission("unknown")
      }
    }
  }, [])

  const loadSettings = async () => {
    if (!user) return

    try {
      const userSettings = await SettingsService.getSettings(user.id)
      if (userSettings) {
        setSettings(userSettings)
        // Apply theme from settings
        setTheme(userSettings.theme)
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoaded(true)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      await SettingsService.saveSettings(user.id, settings)
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      })

      // Apply theme change immediately
      setTheme(settings.theme)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    if (!user) return

    try {
      const tasksJson = await TaskService.exportTasks(user.id)

      // Create download link
      const blob = new Blob([tasksJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `taskmaster-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Data exported",
        description: "Your tasks have been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      })
    }
  }

  const requestNotificationPermission = async () => {
    if (typeof Notification !== "undefined") {
      try {
        const permission = await Notification.requestPermission()
        setHasNotificationPermission(permission === "granted")

        if (permission === "granted") {
          setSettings((prev) => ({
            ...prev,
            notifications: {
              ...prev.notifications,
              browserNotifications: true,
            },
          }))

          toast({
            title: "Notifications enabled",
            description: "You will now receive browser notifications for task reminders.",
          })
        } else {
          toast({
            title: "Notification permission denied",
            description: "You won't receive browser notifications. You can change this in your browser settings.",
          })
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error)
        toast({
          title: "Error",
          description: "Failed to request notification permission.",
          variant: "destructive",
        })
      }
    }
  }

  const clearAllData = async () => {
    if (!user || !window.confirm("Are you sure you want to delete all your tasks? This action cannot be undone.")) {
      return
    }

    try {
      await TaskService.clearAllTasks(user.id)
      toast({
        title: "Data cleared",
        description: "All your tasks have been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader onSearch={() => {}} onCreateTask={() => {}} />

      <main className="flex-1 container py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your TaskMaster Pro experience.</p>
          </div>

          <Separator />

          <Tabs defaultValue="appearance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={settings.theme}
                      onValueChange={(value) => setSettings({ ...settings, theme: value })}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sidebar-collapsed">Sidebar Collapsed by Default</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sidebar-collapsed"
                        checked={settings.sidebarCollapsed}
                        onCheckedChange={(checked) => setSettings({ ...settings, sidebarCollapsed: checked })}
                      />
                      <Label htmlFor="sidebar-collapsed">{settings.sidebarCollapsed ? "Enabled" : "Disabled"}</Label>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications-enabled"
                        checked={settings.notifications.enabled}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, enabled: checked },
                          })
                        }
                      />
                      <Label htmlFor="notifications-enabled">
                        {settings.notifications.enabled ? "Enabled" : "Disabled"}
                      </Label>
                    </div>
                  </div>

                  {settings.notifications.enabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="due-date-reminders">Due Date Reminders</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="due-date-reminders"
                            checked={settings.notifications.dueDateReminders}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                notifications: { ...settings.notifications, dueDateReminders: checked },
                              })
                            }
                          />
                          <Label htmlFor="due-date-reminders">
                            {settings.notifications.dueDateReminders ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reminder-time">Reminder Time</Label>
                        <Select
                          value={settings.notifications.reminderTime}
                          onValueChange={(value) =>
                            setSettings({
                              ...settings,
                              notifications: { ...settings.notifications, reminderTime: value },
                            })
                          }
                        >
                          <SelectTrigger id="reminder-time">
                            <SelectValue placeholder="Select when to be reminded" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30min">30 minutes before</SelectItem>
                            <SelectItem value="1hour">1 hour before</SelectItem>
                            <SelectItem value="3hours">3 hours before</SelectItem>
                            <SelectItem value="1day">1 day before</SelectItem>
                            <SelectItem value="2days">2 days before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="browser-notifications"
                            checked={settings.notifications.browserNotifications}
                            disabled={hasNotificationPermission === false}
                            onCheckedChange={(checked) => {
                              if (checked && hasNotificationPermission !== true) {
                                requestNotificationPermission()
                              } else {
                                setSettings({
                                  ...settings,
                                  notifications: { ...settings.notifications, browserNotifications: checked },
                                })
                              }
                            }}
                          />
                          <Label htmlFor="browser-notifications">
                            {settings.notifications.browserNotifications ? "Enabled" : "Disabled"}
                          </Label>
                        </div>
                        {hasNotificationPermission === false && (
                          <p className="text-sm text-destructive">
                            Notification permission denied. Please enable notifications in your browser settings.
                          </p>
                        )}
                        {hasNotificationPermission !== true && settings.notifications.browserNotifications && (
                          <Button variant="outline" size="sm" onClick={requestNotificationPermission} className="mt-2">
                            Request Permission
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Display Preferences</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-view">Default View</Label>
                    <Select
                      value={settings.defaultView}
                      onValueChange={(value) => setSettings({ ...settings, defaultView: value })}
                    >
                      <SelectTrigger id="default-view">
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="list">List View</SelectItem>
                        <SelectItem value="board">Board View</SelectItem>
                        <SelectItem value="calendar">Calendar View</SelectItem>
                        <SelectItem value="stats">Statistics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-density">Task Density</Label>
                    <Select
                      value={settings.display.taskDensity}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          display: { ...settings.display, taskDensity: value },
                        })
                      }
                    >
                      <SelectTrigger id="task-density">
                        <SelectValue placeholder="Select task density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="show-completed">Show Completed Tasks</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-completed"
                        checked={settings.display.showCompletedTasks}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            display: { ...settings.display, showCompletedTasks: checked },
                          })
                        }
                      />
                      <Label htmlFor="show-completed">
                        {settings.display.showCompletedTasks ? "Visible" : "Hidden"}
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-sorting">Default Sorting</Label>
                    <Select
                      value={settings.display.defaultSorting}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          display: { ...settings.display, defaultSorting: value },
                        })
                      }
                    >
                      <SelectTrigger id="default-sorting">
                        <SelectValue placeholder="Select default sorting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dueDate">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="createdAt">Creation Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort-direction">Sort Direction</Label>
                    <Select
                      value={settings.display.defaultSortDirection}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          display: { ...settings.display, defaultSortDirection: value },
                        })
                      }
                    >
                      <SelectTrigger id="sort-direction">
                        <SelectValue placeholder="Select sort direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Data Management</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auto-backup">Automatic Backup</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-backup"
                        checked={settings.data.autoBackup}
                        onCheckedChange={(checked) =>
                          setSettings({
                            ...settings,
                            data: { ...settings.data, autoBackup: checked },
                          })
                        }
                      />
                      <Label htmlFor="auto-backup">{settings.data.autoBackup ? "Enabled" : "Disabled"}</Label>
                    </div>
                  </div>

                  {settings.data.autoBackup && (
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select
                        value={settings.data.backupFrequency}
                        onValueChange={(value) =>
                          setSettings({
                            ...settings,
                            data: { ...settings.data, backupFrequency: value },
                          })
                        }
                      >
                        <SelectTrigger id="backup-frequency">
                          <SelectValue placeholder="Select backup frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Data Retention</Label>
                    <Select
                      value={settings.data.dataRetention}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          data: { ...settings.data, dataRetention: value },
                        })
                      }
                    >
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select data retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">30 Days</SelectItem>
                        <SelectItem value="90days">90 Days</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed tasks older than this period will be automatically removed.
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Manual Data Management</h3>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <Button variant="outline" onClick={handleExportData}>
                        Export Tasks
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/profile?tab=data")}>
                        Import Tasks
                      </Button>
                      <Button variant="destructive" onClick={clearAllData}>
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
