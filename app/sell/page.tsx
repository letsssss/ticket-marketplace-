"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Search, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { type Concert } from "@/app/api/concerts/data"
import { type TicketGrade } from "@/app/api/tickets/data"

export default function SellPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Concert[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    quantity: "1",
    grade: "" as TicketGrade,
    section: "",
    row: "",
    seatNumber: "",
    price: "",
    originalPrice: "",
    isConsecutiveSeats: false,
    description: ""
  })
  
  const [formErrors, setFormErrors] = useState({
    title: "",
    price: "",
    originalPrice: "",
    grade: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 인증되지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("로그인이 필요합니다")
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])
  
  // 공연 검색
  useEffect(() => {
    const searchConcerts = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }
      
      setIsSearching(true)
      
      try {
        const response = await fetch(`/api/concerts?query=${encodeURIComponent(searchTerm)}`)
        
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
        } else {
          console.error("공연 검색 실패")
          setSearchResults([])
        }
      } catch (error) {
        console.error("공연 검색 오류:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }
    
    const timer = setTimeout(searchConcerts, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  // 공연 선택 시 제목 자동 생성
  useEffect(() => {
    if (selectedConcert && formData.grade) {
      const autoTitle = `${selectedConcert.title} ${formData.grade}석 ${formData.quantity}장`
      setFormData(prev => ({ ...prev, title: autoTitle }))
    }
  }, [selectedConcert, formData.grade, formData.quantity])
  
  // 공연 선택 시 원가 자동 설정
  useEffect(() => {
    if (selectedConcert && formData.grade) {
      const gradeKey = formData.grade.toLowerCase() as keyof typeof selectedConcert.price
      const originalPrice = selectedConcert.price[gradeKey]
      
      if (originalPrice) {
        setFormData(prev => ({ 
          ...prev, 
          originalPrice: originalPrice.toString(),
          price: originalPrice.toString()
        }))
      }
    }
  }, [selectedConcert, formData.grade])
  
  const handleConcertSelect = (concert: Concert) => {
    setSelectedConcert(concert)
    setSearchTerm("")
    setSearchResults([])
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 에러 메시지 초기화
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 에러 메시지 초기화
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: "" }))
    }
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const validateForm = () => {
    const errors = {
      title: "",
      price: "",
      originalPrice: "",
      grade: ""
    }
    
    let isValid = true
    
    if (!formData.title.trim()) {
      errors.title = "제목을 입력해주세요"
      isValid = false
    }
    
    if (!formData.grade) {
      errors.grade = "좌석 등급을 선택해주세요"
      isValid = false
    }
    
    if (!formData.price) {
      errors.price = "판매 가격을 입력해주세요"
      isValid = false
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "유효한 가격을 입력해주세요"
      isValid = false
    }
    
    if (!formData.originalPrice) {
      errors.originalPrice = "원가를 입력해주세요"
      isValid = false
    } else if (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0) {
      errors.originalPrice = "유효한 원가를 입력해주세요"
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedConcert) {
      toast.error("판매할 공연을 선택해주세요")
      return
    }
    
    if (!validateForm()) {
      toast.error("입력 정보를 확인해주세요")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const ticketData = {
        concertId: selectedConcert.id,
        sellerId: user?.id,
        title: formData.title,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        quantity: Number(formData.quantity),
        grade: formData.grade,
        section: formData.section || undefined,
        row: formData.row || undefined,
        seatNumber: formData.seatNumber || undefined,
        isConsecutiveSeats: formData.isConsecutiveSeats,
        description: formData.description || undefined
      }
      
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success("티켓이 성공적으로 등록되었습니다")
        router.push("/sell/success?id=" + data.id)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "티켓 등록에 실패했습니다")
      }
    } catch (error) {
      console.error("티켓 등록 오류:", error)
      toast.error(error instanceof Error ? error.message : "티켓 등록 중 오류가 발생했습니다")
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
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>홈으로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">티켓 판매하기</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* 공연 검색 */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">1. 판매할 공연 선택</h2>
                  
                  {selectedConcert ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{selectedConcert.title}</h3>
                          <p className="text-sm text-gray-600">{selectedConcert.artist}</p>
                          <p className="text-sm text-gray-600">
                            {selectedConcert.date} {selectedConcert.time} | {selectedConcert.venue}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSelectedConcert(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="공연명, 아티스트 또는 장소로 검색"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      {isSearching && (
                        <div className="mt-2 text-center text-sm text-gray-500">
                          검색 중...
                        </div>
                      )}
                      
                      {searchResults.length > 0 && (
                        <div className="mt-2 border rounded-md overflow-hidden">
                          {searchResults.map((concert) => (
                            <div
                              key={concert.id}
                              className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleConcertSelect(concert)}
                            >
                              <h3 className="font-medium">{concert.title}</h3>
                              <p className="text-sm text-gray-600">{concert.artist}</p>
                              <p className="text-sm text-gray-600">
                                {concert.date} | {concert.venue}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && (
                        <div className="mt-2 text-center text-sm text-gray-500">
                          검색 결과가 없습니다
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* 티켓 정보 */}
                {selectedConcert && (
                  <>
                    <div>
                      <h2 className="text-lg font-semibold mb-4">2. 티켓 정보 입력</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            제목
                          </label>
                          <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={formErrors.title ? "border-red-500" : ""}
                          />
                          {formErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                              수량
                            </label>
                            <Select
                              value={formData.quantity}
                              onValueChange={(value) => handleSelectChange("quantity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="수량 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1장</SelectItem>
                                <SelectItem value="2">2장</SelectItem>
                                <SelectItem value="3">3장</SelectItem>
                                <SelectItem value="4">4장</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                              좌석 등급
                            </label>
                            <Select
                              value={formData.grade}
                              onValueChange={(value) => handleSelectChange("grade", value as TicketGrade)}
                            >
                              <SelectTrigger className={formErrors.grade ? "border-red-500" : ""}>
                                <SelectValue placeholder="등급 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedConcert.price.vip && <SelectItem value="VIP">VIP석</SelectItem>}
                                {selectedConcert.price.r && <SelectItem value="R">R석</SelectItem>}
                                {selectedConcert.price.s && <SelectItem value="S">S석</SelectItem>}
                                {selectedConcert.price.a && <SelectItem value="A">A석</SelectItem>}
                                {selectedConcert.price.b && <SelectItem value="B">B석</SelectItem>}
                              </SelectContent>
                            </Select>
                            {formErrors.grade && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.grade}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                              구역 (선택사항)
                            </label>
                            <Input
                              id="section"
                              name="section"
                              value={formData.section}
                              onChange={handleInputChange}
                              placeholder="예: 1층, 2층, A구역"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="row" className="block text-sm font-medium text-gray-700 mb-1">
                              열 (선택사항)
                            </label>
                            <Input
                              id="row"
                              name="row"
                              value={formData.row}
                              onChange={handleInputChange}
                              placeholder="예: A, B, 1, 2"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              좌석번호 (선택사항)
                            </label>
                            <Input
                              id="seatNumber"
                              name="seatNumber"
                              value={formData.seatNumber}
                              onChange={handleInputChange}
                              placeholder="예: 15, 16-18"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                              원가 (1장당)
                            </label>
                            <Input
                              id="originalPrice"
                              name="originalPrice"
                              type="number"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              className={formErrors.originalPrice ? "border-red-500" : ""}
                            />
                            {formErrors.originalPrice && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.originalPrice}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                              판매가 (1장당)
                            </label>
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              value={formData.price}
                              onChange={handleInputChange}
                              className={formErrors.price ? "border-red-500" : ""}
                            />
                            {formErrors.price && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
                            )}
                          </div>
                        </div>
                        
                        {formData.quantity !== "1" && (
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="isConsecutiveSeats"
                              checked={formData.isConsecutiveSeats}
                              onCheckedChange={(checked) => 
                                handleCheckboxChange("isConsecutiveSeats", checked as boolean)
                              }
                              className="mt-1"
                            />
                            <label htmlFor="isConsecutiveSeats" className="text-sm text-gray-700">
                              연석입니다 (좌석이 연속으로 붙어있음)
                            </label>
                          </div>
                        )}
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            상세 설명 (선택사항)
                          </label>
                          <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="티켓에 대한 추가 정보를 입력해주세요. (예: 거래 방법, 티켓 수령 방법 등)"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "등록 중..." : "티켓 판매 등록하기"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

