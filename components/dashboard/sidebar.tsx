"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { SettingsService } from "@/lib/settings-service"
import type { TaskView, UserSettings } from "@/types"
import { BarChart3, Calendar, Home, LayoutDashboard, ListTodo, Settings, Tag } from "lucide-react"

interface DashboardSidebarProps {
  activeView: TaskView
  onViewChange: (view: TaskView) => void
  activeCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export function DashboardSidebar({
  activeView,
  onViewChange,
  activeCategory,
  onCategoryChange,
}: DashboardSidebarProps) {
  const { user } = useAuth()
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    if (!user) return
    try {
      const settings = await SettingsService.getSettings(user.id)
      setUserSettings(settings)
      setIsCollapsed(settings.sidebarCollapsed)
    } catch (error) {
      console.error("Failed to load user settings:", error)
    }
  }

  const categories = [
    { id: "work", name: "Work", color: "bg-blue-500" },
    { id: "personal", name: "Personal", color: "bg-green-500" },
    { id: "education", name: "Education", color: "bg-purple-500" },
    { id: "health", name: "Health", color: "bg-red-500" },
    { id: "finance", name: "Finance", color: "bg-yellow-500" },
    { id: "other", name: "Other", color: "bg-gray-500" },
  ]

  const tags = [
    { id: "urgent", name: "Urgent", color: "bg-red-500" },
    { id: "important", name: "Important", color: "bg-orange-500" },
    { id: "later", name: "Later", color: "bg-blue-500" },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
    if (user && userSettings) {
      const updatedSettings = {
        ...userSettings,
        sidebarCollapsed: !isCollapsed,
      }
      SettingsService.saveSettings(user.id, updatedSettings)
    }
  }

  return (
    <aside
      className={`hidden border-r bg-muted/40 transition-all duration-300 md:block ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end p-2">
          <Button variant="ghost" size="sm" className="h-8 w-8" onClick={toggleSidebar}>
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            )}
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <div className="px-3 py-2">
            {!isCollapsed && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>}
            <div className="space-y-1">
              <Button
                variant={activeView === "list" ? "secondary" : "ghost"}
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                onClick={() => onViewChange("list")}
                title={isCollapsed ? "List View" : undefined}
              >
                <ListTodo className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && "List View"}
              </Button>
              <Button
                variant={activeView === "board" ? "secondary" : "ghost"}
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                onClick={() => onViewChange("board")}
                title={isCollapsed ? "Board View" : undefined}
              >
                <LayoutDashboard className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && "Board View"}
              </Button>
              <Button
                variant={activeView === "calendar" ? "secondary" : "ghost"}
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                onClick={() => onViewChange("calendar")}
                title={isCollapsed ? "Calendar View" : undefined}
              >
                <Calendar className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && "Calendar View"}
              </Button>
              <Button
                variant={activeView === "stats" ? "secondary" : "ghost"}
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                onClick={() => onViewChange("stats")}
                title={isCollapsed ? "Statistics" : undefined}
              >
                <BarChart3 className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && "Statistics"}
              </Button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="px-3 py-2">
            {!isCollapsed && <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Categories</h2>}
            <div className="space-y-1">
              <Button
                variant={activeCategory === null ? "secondary" : "ghost"}
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                onClick={() => onCategoryChange(null)}
                title={isCollapsed ? "All Tasks" : undefined}
              >
                <Home className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                {!isCollapsed && "All Tasks"}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "secondary" : "ghost"}
                  size="sm"
                  className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                  onClick={() => onCategoryChange(category.id)}
                  title={isCollapsed ? category.name : undefined}
                >
                  <div className={`${isCollapsed ? "" : "mr-2"} h-3 w-3 rounded-full ${category.color}`} />
                  {!isCollapsed && category.name}
                </Button>
              ))}
            </div>
          </div>
          {!isCollapsed && (
            <>
              <Separator className="my-4" />
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tags</h2>
                <div className="space-y-1">
                  {tags.map((tag) => (
                    <Button key={tag.id} variant="ghost" size="sm" className="w-full justify-start">
                      <Tag className="mr-2 h-4 w-4" />
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
          <Separator className="my-4" />
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`${isCollapsed ? "justify-center w-10 px-0 mx-auto" : "w-full justify-start"}`}
                asChild
                title={isCollapsed ? "Settings" : undefined}
              >
                <Link href="/settings">
                  <Settings className={`${isCollapsed ? "" : "mr-2"} h-4 w-4`} />
                  {!isCollapsed && "Settings"}
                </Link>
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  )
}
