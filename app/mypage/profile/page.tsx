"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || "",
        email: user.email || "",
      }))
    }
  }, [user])
  
  // 인증되지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("로그인이 필요합니다")
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 비밀번호 변경 시 유효성 검사
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error("비밀번호는 최소 6자 이상이어야 합니다")
        return
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("새 비밀번호와 확인 비밀번호가 일치하지 않습니다")
        return
      }
      
      if (!formData.currentPassword) {
        toast.error("현재 비밀번호를 입력해주세요")
        return
      }
    }
    
    try {
      setIsSubmitting(true)
      
      // 프로필 업데이트 API 호출
      const success = await updateProfile({
        username: formData.username,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })
      
      if (success) {
        // 비밀번호 필드 초기화
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }))
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error)
      toast.error("프로필 업데이트 중 오류가 발생했습니다")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">로딩 중...</div>
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>마이페이지로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">프로필 설정</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <User className="h-12 w-12 p-2 bg-gray-100 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{user?.username || "사용자"}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="username">사용자 이름</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다</p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">비밀번호 변경</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">새 비밀번호</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? "저장 중..." : "변경사항 저장"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
} 