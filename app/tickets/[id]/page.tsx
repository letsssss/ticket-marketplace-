"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Tag, User, Clock, Info, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { type Ticket } from "@/app/api/tickets/data"
import { type Concert } from "@/app/api/concerts/data"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  
  const [ticket, setTicket] = useState<(Ticket & { concert?: Concert, seller?: { username: string } }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)
  
  useEffect(() => {
    if (params.id) {
      fetchTicketDetails(params.id as string)
    }
  }, [params.id])
  
  const fetchTicketDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/tickets?id=${id}`)
      
      if (!response.ok) {
        throw new Error("티켓 정보를 가져오는데 실패했습니다")
      }
      
      const data = await response.json()
      
      if (data.length === 0) {
        throw new Error("티켓을 찾을 수 없습니다")
      }
      
      setTicket(data[0])
    } catch (error) {
      console.error("티켓 정보 조회 오류:", error)
      setError(error instanceof Error ? error.message : "티켓 정보를 가져오는데 문제가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error("로그인이 필요합니다")
      router.push(`/login?redirect=/tickets/${params.id}`)
      return
    }
    
    if (!ticket) return
    
    // 자신의 티켓은 구매할 수 없음
    if (ticket.sellerId === user?.id) {
      toast.error("자신이 판매 중인 티켓은 구매할 수 없습니다")
      return
    }
    
    setIsPurchasing(true)
    
    try {
      // 실제 구현에서는 결제 프로세스를 진행합니다
      // 여기서는 상태 변경만 시뮬레이션합니다
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("티켓 구매가 완료되었습니다")
      router.push(`/mypage`)
    } catch (error) {
      console.error("티켓 구매 오류:", error)
      toast.error("티켓 구매 중 오류가 발생했습니다")
    } finally {
      setIsPurchasing(false)
    }
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-40" />
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <Skeleton className="h-64 md:w-1/3" />
              <div className="p-6 md:w-2/3">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-6" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3 mb-6" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">티켓을 찾을 수 없습니다</h1>
          <p className="text-gray-600 mb-6">{error || "요청하신 티켓 정보가 존재하지 않습니다"}</p>
          <Link href="/tickets">
            <Button>티켓 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/tickets" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>티켓 목록으로 돌아가기</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* 공연 포스터 */}
            <div className="md:w-1/3">
              {ticket.concert?.posterImage ? (
                <div className="relative h-64 md:h-full">
                  <Image
                    src={ticket.concert.posterImage}
                    alt={ticket.concert.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <Tag className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* 티켓 정보 */}
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold">{ticket.title}</h1>
                <Badge variant={ticket.price < (ticket.originalPrice || 0) ? "destructive" : "outline"}>
                  {ticket.price < (ticket.originalPrice || 0) ? "할인" : "정가"}
                </Badge>
              </div>
              
              {ticket.concert && (
                <div className="mb-6">
                  <p className="text-lg text-gray-700 mb-2">{ticket.concert.artist}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(ticket.concert.date)} {ticket.concert.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{ticket.concert.venue}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <Separator className="my-4" />
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">좌석 등급</span>
                  <span className="font-medium">{ticket.grade}석</span>
                </div>
                
                {ticket.section && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">구역</span>
                    <span className="font-medium">{ticket.section}</span>
                  </div>
                )}
                
                {ticket.row && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">열</span>
                    <span className="font-medium">{ticket.row}</span>
                  </div>
                )}
                
                {ticket.seatNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">좌석 번호</span>
                    <span className="font-medium">{ticket.seatNumber}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">수량</span>
                  <span className="font-medium">{ticket.quantity}매</span>
                </div>
                
                {ticket.isConsecutiveSeats && ticket.quantity > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">연석 여부</span>
                    <span className="font-medium text-green-600">연석</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">판매자</span>
                  <span className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {ticket.seller?.username || "알 수 없음"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">등록일</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {ticket.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    판매자 설명
                  </h3>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                    {ticket.description}
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">티켓 가격 (1장당)</p>
                    <div className="flex items-end gap-2">
                      <p className="text-2xl font-bold">{ticket.price.toLocaleString()}원</p>
                      {ticket.originalPrice && ticket.price < ticket.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          {ticket.originalPrice.toLocaleString()}원
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">총 결제 금액</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(ticket.price * ticket.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
                
                <Button
                  className="w-full h-12 text-lg"
                  onClick={handlePurchase}
                  disabled={isPurchasing || ticket.sellerId === user?.id}
                >
                  {isPurchasing ? "처리 중..." : 
                   ticket.sellerId === user?.id ? "내가 판매 중인 티켓입니다" : "구매하기"}
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    구매하려면 먼저 <Link href={`/login?redirect=/tickets/${params.id}`} className="text-blue-600 hover:underline">로그인</Link>이 필요합니다
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 