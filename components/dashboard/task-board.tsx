"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/types"
import { Calendar, Edit, MoreHorizontal, Trash } from "lucide-react"

interface TaskBoardProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskBoard({ tasks, onUpdateTask, onDeleteTask }: TaskBoardProps) {
  const [draggingTask, setDraggingTask] = useState<string | null>(null)

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "completed", title: "Completed" },
  ]

  const handleDragStart = (taskId: string) => {
    setDraggingTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    if (draggingTask) {
      onUpdateTask(draggingTask, { status: columnId as "todo" | "in-progress" | "completed" })
      setDraggingTask(null)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/15 text-red-700 dark:text-red-400"
      case "medium":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      case "low":
        return "bg-green-500/15 text-green-700 dark:text-green-400"
      default:
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400"
    }
  }

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Task Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)

          return (
            <div
              key={column.id}
              className="flex flex-col h-full"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{column.title}</h3>
                <span className="text-sm text-muted-foreground">{columnTasks.length}</span>
              </div>
              <div className="flex-1 bg-muted/40 rounded-lg p-2 min-h-[500px]">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-24 border border-dashed rounded-lg text-muted-foreground">
                    <p className="text-sm">No tasks</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {columnTasks.map((task) => (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <CardHeader className="p-3 pb-0">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {}}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onDeleteTask(task.id)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
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
                        <CardFooter className="p-3 pt-0">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
