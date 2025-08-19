"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Task } from "@/types"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TaskCalendarProps {
  tasks: Task[]
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskCalendar({ tasks, onUpdateTask, onDeleteTask }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getPreviousMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() - 1)
    setCurrentDate(date)
  }

  const getNextMonth = () => {
    const date = new Date(currentDate)
    date.setMonth(date.getMonth() + 1)
    setCurrentDate(date)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthName = currentDate.toLocaleString("default", { month: "long" })

  const days = []
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getTasksForDay = (day: number) => {
    if (!day) return []

    const date = new Date(year, month, day)
    const dateString = date.toISOString().split("T")[0]

    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toISOString().split("T")[0] === dateString
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-blue-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendar</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={getPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {monthName} {year}
          </div>
          <Button variant="outline" size="icon" onClick={getNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const dayTasks = day ? getTasksForDay(day) : []

          return (
            <Card
              key={index}
              className={`min-h-[100px] p-2 ${!day ? "bg-muted/40 border-dashed" : ""} ${isToday(day as number) ? "border-primary" : ""}`}
            >
              {day && (
                <>
                  <div className={`text-right ${isToday(day) ? "font-bold text-primary" : ""}`}>{day}</div>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="text-xs p-1 rounded truncate flex items-center gap-1 bg-muted/60"
                        title={task.title}
                      >
                        <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
