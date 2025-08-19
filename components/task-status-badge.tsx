import { CheckCircle, Circle, Clock } from "lucide-react"

type TaskStatusBadgeProps = {
  status: "todo" | "in-progress" | "completed"
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const getStatusDetails = () => {
    switch (status) {
      case "todo":
        return {
          icon: <Circle className="h-4 w-4" />,
          label: "To Do",
          className: "bg-muted text-muted-foreground",
        }
      case "in-progress":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "In Progress",
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        }
      case "completed":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Completed",
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        }
      default:
        return {
          icon: <Circle className="h-4 w-4" />,
          label: "Unknown",
          className: "bg-muted text-muted-foreground",
        }
    }
  }

  const { icon, label, className } = getStatusDetails()

  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {icon}
      <span className="ml-1">{label}</span>
    </div>
  )
}
