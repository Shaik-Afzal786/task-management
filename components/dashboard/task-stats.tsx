"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Task } from "@/types"
import { CheckCircle, Clock, ListTodo, Kanban } from "lucide-react"

interface TaskStatsProps {
  tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length
  const todoTasks = tasks.filter((task) => task.status === "todo").length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Tasks by category
  const categories = ["work", "personal", "education", "health", "finance", "other"]
  const tasksByCategory = categories
    .map((category) => ({
      name: category,
      count: tasks.filter((task) => task.category === category).length,
    }))
    .sort((a, b) => b.count - a.count)

  // Tasks by priority
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length
  const mediumPriorityTasks = tasks.filter((task) => task.priority === "medium").length
  const lowPriorityTasks = tasks.filter((task) => task.priority === "low").length

  // Overdue tasks
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return task.status !== "completed" && dueDate < today
  }).length

  // Tasks due today
  const tasksDueToday = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    return task.status !== "completed" && dueDate.getTime() === today.getTime()
  }).length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Task Statistics</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Kanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}% of all tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% of all tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">High Priority</span>
                  </div>
                  <span className="text-sm font-medium">{highPriorityTasks}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Medium Priority</span>
                  </div>
                  <span className="text-sm font-medium">{mediumPriorityTasks}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${totalTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Low Priority</span>
                  </div>
                  <span className="text-sm font-medium">{lowPriorityTasks}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Distribution of tasks by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasksByCategory.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category.name}</span>
                    <span className="text-sm font-medium">{category.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${
                        category.name === "work"
                          ? "bg-blue-500"
                          : category.name === "personal"
                            ? "bg-green-500"
                            : category.name === "education"
                              ? "bg-purple-500"
                              : category.name === "health"
                                ? "bg-red-500"
                                : category.name === "finance"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                      }`}
                      style={{ width: `${totalTasks > 0 ? (category.count / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">Tasks that are past their due date</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{tasksDueToday}</div>
            <p className="text-xs text-muted-foreground">Tasks that are due today</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
