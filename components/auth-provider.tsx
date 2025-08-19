"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Protected routes logic
    if (!isLoading) {
      const protectedRoutes = ["/dashboard", "/profile", "/tasks"]
      const authRoutes = ["/login", "/register"]

      if (protectedRoutes.some((route) => pathname?.startsWith(route)) && !user) {
        router.push("/login")
      } else if (authRoutes.includes(pathname as string) && user) {
        router.push("/dashboard")
      }
    }
  }, [pathname, user, isLoading, router])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find user with matching email
      const user = users.find((u: any) => u.email === email)

      if (user && (await verifyPassword(password, user.password))) {
        // Set current user (excluding password)
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
        }
        localStorage.setItem("currentUser", JSON.stringify(userData))
        setUser(userData)

        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        })

        return true
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if email already exists
      if (users.some((user: any) => user.email === email)) {
        toast({
          title: "Registration failed",
          description: "Email already in use.",
          variant: "destructive",
        })
        return false
      }

      // Hash password
      const hashedPassword = await hashPassword(password)

      // Add new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Set current user (excluding password)
      const userData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
      localStorage.setItem("currentUser", JSON.stringify(userData))
      setUser(userData)

      // Initialize empty tasks array for user
      const tasks = JSON.parse(localStorage.getItem("tasks") || "{}")
      tasks[newUser.id] = []
      localStorage.setItem("tasks", JSON.stringify(tasks))

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
