// Simple password hashing and verification
// In a real app, you would use a proper hashing library like bcrypt
export async function hashPassword(password: string): Promise<string> {
  // This is a simplified version for demo purposes
  // In a real app, you would use a proper hashing algorithm with salt
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

// Check if user is authenticated
export function isAuthenticated() {
  if (typeof window === "undefined") return false

  const currentUser = localStorage.getItem("currentUser")
  return !!currentUser
}

// Get current user
export function getCurrentUser() {
  if (typeof window === "undefined") return null

  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) return null

  return JSON.parse(currentUser)
}
