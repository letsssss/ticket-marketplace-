"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Filter, Search, Tag, Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { type Ticket, type TicketGrade } from "@/app/api/tickets/data"
import { type Concert } from "@/app/api/concerts/data"

export default function TicketsPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""
  
  const [searchTerm, setSearchTerm] = useState(initialQuery)
  const [tickets, setTickets] = useState<(Ticket & { concert?: Concert })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    grade: [] as TicketGrade[],
    minPrice: "",
    maxPrice: "",
    status: "available"
  })
  
  // 티켓 목록 가져오기
  useEffect(() => {
    fetchTickets()
  }, [searchTerm, filters])
  
  const fetchTickets = async () => {
    setIsLoading(true)
    
    try {
      let url = "/api/tickets?status=available"
      
      if (searchTerm) {
        url += `&query=${encodeURIComponent(searchTerm)}`
      }
      
      if (filters.grade.length > 0) {
        url += `&grade=${filters.grade.join(",")}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("티켓 목록을 가져오는데 실패했습니다")
      }
      
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("티켓 목록 조회 오류:", error)
      setError(error instanceof Error ? error.message : "티켓 목록을 가져오는데 문제가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGradeChange = (grade: TicketGrade, checked: boolean) => {
    setFilters(prev => {
      if (checked) {
        return { ...prev, grade: [...prev.grade, grade] }
      } else {
        return { ...prev, grade: prev.grade.filter(g => g !== grade) }
      }
    })
  }
  
  const handlePriceChange = (type: "minPrice" | "maxPrice", value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }))
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTickets()
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    }).format(date)
  }
  
  const filteredTickets = tickets.filter(ticket => {
    // 가격 필터링
    if (filters.minPrice && Number(ticket.price) < Number(filters.minPrice)) {
      return false
    }
    
    if (filters.maxPrice && Number(ticket.price) > Number(filters.maxPrice)) {
      return false
    }
    
    return true
  })
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">티켓 목록</h1>
        
        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="공연명, 아티스트 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">검색</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </form>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium mb-2">좌석 등급</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grade-vip"
                      checked={filters.grade.includes("VIP")}
                      onCheckedChange={(checked) => 
                        handleGradeChange("VIP", checked as boolean)
                      }
                    />
                    <label htmlFor="grade-vip" className="text-sm">VIP석</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grade-r"
                      checked={filters.grade.includes("R")}
                      onCheckedChange={(checked) => 
                        handleGradeChange("R", checked as boolean)
                      }
                    />
                    <label htmlFor="grade-r" className="text-sm">R석</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grade-s"
                      checked={filters.grade.includes("S")}
                      onCheckedChange={(checked) => 
                        handleGradeChange("S", checked as boolean)
                      }
                    />
                    <label htmlFor="grade-s" className="text-sm">S석</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grade-a"
                      checked={filters.grade.includes("A")}
                      onCheckedChange={(checked) => 
                        handleGradeChange("A", checked as boolean)
                      }
                    />
                    <label htmlFor="grade-a" className="text-sm">A석</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grade-b"
                      checked={filters.grade.includes("B")}
                      onCheckedChange={(checked) => 
                        handleGradeChange("B", checked as boolean)
                      }
                    />
                    <label htmlFor="grade-b" className="text-sm">B석</label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">가격 범위</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="최소 가격"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="최대 가격"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      grade: [],
                      minPrice: "",
                      maxPrice: "",
                      status: "available"
                    })
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* 티켓 목록 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchTickets}>다시 시도</Button>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">판매 중인 티켓이 없습니다</h2>
            <p className="text-gray-500 mb-6">검색어나 필터를 변경해보세요</p>
            <Link href="/sell">
              <Button>티켓 판매하기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <Link href={`/tickets/${ticket.id}`} key={ticket.id}>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {ticket.concert?.posterImage ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={ticket.concert.posterImage}
                        alt={ticket.concert.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <Tag className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg line-clamp-1">{ticket.title}</h3>
                      <Badge variant={ticket.price < (ticket.originalPrice || 0) ? "destructive" : "outline"}>
                        {ticket.price < (ticket.originalPrice || 0) ? "할인" : "정가"}
                      </Badge>
                    </div>
                    
                    {ticket.concert && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">{ticket.concert.artist}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(ticket.concert.date)}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{ticket.concert.venue}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <Badge variant="secondary" className="mr-1">
                          {ticket.grade}석
                        </Badge>
                        <Badge variant="secondary">
                          {ticket.quantity}매
                        </Badge>
                      </div>
                      <p className="font-bold text-lg">
                        {ticket.price.toLocaleString()}원
                      </p>
                    </div>
                    
                    {ticket.originalPrice && ticket.price < ticket.originalPrice && (
                      <p className="text-sm text-gray-500 line-through text-right">
                        {ticket.originalPrice.toLocaleString()}원
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 