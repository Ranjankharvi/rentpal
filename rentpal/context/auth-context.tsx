"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (name: string, password: string) => Promise<boolean>
  register: (name: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("rentpal_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to validate credentials
    const users = JSON.parse(localStorage.getItem("rentpal_users") || "[]")
    const foundUser = users.find((u: { name: string; password: string }) => u.name === name && u.password === password)

    if (foundUser) {
      const userInfo = { id: foundUser.id, name: foundUser.name }
      setUser(userInfo)
      localStorage.setItem("rentpal_user", JSON.stringify(userInfo))
      return true
    }
    return false
  }

  const register = async (name: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to create a user
    const users = JSON.parse(localStorage.getItem("rentpal_users") || "[]")

    // Check if user already exists
    const userExists = users.some((u: { name: string }) => u.name === name)
    if (userExists) {
      return false
    }

    // Create new user
    const newUser = {
      id: crypto.randomUUID(),
      name,
      password,
    }

    users.push(newUser)
    localStorage.setItem("rentpal_users", JSON.stringify(users))

    // Log in the new user
    const userInfo = { id: newUser.id, name: newUser.name }
    setUser(userInfo)
    localStorage.setItem("rentpal_user", JSON.stringify(userInfo))

    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("rentpal_user")
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
