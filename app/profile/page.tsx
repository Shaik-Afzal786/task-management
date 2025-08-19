"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { DashboardHeader } from "@/components/dashboard/header"
import { TaskService } from "@/lib/task-service"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isUpdating, setIsUpdating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async () => {
    if (!user) return

    setIsUpdating(true)
    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find and update current user
      const userIndex = users.findIndex((u: any) => u.id === user.id)

      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        })
        return
      }

      // Check if email is already taken by another user
      if (
        profileData.email !== user.email &&
        users.some((u: any) => u.email === profileData.email && u.id !== user.id)
      ) {
        toast({
          title: "Error",
          description: "Email is already in use.",
          variant: "destructive",
        })
        setIsUpdating(false)
        return
      }

      // Update user data
      users[userIndex] = {
        ...users[userIndex],
        name: profileData.name,
        email: profileData.email,
      }

      // Save updated users
      localStorage.setItem("users", JSON.stringify(users))

      // Update current user in localStorage
      const updatedUser = {
        id: user.id,
        name: profileData.name,
        email: profileData.email,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      // Force reload to update auth context
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!user) return

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      // Get all users
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find current user
      const userIndex = users.findIndex((u: any) => u.id === user.id)

      if (userIndex === -1) {
        toast({
          title: "Error",
          description: "User not found.",
          variant: "destructive",
        })
        return
      }

      // Verify current password
      const isPasswordValid = await verifyPassword(passwordData.currentPassword, users[userIndex].password)

      if (!isPasswordValid) {
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        })
        setIsUpdating(false)
        return
      }

      // Hash new password
      const hashedPassword = await hashPassword(passwordData.newPassword)

      // Update password
      users[userIndex].password = hashedPassword

      // Save updated users
      localStorage.setItem("users", JSON.stringify(users))

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleExportData = async () => {
    if (!user) return

    setIsExporting(true)
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
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0])
    }
  }

  const handleImportData = async () => {
    if (!user || !importFile) return

    setIsImporting(true)
    try {
      const fileReader = new FileReader()

      fileReader.onload = async (e) => {
        try {
          const tasksJson = e.target?.result as string
          await TaskService.importTasks(user.id, tasksJson)

          toast({
            title: "Data imported",
            description: "Your tasks have been imported successfully.",
          })

          // Reset file input
          setImportFile(null)
          const fileInput = document.getElementById("import-file") as HTMLInputElement
          if (fileInput) fileInput.value = ""
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to import data. Invalid file format.",
            variant: "destructive",
          })
        } finally {
          setIsImporting(false)
        }
      }

      fileReader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read file.",
          variant: "destructive",
        })
        setIsImporting(false)
      }

      fileReader.readAsText(importFile)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data.",
        variant: "destructive",
      })
      setIsImporting(false)
    }
  }

  if (isLoading) {
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
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>

          <Separator />

          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="data">Data Management</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handlePasswordUpdate} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Export or import your task data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Export Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Download all your tasks as a JSON file that you can back up or import later.
                    </p>
                    <Button onClick={handleExportData} disabled={isExporting}>
                      {isExporting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
                        </>
                      ) : (
                        "Export Tasks"
                      )}
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Import Data</h3>
                    <p className="text-sm text-muted-foreground">Import tasks from a previously exported JSON file.</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="import-file">Select File</Label>
                        <Input id="import-file" type="file" accept=".json" onChange={handleImportFile} />
                      </div>
                      <Button onClick={handleImportData} disabled={isImporting || !importFile}>
                        {isImporting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                          </>
                        ) : (
                          "Import Tasks"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
