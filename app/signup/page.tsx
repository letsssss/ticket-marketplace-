"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function Signup() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formTouched, setFormTouched] = useState(false)
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailError, setEmailError] = useState("")
  
  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
    matches: false
  })
  
  // 비밀번호 유효성 검사
  useEffect(() => {
    setPasswordValidation({
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matches: password === confirmPassword && confirmPassword !== ""
    })
  }, [password, confirmPassword])
  
  // 이메일 중복 검사
  useEffect(() => {
    // 디바운스를 위한 타이머
    let timer: NodeJS.Timeout
    
    const checkEmailExists = async () => {
      if (!email || !email.includes('@')) return
      
      try {
        setIsCheckingEmail(true)
        setEmailError("")
        
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        
        if (data.exists) {
          setEmailError("이미 사용 중인 이메일 주소입니다.")
        }
      } catch (error) {
        console.error("이메일 확인 오류:", error)
      } finally {
        setIsCheckingEmail(false)
      }
    }
    
    if (email) {
      // 타이핑이 멈추고 500ms 후에 API 호출
      timer = setTimeout(checkEmailExists, 500)
    }
    
    return () => clearTimeout(timer)
  }, [email])
  
  // 모든 유효성 검사 통과 여부
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  const isFormValid = email && password && confirmPassword && agreed && isPasswordValid && !emailError
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) {
      setFormTouched(true)
      
      if (!agreed) {
        setError("이용약관에 동의해주세요.")
        return
      }
      
      if (emailError) {
        setError(emailError)
        return
      }
      
      setError("모든 필드를 올바르게 입력해주세요.")
      return
    }
    
    console.log("회원가입 시도:", { email, username, password })
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.")
      return
    }
    
    // 비밀번호 유효성 검사
    if (!isPasswordValid) {
      setError("비밀번호 요구사항을 모두 충족해야 합니다.")
      return
    }
    
    try {
      setIsLoading(true)
      
      // API 호출
      console.log("API 호출 시작")
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username: username || email.split("@")[0], // 사용자 이름이 없으면 이메일에서 생성
        }),
      })
      
      console.log("API 응답:", response.status, response.statusText)
      
      const responseData = await response.json()
      console.log("응답 데이터:", responseData)
      
      if (!response.ok) {
        // 서버에서 오류 응답이 온 경우
        if (response.status === 409) {
          // 409 Conflict - 이메일 중복
          throw new Error("이미 사용 중인 이메일 주소입니다. 다른 이메일을 사용해주세요.")
        } else {
          throw new Error(responseData.error || "회원가입에 실패했습니다.")
        }
      }
      
      // 성공 시 처리
      toast.success("회원가입이 완료되었습니다!")
      
      // 로그인 페이지로 이동
      router.push("/login")
    } catch (error) {
      console.error("회원가입 오류:", error)
      setError(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>홈으로 돌아가기</span>
        </Link>
        
        <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@example.com"
                      className={`${emailError ? "border-red-500" : ""}`}
                      required
                    />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                </div>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="홍길동"
                  />
                  <p className="mt-1 text-xs text-gray-500">이름을 입력하지 않으면 이메일 아이디가 사용됩니다.</p>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">비밀번호 요구사항:</p>
                  <ul className="space-y-1">
                    <li className="text-xs flex items-center">
                      {passwordValidation.length ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span>8자 이상</span>
                    </li>
                    <li className="text-xs flex items-center">
                      {passwordValidation.hasLetter ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span>영문자 포함</span>
                    </li>
                    <li className="text-xs flex items-center">
                      {passwordValidation.hasNumber ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span>숫자 포함</span>
                    </li>
                    <li className="text-xs flex items-center">
                      {passwordValidation.hasSpecial ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span>특수문자 포함</span>
                    </li>
                    <li className="text-xs flex items-center">
                      {passwordValidation.matches ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span>비밀번호 일치</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex items-start">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    <span>
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        이용약관
                      </Link>
                      과{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        개인정보 처리방침
                      </Link>
                      에 동의합니다.
                    </span>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || (formTouched && !isFormValid)}
                >
                  {isLoading ? "처리 중..." : "회원가입"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  로그인
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

