// 티켓 데이터베이스
// 실제 구현에서는 데이터베이스를 사용해야 합니다.

export type TicketGrade = 'VIP' | 'R' | 'S' | 'A' | 'B'

export type TicketStatus = 'available' | 'reserved' | 'sold' | 'cancelled'

export type Ticket = {
  id: number
  concertId: number
  sellerId: number
  title: string
  price: number
  originalPrice: number
  quantity: number
  grade: TicketGrade
  section?: string
  row?: string
  seatNumber?: string
  isConsecutiveSeats: boolean
  description?: string
  status: TicketStatus
  createdAt: string
  updatedAt: string
}

export const tickets: Ticket[] = [
  {
    id: 1,
    concertId: 1,
    sellerId: 2,
    title: "세븐틴 콘서트 VIP석 1장",
    price: 180000,
    originalPrice: 165000,
    quantity: 1,
    grade: "VIP",
    section: "VIP 스탠딩",
    row: "",
    seatNumber: "",
    isConsecutiveSeats: false,
    description: "개인 사정으로 인해 판매합니다. 티켓은 공연 1주일 전에 발송 가능합니다.",
    status: "available",
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15"
  },
  {
    id: 2,
    concertId: 2,
    sellerId: 1,
    title: "데이식스 전국투어 R석 2장",
    price: 99000,
    originalPrice: 99000,
    quantity: 2,
    grade: "R",
    section: "1층",
    row: "C",
    seatNumber: "15, 16",
    isConsecutiveSeats: true,
    description: "일정이 겹쳐서 판매합니다. 정가에 판매합니다.",
    status: "available",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10"
  },
  {
    id: 3,
    concertId: 3,
    sellerId: 2,
    title: "아이유 콘서트 S석 1장",
    price: 120000,
    originalPrice: 110000,
    quantity: 1,
    grade: "S",
    section: "2층",
    row: "A",
    seatNumber: "7",
    isConsecutiveSeats: false,
    description: "시야 좋은 자리입니다. 직거래 가능합니다.",
    status: "available",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20"
  },
  {
    id: 4,
    concertId: 5,
    sellerId: 1,
    title: "뮤지컬 웃는 남자 VIP석 2장",
    price: 130000,
    originalPrice: 140000,
    quantity: 2,
    grade: "VIP",
    section: "1층",
    row: "D",
    seatNumber: "10, 11",
    isConsecutiveSeats: true,
    description: "급하게 판매합니다. 정가보다 저렴하게 드립니다.",
    status: "available",
    createdAt: "2024-02-25",
    updatedAt: "2024-02-25"
  }
] 