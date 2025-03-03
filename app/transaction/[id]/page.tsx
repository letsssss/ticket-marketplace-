"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, Clock, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"

// 임시 데이터 (실제로는 API에서 가져와야 합니다)
const transactionData = {
  id: "1",
  type: "purchase", // or 'sale'
  status: "배송 준비중",
  ticket: {
    title: "세븐틴 콘서트",
    date: "2024-03-20",
    time: "19:00",
    venue: "잠실종합운동장 주경기장",
    seat: "VIP석 A구역 23열 15번",
    image: "/placeholder.svg",
  },
  price: 165000,
  paymentMethod: "신용카드",
  paymentStatus: "결제 완료",
  deliveryAddress: "서울특별시 강남구 테헤란로 123 티켓마켓 아파트 101동 1001호",
  deliveryStatus: "배송 준비중",
  trackingNumber: "TK123456789",
}

export default function TransactionDetail() {
  const params = useParams()
  const router = useRouter()
  const [transaction, setTransaction] = useState(transactionData)

  // 실제 구현에서는 이 부분에서 API를 호출하여 거래 정보를 가져와야 합니다
  useEffect(() => {
    // API 호출 및 데이터 설정 로직
    console.log("Transaction ID:", params.id)
  }, [params.id])

  const handleAction = () => {
    if (transaction.type === "purchase") {
      if (transaction.status === "배송 완료") {
        // 구매 확정 로직
        alert("구매가 확정되었습니다.")
      } else {
        // 배송 조회 로직
        window.open(
          `https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=${transaction.trackingNumber}`,
          "_blank",
        )
      }
    } else {
      // 판매자의 경우 채팅 시작 또는 다른 액션
      alert("구매자와의 채팅이 시작됩니다.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <Link href="/mypage" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>마이페이지로 돌아가기</span>
          </Link>
          <h1 className="text-3xl font-bold mt-4">거래 상세</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">{transaction.ticket.title}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  transaction.status === "배송 완료" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {transaction.status}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src={transaction.ticket.image || "/placeholder.svg"}
                  alt={transaction.ticket.title}
                  width={300}
                  height={200}
                  className="w-full rounded-lg object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{transaction.ticket.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{transaction.ticket.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{transaction.ticket.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                    <span>{transaction.price.toLocaleString()}원</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">좌석: {transaction.ticket.seat}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">결제 정보</h3>
              <p>
                <strong>결제 방법:</strong> {transaction.paymentMethod}
              </p>
              <p>
                <strong>결제 상태:</strong> {transaction.paymentStatus}
              </p>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">배송 정보</h3>
              <p>
                <strong>배송 주소:</strong> {transaction.deliveryAddress}
              </p>
              <p>
                <strong>배송 상태:</strong> {transaction.deliveryStatus}
              </p>
              {transaction.trackingNumber && (
                <p>
                  <strong>운송장 번호:</strong> {transaction.trackingNumber}
                </p>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleAction} className="px-6">
                {transaction.type === "purchase"
                  ? transaction.status === "배송 완료"
                    ? "구매 확정"
                    : "배송 조회"
                  : "구매자와 채팅"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

