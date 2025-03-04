"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { CheckCircle, Home, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type Ticket } from "@/app/api/tickets/data"

export default function SellSuccess() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("id")
  
  const [isLoading, setIsLoading] = useState(true)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // 티켓 ID가 있으면 해당 티켓 정보를 가져옵니다
    if (ticketId) {
      fetchTicketDetails(ticketId)
    } else {
      setError("티켓 정보를 찾을 수 없습니다")
      setIsLoading(false)
    }

    // 컨페티 효과
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }, [ticketId])
  
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
    } catch (error: unknown) {
      console.error("티켓 정보 조회 오류:", error)
      setError(error instanceof Error ? error.message : "티켓 정보를 가져오는데 문제가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">티켓 정보를 불러오는 중...</p>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  if (!ticket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-red-500 mb-4">티켓 정보를 찾을 수 없습니다</p>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">판매 등록 완료!</h1>
        <p className="text-gray-600 mb-6">티켓 판매가 성공적으로 등록되었습니다.</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">판매 번호</p>
          <p className="font-semibold text-gray-800 mb-4">{ticket.id}</p>
          <p className="text-sm text-gray-500 mb-2">티켓 정보</p>
          <p className="font-semibold text-gray-800 mb-2">{ticket.title}</p>
          <div className="space-y-1 mt-2">
            <p className="text-gray-600">
              {ticket.grade}석 {ticket.quantity}매
            </p>
            {ticket.section && (
              <p className="text-gray-600">
                구역: {ticket.section}
                {ticket.row && ` / 열: ${ticket.row}`}
                {ticket.seatNumber && ` / 좌석: ${ticket.seatNumber}`}
              </p>
            )}
            <p className="text-gray-600 font-medium mt-2">
              판매가: {ticket.price.toLocaleString()}원 / 총 {(ticket.price * ticket.quantity).toLocaleString()}원
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/mypage" className="w-full">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              <Tag className="w-4 h-4 mr-2" />
              판매 내역 확인하기
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

