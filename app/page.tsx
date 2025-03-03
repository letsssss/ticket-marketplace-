"use client"
import { useState } from "react"
import Link from "next/link"

import type React from "react"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"

const popularTickets = [
  {
    id: 1,
    rank: 1,
    artist: "세븐틴",
    date: "25.03.20 ~ 25.03.21",
    venue: "잠실종합운동장 주경기장",
  },
  {
    id: 2,
    rank: 2,
    artist: "데이식스 (DAY6)",
    date: "25.02.01 ~ 25.03.30",
    venue: "전국투어",
  },
  {
    id: 3,
    rank: 3,
    artist: "아이브",
    date: "25.04.05 ~ 25.04.06",
    venue: "KSPO DOME",
  },
  {
    id: 4,
    rank: 4,
    artist: "웃는 남자",
    date: "25.01.09 ~ 25.03.09",
    venue: "예술의전당 오페라극장",
  },
]

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleTicketSaleClick = () => {
    if (user) {
      router.push("/sell")
    } else {
      router.push("/login")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  const handleLogout = async () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen">
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <span className="text-2xl font-bold text-[#0061FF]">이지티켓</span>
              <Link href="/proxy-ticketing" className="text-gray-700 hover:text-[#0061FF] transition-colors">
                대리티켓팅
              </Link>
              <Link href="/ticket-cancellation" className="text-gray-700 hover:text-[#0061FF] transition-colors">
                취켓팅
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-[#0061FF] transition-colors">
                    로그아웃
                  </button>
                  <Link href="/mypage" className="text-gray-700 hover:text-[#0061FF] transition-colors">
                    마이페이지
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-[#0061FF] transition-colors">
                    장바구니
                  </Link>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 hover:text-[#0061FF] transition-colors">
                  로그인
                </Link>
              )}
              <button
                onClick={handleTicketSaleClick}
                className="px-4 py-2 bg-[#0061FF] text-white rounded-md hover:bg-[#0052D6] transition-colors"
              >
                티켓 판매
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0061FF] to-[#60A5FA]">
        <section className="flex flex-col items-center justify-center py-10 md:py-16 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 leading-tight">
            모든 티켓, 한 곳에서
          </h1>
          <p className="text-base md:text-lg text-white/90 text-center mb-8 max-w-xl">
            콘서트, 뮤지컬, 스포츠 경기 등 다양한 이벤트 티켓을 찾아보세요.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col sm:flex-row gap-2">
            <Input
              type="search"
              placeholder="이벤트, 아티스트, 팀 검색"
              className="flex-1 h-12 rounded-lg sm:rounded-r-none border-0 bg-white text-black placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              className="h-12 px-8 rounded-lg sm:rounded-l-none bg-[#FFD600] hover:bg-[#FFE600] text-black font-medium transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              검색
            </Button>
          </form>
        </section>
      </div>

      {/* Popular Tickets Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              오늘의 <span className="text-[#FF2F6E]">인기</span> 티켓
            </h2>
          </div>
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <Button
              variant="outline"
              className="rounded-full px-6 bg-white border-gray-200 text-black hover:bg-gray-50 transition-colors"
            >
              1~10위
            </Button>
            <Button
              variant="ghost"
              className="rounded-full px-6 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              11~20위
            </Button>
          </div>
          <div className="space-y-4">
            {popularTickets.map((ticket, index) => (
              <div key={ticket.id}>
                <Link href={`/ticket/${ticket.id}`}>
                  <div className="flex items-center py-4 px-4 hover:bg-gray-50 transition-colors cursor-pointer rounded-lg">
                    <span className="text-[#FF2F6E] font-bold text-xl md:text-2xl w-12 md:w-16">{ticket.rank}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-base md:text-lg mb-1">{ticket.artist}</h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                        <span>{ticket.date}</span>
                        <span>•</span>
                        <span>{ticket.venue}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                {index < popularTickets.length - 1 && <div className="border-b border-gray-200 my-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

