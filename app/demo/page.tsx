"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, Circle, Clock, Info, Kanban } from "lucide-react"

// Sample demo tasks
const demoTasks = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft the initial project proposal with timeline and budget estimates",
    status: "completed",
    priority: "high",
    category: "work",
    dueDate: "2023-06-15",
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Set up weekly team sync to discuss project progress and blockers",
    status: "in-progress",
    priority: "medium",
    category: "work",
    dueDate: "2023-06-18",
  },
  {
    id: "3",
    title: "Research competitors",
    description: "Analyze top 5 competitors and create a comparison report",
    status: "todo",
    priority: "medium",
    category: "work",
    dueDate: "2023-06-20",
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Review and update project documentation with latest changes",
    status: "todo",
    priority: "low",
    category: "education",
    dueDate: "2023-06-25",
  },
  {
    id: "5",
    title: "Client presentation",
    description: "Prepare slides for the upcoming client presentation",
    status: "in-progress",
    priority: "high",
    category: "work",
    dueDate: "2023-06-22",
  },
  {
    id: "6",
    title: "Gym session",
    description: "30 minute cardio and strength training",
    status: "todo",
    priority: "medium",
    category: "health",
    dueDate: "2023-06-19",
  },
  {
    id: "7",
    title: "Pay bills",
    description: "Pay monthly utilities and credit card bills",
    status: "todo",
    priority: "high",
    category: "finance",
    dueDate: "2023-06-28",
  },
  {
    id: "8",
    title: "Birthday gift shopping",
    description: "Buy a gift for mom's birthday next month",
    status: "todo",
    priority: "medium",
    category: "personal",
    dueDate: "2023-06-30",
  },
]

export default function DemoPage() {
  const [activeView, setActiveView] = useState("list")

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-5 w-5 text-muted-foreground" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Circle className="h-5 w-5" />
    }
  }

  // Get priority class
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-500/15 text-green-700 dark:text-green-400"
      case "medium":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      case "high":
        return "bg-red-500/15 text-red-700 dark:text-red-400"
      default:
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400"
    }
  }

  // Get category class
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      case "personal":
        return "bg-green-500/15 text-green-700 dark:text-green-400"
      case "education":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400"
      case "health":
        return "bg-red-500/15 text-red-700 dark:text-red-400"
      case "finance":
        return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400"
      default:
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Kanban className="h-5 w-5" />
            <Link href="/" className="font-bold">
              TaskMaster Pro
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">TaskMaster Pro Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This is a demo of the TaskMaster Pro application. Create an account to start managing your own tasks.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6 flex items-center">
          <Info className="h-5 w-5 mr-2 text-primary" />
          <p className="text-sm">This is a read-only demo. Sign up to create and manage your own tasks.</p>
        </div>

        <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="board">Board View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-2">
              {demoTasks.map((task) => (
                <Card key={task.id} className={task.status === "completed" ? "opacity-70" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}
                          >
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["todo", "in-progress", "completed"].map((status) => {
                const statusTasks = demoTasks.filter((task) => task.status === status)
                const statusTitle = status === "todo" ? "To Do" : status === "in-progress" ? "In Progress" : "Completed"

                return (
                  <div key={status} className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{statusTitle}</h3>
                      <span className="text-sm text-muted-foreground">{statusTasks.length}</span>
                    </div>
                    <div className="flex-1 bg-muted/40 rounded-lg p-2 min-h-[400px]">
                      {statusTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-lg text-muted-foreground">
                          <p className="text-sm">No tasks</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {statusTasks.map((task) => (
                            <Card key={task.id}>
                              <CardHeader className="p-3 pb-0">
                                <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                {task.description && (
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                                )}
                                <div className="flex flex-wrap gap-1">
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(task.priority)}`}
                                  >
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(task.category)}`}
                                  >
                                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href="/register">
            <Button size="lg">Create Your Account</Button>
          </Link>
        </div>
      </main>

      <footer className="w-full border-t py-4">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} TaskMaster Pro. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
