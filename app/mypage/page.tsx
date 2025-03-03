"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, ShoppingBag, Tag } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

// 임시 데이터 (실제로는 API나 데이터베이스에서 가져와야 합니다)
const ongoingPurchases = [
  { id: 1, title: "세븐틴 콘서트", date: "2024-03-20", price: "165,000원", status: "입금 대기중" },
  { id: 2, title: "데이식스 전국투어", date: "2024-02-01", price: "99,000원", status: "배송 준비중" },
]

const ongoingSales = [
  { id: 1, title: "아이브 팬미팅", date: "2024-04-05", price: "88,000원", status: "판매중" },
  { id: 2, title: "웃는 남자", date: "2024-01-09", price: "110,000원", status: "구매자 입금 대기중" },
]

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  // 인증되지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("로그인이 필요합니다")
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

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
          <h1 className="text-3xl font-bold mt-4">마이페이지</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === "profile" ? "bg-gray-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="inline-block mr-2" />
              프로필
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === "ongoing-purchases" ? "bg-gray-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("ongoing-purchases")}
            >
              <ShoppingBag className="inline-block mr-2" />
              구매중인 상품
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center ${activeTab === "ongoing-sales" ? "bg-gray-100 font-semibold" : ""}`}
              onClick={() => setActiveTab("ongoing-sales")}
            >
              <Tag className="inline-block mr-2" />
              판매중인 상품
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">프로필 정보</h2>
                <p>
                  <strong>이름:</strong> {user?.username || "이름 없음"}
                </p>
                <p>
                  <strong>이메일:</strong> {user?.email}
                </p>
                <Link href="/mypage/profile">
                  <Button className="mt-4">프로필 수정</Button>
                </Link>
              </div>
            )}

            {activeTab === "ongoing-purchases" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">구매중인 상품</h2>
                {ongoingPurchases.length > 0 ? (
                  ongoingPurchases.map((item) => (
                    <div key={item.id} className="border-b py-4 last:border-b-0">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.date}</p>
                      <p className="text-sm font-semibold">{item.price}</p>
                      <p className="text-sm text-blue-600">{item.status}</p>
                      <Link href={`/transaction/${item.id}`}>
                        <Button className="mt-2 text-sm" variant="outline">
                          거래 상세
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">구매중인 상품이 없습니다.</p>
                )}
              </div>
            )}

            {activeTab === "ongoing-sales" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">판매중인 상품</h2>
                {ongoingSales.length > 0 ? (
                  ongoingSales.map((item) => (
                    <div key={item.id} className="border-b py-4 last:border-b-0">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.date}</p>
                      <p className="text-sm font-semibold">{item.price}</p>
                      <p className="text-sm text-green-600">{item.status}</p>
                      <Link href={`/transaction/${item.id}`}>
                        <Button className="mt-2 text-sm" variant="outline">
                          거래 상세
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">판매중인 상품이 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

