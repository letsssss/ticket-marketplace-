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
    const timer = setTimeout(async () => {
      // 이메일이 비어있거나 형식이 올바르지 않으면 검사하지 않음
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email || !emailRegex.test(email)) {
        setEmailError("")
        return
      }
      
      try {
        setIsCheckingEmail(true)
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        
        if (data.exists) {
          setEmailError("이미 사용 중인 이메일 주소입니다.")
        } else {
          setEmailError("")
        }
      } catch (error) {
        console.error("이메일 중복 검사 오류:", error)
      } finally {
        setIsCheckingEmail(false)
      }
    }, 500) // 500ms 디바운스
    
    return () => clearTimeout(timer)
  }, [email])
  
  // 모든 비밀번호 조건이 충족되었는지 확인
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)
  
  // 폼 전체가 유효한지 확인
  const isFormValid = isPasswordValid && !emailError && email && agreed

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setFormTouched(true)
    
    // 이메일 중복 검사 중이면 제출 방지
    if (isCheckingEmail) {
      setError("이메일 중복 검사 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    
    // 이메일 오류가 있으면 제출 방지
    if (emailError) {
      setError(emailError)
      return
    }
    
    console.log("회원가입 시도:", { email, password })
    
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
          username: email.split("@")[0], // 임시로 이메일에서 사용자 이름 생성
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
      router.push("/login") // 로그인 페이지로 이동
    } catch (err) {
      console.error("회원가입 오류:", err)
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Image src="/placeholder.svg" alt="TICKETBAY" width={120} height={40} className="h-12 object-contain" />
          </Link>
        </div>

        {/* Back Button */}
        <div>
          <Link href="/login" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            로그인으로 돌아가기
          </Link>
        </div>

        {/* Signup Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md">{error}</div>}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <div className="relative">
              <Input 
                id="email" 
                type="email" 
                placeholder="example@email.com" 
                required 
                className={`w-full ${emailError ? 'border-red-500 pr-10' : ''}`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFormTouched(true)
                }}
              />
              {isCheckingEmail && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div className="h-4 w-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
              {emailError && !isCheckingEmail && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <Input 
              id="password" 
              type="password" 
              placeholder="8자 이상 입력해주세요" 
              required 
              className="w-full"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setFormTouched(true)
              }}
            />
            
            {/* 비밀번호 요구사항 체크리스트 */}
            {formTouched && (
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex items-center">
                  {passwordValidation.length ? 
                    <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                    <X className="h-3 w-3 text-red-500 mr-1" />}
                  <span className={passwordValidation.length ? "text-green-600" : "text-gray-600"}>
                    8자 이상
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasLetter ? 
                    <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                    <X className="h-3 w-3 text-red-500 mr-1" />}
                  <span className={passwordValidation.hasLetter ? "text-green-600" : "text-gray-600"}>
                    영문자 포함
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasNumber ? 
                    <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                    <X className="h-3 w-3 text-red-500 mr-1" />}
                  <span className={passwordValidation.hasNumber ? "text-green-600" : "text-gray-600"}>
                    숫자 포함
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasSpecial ? 
                    <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                    <X className="h-3 w-3 text-red-500 mr-1" />}
                  <span className={passwordValidation.hasSpecial ? "text-green-600" : "text-gray-600"}>
                    특수문자 포함
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 한번 더 입력해주세요"
              required
              className="w-full"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setFormTouched(true)
              }}
            />
            {formTouched && confirmPassword && (
              <div className="flex items-center mt-1 text-xs">
                {passwordValidation.matches ? 
                  <Check className="h-3 w-3 text-green-500 mr-1" /> : 
                  <X className="h-3 w-3 text-red-500 mr-1" />}
                <span className={passwordValidation.matches ? "text-green-600" : "text-red-600"}>
                  {passwordValidation.matches ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="border-gray-300"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">이용약관</span>과{" "}
              <span className="font-medium text-gray-900">개인정보 처리방침</span>에 동의합니다.
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-800 text-white transition-colors"
            disabled={!isFormValid || isLoading || isCheckingEmail}
          >
            {isLoading ? "처리 중..." : "회원가입"}
          </Button>
        </form>

        {/* Terms */}
        <div className="text-center text-sm text-gray-500">
          회원가입 시{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            이용약관
          </Link>
          과{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            개인정보 처리방침
          </Link>
          에 동의하게 됩니다.
        </div>
      </div>
    </div>
  )
}

