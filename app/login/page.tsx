"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  
  // 이미 로그인되어 있으면 홈페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("유효한 이메일 주소를 입력해주세요.")
        setIsLoading(false)
        return
      }
      
      // 비밀번호 검증
      if (!password || password.length < 1) {
        setError("비밀번호를 입력해주세요.")
        setIsLoading(false)
        return
      }
      
      const result = await login(email, password)

      if (result.success) {
        // 로그인 성공 시 홈페이지로 리다이렉트
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email)
        } else {
          localStorage.removeItem("rememberedEmail")
        }
        router.push("/")
      } else {
        // 에러 처리
        setError(result.message || "로그인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }
  
  // 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md space-y-10">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/placeholder.svg"
              alt="TICKETBAY"
              width={120}
              height={40}
              className="h-12 object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">아이디(이메일)</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="w-full border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">비밀번호</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-gray-300"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-gray-300"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                아이디 저장
              </label>
            </div>
            
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              비밀번호 찾기
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white py-2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <Button 
            type="button"
            className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black font-medium py-2 transition-colors"
            onClick={() => toast.info("소셜 로그인은 아직 구현되지 않았습니다.")}
          >
            카카오로 1초 로그인/회원가입
          </Button>

          <Link href="/signup" className="block">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-2 transition-colors">
              이메일로 회원가입
            </Button>
          </Link>
        </form>

        {/* Social Login */}
        <div className="pt-8">
          <div className="flex justify-center space-x-12">
            <button 
              className="flex flex-col items-center group"
              onClick={() => toast.info("소셜 로그인은 아직 구현되지 않았습니다.")}
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#03C75A] rounded-full mb-2 group-hover:opacity-90 transition-opacity">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">네이버</span>
            </button>

            <button 
              className="flex flex-col items-center group"
              onClick={() => toast.info("소셜 로그인은 아직 구현되지 않았습니다.")}
            >
              <div className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full mb-2 group-hover:border-gray-400 transition-colors">
                <Image src="/placeholder.svg" alt="Google" width={28} height={28} />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Google</span>
            </button>

            <button 
              className="flex flex-col items-center group"
              onClick={() => toast.info("소셜 로그인은 아직 구현되지 않았습니다.")}
            >
              <div className="w-14 h-14 flex items-center justify-center bg-black rounded-full mb-2 group-hover:bg-gray-900 transition-colors">
                <Image src="/placeholder.svg" alt="Apple" width={28} height={28} className="invert" />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

