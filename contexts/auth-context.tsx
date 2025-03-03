"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

type User = {
  id: number
  email: string
  username?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 페이지 로드 시 로컬 스토리지에서 사용자 정보 가져오기
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const storedUser = localStorage.getItem("user")
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("인증 확인 오류:", error)
        // 오류 발생 시 로그아웃 처리
        localStorage.removeItem("user")
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // 실제 API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        // 로그인 성공
        const userData = data.user
        
        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
        
        toast.success("로그인되었습니다!")
        return { success: true }
      } else {
        // 로그인 실패
        toast.error(data.message || "로그인에 실패했습니다.")
        return {
          success: false,
          message: data.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error)
      toast.error("로그인 중 오류가 발생했습니다.")
      return {
        success: false,
        message: "로그인 중 오류가 발생했습니다.",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 로그아웃 API 호출 (선택적)
      await fetch("/api/auth/logout", {
        method: "POST",
      }).catch(() => {
        // API 호출 실패해도 계속 진행
      })
    } finally {
      // 로컬 스토리지에서 사용자 정보 제거
      localStorage.removeItem("user")
      setUser(null)
      setIsAuthenticated(false)
      toast.success("로그아웃되었습니다.")
    }
  }
  
  // 프로필 업데이트 함수
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) {
      toast.error("로그인이 필요합니다")
      return false
    }
    
    try {
      setIsLoading(true)
      
      // 사용자 정보 업데이트 API 호출
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id, ...userData }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || "프로필 업데이트에 실패했습니다")
        return false
      }
      
      const updatedUserData = await response.json()
      
      // 로컬 스토리지와 상태 업데이트
      const updatedUser = { ...user, ...updatedUserData }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success("프로필이 업데이트되었습니다")
      return true
    } catch (error) {
      console.error("프로필 업데이트 오류:", error)
      toast.error("프로필 업데이트 중 오류가 발생했습니다")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// 커스텀 훅으로 AuthContext 사용하기 쉽게 만들기
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

