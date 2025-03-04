"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Edit, Trash2, Plus, Calendar, MapPin, Music, Tag, Clock } from "lucide-react"

import { type Concert } from "@/app/api/concerts/data"
import { type Ticket } from "@/app/api/tickets/data"

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("concerts")
  
  // 공연 관리 상태
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [isLoadingConcerts, setIsLoadingConcerts] = useState(true)
  const [isAddingConcert, setIsAddingConcert] = useState(false)
  const [isEditingConcert, setIsEditingConcert] = useState(false)
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null)
  
  // 티켓 관리 상태
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(true)
  
  // 공연 폼 상태
  const [concertForm, setConcertForm] = useState({
    title: "",
    artist: "",
    date: "",
    time: "",
    venue: "",
    address: "",
    posterImage: "",
    description: "",
    category: "",
    price: {
      vip: "",
      r: "",
      s: "",
      a: "",
      b: ""
    },
    status: "upcoming"
  })
  
  // 데이터 로드
  useEffect(() => {
    if (activeTab === "concerts") {
      fetchConcerts()
    } else if (activeTab === "tickets") {
      fetchTickets()
    }
  }, [activeTab])
  
  // 공연 정보 가져오기
  const fetchConcerts = async () => {
    setIsLoadingConcerts(true)
    
    try {
      const response = await fetch("/api/concerts")
      
      if (!response.ok) {
        throw new Error("공연 정보를 가져오는데 실패했습니다")
      }
      
      const data = await response.json()
      setConcerts(data)
    } catch (error) {
      console.error("공연 정보 조회 오류:", error)
      toast.error("공연 정보를 불러오는데 실패했습니다")
    } finally {
      setIsLoadingConcerts(false)
    }
  }
  
  // 티켓 정보 가져오기
  const fetchTickets = async () => {
    setIsLoadingTickets(true)
    
    try {
      const response = await fetch("/api/tickets")
      
      if (!response.ok) {
        throw new Error("티켓 정보를 가져오는데 실패했습니다")
      }
      
      const data = await response.json()
      setTickets(data)
    } catch (error) {
      console.error("티켓 정보 조회 오류:", error)
      toast.error("티켓 정보를 불러오는데 실패했습니다")
    } finally {
      setIsLoadingTickets(false)
    }
  }
  
  // 공연 폼 초기화
  const resetConcertForm = () => {
    setConcertForm({
      title: "",
      artist: "",
      date: "",
      time: "",
      venue: "",
      address: "",
      posterImage: "",
      description: "",
      category: "",
      price: {
        vip: "",
        r: "",
        s: "",
        a: "",
        b: ""
      },
      status: "upcoming"
    })
  }
  
  // 공연 추가 모드 시작
  const startAddConcert = () => {
    resetConcertForm()
    setIsAddingConcert(true)
    setIsEditingConcert(false)
    setSelectedConcert(null)
  }
  
  // 공연 수정 모드 시작
  const startEditConcert = (concert: Concert) => {
    setConcertForm({
      title: concert.title,
      artist: concert.artist,
      date: concert.date,
      time: concert.time,
      venue: concert.venue,
      address: concert.address,
      posterImage: concert.posterImage,
      description: concert.description,
      category: concert.category,
      price: {
        vip: concert.price.vip?.toString() || "",
        r: concert.price.r?.toString() || "",
        s: concert.price.s?.toString() || "",
        a: concert.price.a?.toString() || "",
        b: concert.price.b?.toString() || ""
      },
      status: concert.status
    })
    setSelectedConcert(concert)
    setIsEditingConcert(true)
    setIsAddingConcert(false)
  }
  
  // 공연 폼 취소
  const cancelConcertForm = () => {
    setIsAddingConcert(false)
    setIsEditingConcert(false)
    setSelectedConcert(null)
    resetConcertForm()
  }
  
  // 공연 폼 입력 처리
  const handleConcertInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConcertForm(prev => ({ ...prev, [name]: value }))
  }
  
  // 공연 가격 입력 처리
  const handlePriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConcertForm(prev => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: value
      }
    }))
  }
  
  // 공연 상태 변경 처리
  const handleStatusChange = (value: string) => {
    setConcertForm(prev => ({ ...prev, status: value as "upcoming" | "ongoing" | "completed" }))
  }
  
  // 공연 폼 제출
  const handleConcertSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 필수 필드 검증
    if (!concertForm.title || !concertForm.artist || !concertForm.date || !concertForm.venue) {
      toast.error("필수 정보를 모두 입력해주세요")
      return
    }
    
    // 가격 정보 변환
    const priceData = {
      vip: concertForm.price.vip ? Number(concertForm.price.vip) : undefined,
      r: concertForm.price.r ? Number(concertForm.price.r) : undefined,
      s: concertForm.price.s ? Number(concertForm.price.s) : undefined,
      a: concertForm.price.a ? Number(concertForm.price.a) : undefined,
      b: concertForm.price.b ? Number(concertForm.price.b) : undefined
    }
    
    // 적어도 하나의 가격 정보가 있는지 확인
    if (!priceData.vip && !priceData.r && !priceData.s && !priceData.a && !priceData.b) {
      toast.error("적어도 하나의 좌석 가격 정보를 입력해주세요")
      return
    }
    
    try {
      const concertData = {
        ...concertForm,
        price: priceData
      }
      
      let response
      
      if (isEditingConcert && selectedConcert) {
        // 공연 정보 수정
        response = await fetch("/api/concerts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedConcert.id,
            ...concertData
          }),
        })
      } else {
        // 새 공연 정보 추가
        response = await fetch("/api/concerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(concertData),
        })
      }
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "공연 정보 저장에 실패했습니다")
      }
      
      toast.success(isEditingConcert ? "공연 정보가 수정되었습니다" : "새 공연이 추가되었습니다")
      resetConcertForm()
      setIsAddingConcert(false)
      setIsEditingConcert(false)
      setSelectedConcert(null)
      fetchConcerts()
    } catch (error) {
      console.error("공연 정보 저장 오류:", error)
      toast.error(error instanceof Error ? error.message : "공연 정보 저장 중 오류가 발생했습니다")
    }
  }
  
  // 공연 삭제
  const handleDeleteConcert = async (id: number) => {
    if (!confirm("정말로 이 공연을 삭제하시겠습니까?")) {
      return
    }
    
    try {
      const response = await fetch("/api/concerts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "공연 삭제에 실패했습니다")
      }
      
      toast.success("공연이 삭제되었습니다")
      fetchConcerts()
    } catch (error) {
      console.error("공연 삭제 오류:", error)
      toast.error(error instanceof Error ? error.message : "공연 삭제 중 오류가 발생했습니다")
    }
  }
  
  // 티켓 상세 보기
  const viewTicketDetail = (id: number) => {
    router.push(`/tickets/${id}`)
  }
  
  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="concerts">공연 관리</TabsTrigger>
          <TabsTrigger value="tickets">티켓 관리</TabsTrigger>
        </TabsList>
        
        <TabsContent value="concerts" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">공연 목록</h2>
            {!isAddingConcert && !isEditingConcert && (
              <Button onClick={startAddConcert}>
                <Plus className="h-4 w-4 mr-2" />
                새 공연 등록
              </Button>
            )}
          </div>
          
          {isAddingConcert || isEditingConcert ? (
            <Card>
              <CardHeader>
                <CardTitle>{isEditingConcert ? "공연 정보 수정" : "새 공연 등록"}</CardTitle>
                <CardDescription>
                  {isEditingConcert 
                    ? "선택한 공연의 정보를 수정합니다" 
                    : "새로운 공연 정보를 입력해주세요"}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleConcertSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">공연 제목 *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={concertForm.title}
                        onChange={handleConcertInputChange}
                        placeholder="공연 제목을 입력하세요"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="artist">아티스트/출연진 *</Label>
                      <Input
                        id="artist"
                        name="artist"
                        value={concertForm.artist}
                        onChange={handleConcertInputChange}
                        placeholder="아티스트 또는 출연진을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">공연 날짜 *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={concertForm.date}
                        onChange={handleConcertInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">공연 시간 *</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={concertForm.time}
                        onChange={handleConcertInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">카테고리</Label>
                      <Select 
                        value={concertForm.category} 
                        onValueChange={(value) => setConcertForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="콘서트">콘서트</SelectItem>
                          <SelectItem value="뮤지컬">뮤지컬</SelectItem>
                          <SelectItem value="연극">연극</SelectItem>
                          <SelectItem value="클래식">클래식</SelectItem>
                          <SelectItem value="전시">전시</SelectItem>
                          <SelectItem value="기타">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venue">공연장 *</Label>
                      <Input
                        id="venue"
                        name="venue"
                        value={concertForm.venue}
                        onChange={handleConcertInputChange}
                        placeholder="공연장 이름을 입력하세요"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">주소</Label>
                      <Input
                        id="address"
                        name="address"
                        value={concertForm.address}
                        onChange={handleConcertInputChange}
                        placeholder="공연장 주소를 입력하세요"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="posterImage">포스터 이미지 URL</Label>
                    <Input
                      id="posterImage"
                      name="posterImage"
                      value={concertForm.posterImage}
                      onChange={handleConcertInputChange}
                      placeholder="포스터 이미지 URL을 입력하세요"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">공연 설명</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={concertForm.description}
                      onChange={handleConcertInputChange}
                      placeholder="공연에 대한 설명을 입력하세요"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>좌석 가격 (원) *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="vip" className="text-sm">VIP석</Label>
                        <Input
                          id="vip"
                          name="vip"
                          type="number"
                          value={concertForm.price.vip}
                          onChange={handlePriceInputChange}
                          placeholder="VIP석 가격"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="r" className="text-sm">R석</Label>
                        <Input
                          id="r"
                          name="r"
                          type="number"
                          value={concertForm.price.r}
                          onChange={handlePriceInputChange}
                          placeholder="R석 가격"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="s" className="text-sm">S석</Label>
                        <Input
                          id="s"
                          name="s"
                          type="number"
                          value={concertForm.price.s}
                          onChange={handlePriceInputChange}
                          placeholder="S석 가격"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="a" className="text-sm">A석</Label>
                        <Input
                          id="a"
                          name="a"
                          type="number"
                          value={concertForm.price.a}
                          onChange={handlePriceInputChange}
                          placeholder="A석 가격"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="b" className="text-sm">B석</Label>
                        <Input
                          id="b"
                          name="b"
                          type="number"
                          value={concertForm.price.b}
                          onChange={handlePriceInputChange}
                          placeholder="B석 가격"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">공연 상태</Label>
                    <Select value={concertForm.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="공연 상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">예정됨</SelectItem>
                        <SelectItem value="ongoing">진행중</SelectItem>
                        <SelectItem value="completed">종료됨</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={cancelConcertForm}>
                    취소
                  </Button>
                  <Button type="submit">
                    {isEditingConcert ? "수정 완료" : "등록하기"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : isLoadingConcerts ? (
            <div className="text-center py-8">
              <p>공연 정보를 불러오는 중...</p>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">등록된 공연이 없습니다</p>
              <Button onClick={startAddConcert}>
                <Plus className="h-4 w-4 mr-2" />
                새 공연 등록하기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concerts.map((concert) => (
                <Card key={concert.id} className="overflow-hidden">
                  {concert.posterImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={concert.posterImage} 
                        alt={concert.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{concert.title}</CardTitle>
                    <CardDescription>{concert.artist}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{formatDate(concert.date)} {concert.time}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{concert.venue}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {concert.price.vip && `VIP ${concert.price.vip.toLocaleString()}원`}
                        {concert.price.r && `, R ${concert.price.r.toLocaleString()}원`}
                        {concert.price.s && `, S ${concert.price.s.toLocaleString()}원`}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {concert.status === "upcoming" && "예정됨"}
                        {concert.status === "ongoing" && "진행중"}
                        {concert.status === "completed" && "종료됨"}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => startEditConcert(concert)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteConcert(concert.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-6">
          <h2 className="text-2xl font-semibold mb-6">티켓 목록</h2>
          
          {isLoadingTickets ? (
            <div className="text-center py-8">
              <p>티켓 정보를 불러오는 중...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">등록된 티켓이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{ticket.title}</CardTitle>
                    <CardDescription>판매자 ID: {ticket.sellerId}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">좌석 등급</span>
                      <span>{ticket.grade}석</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">수량</span>
                      <span>{ticket.quantity}매</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">가격</span>
                      <span>{ticket.price.toLocaleString()}원</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">상태</span>
                      <span>
                        {ticket.status === "available" && "판매중"}
                        {ticket.status === "reserved" && "예약됨"}
                        {ticket.status === "sold" && "판매완료"}
                        {ticket.status === "cancelled" && "취소됨"}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => viewTicketDetail(ticket.id)}>
                      상세 보기
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

