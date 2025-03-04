// 공연 정보 데이터베이스
// 실제 구현에서는 데이터베이스를 사용해야 합니다.

export type Concert = {
  id: number
  title: string
  artist: string
  date: string
  time: string
  venue: string
  address: string
  posterImage: string
  description: string
  category: string
  price: {
    vip?: number
    r?: number
    s?: number
    a?: number
    b?: number
  }
  seatMap?: string
  status: 'upcoming' | 'ongoing' | 'completed'
  createdAt: string
}

export const concerts: Concert[] = [
  {
    id: 1,
    title: "세븐틴 콘서트: FOLLOW AGAIN",
    artist: "세븐틴",
    date: "2024-03-20",
    time: "18:00",
    venue: "잠실종합운동장 주경기장",
    address: "서울특별시 송파구 올림픽로 25",
    posterImage: "/images/concerts/seventeen.jpg",
    description: "세븐틴의 새 앨범 'FOLLOW' 발매를 기념한 단독 콘서트입니다. 화려한 퍼포먼스와 함께 신곡 무대를 최초로 선보입니다.",
    category: "K-POP",
    price: {
      vip: 165000,
      r: 145000,
      s: 125000,
      a: 99000
    },
    seatMap: "/images/seatmaps/jamsil-stadium.jpg",
    status: "upcoming",
    createdAt: "2023-12-15"
  },
  {
    id: 2,
    title: "데이식스 전국투어: 'Every Day6'",
    artist: "데이식스",
    date: "2024-04-15",
    time: "19:00",
    venue: "올림픽공원 올림픽홀",
    address: "서울특별시 송파구 올림픽로 424",
    posterImage: "/images/concerts/day6.jpg",
    description: "데이식스의 전국투어 콘서트로, 밴드의 모든 히트곡을 라이브로 즐길 수 있는 공연입니다.",
    category: "밴드",
    price: {
      r: 110000,
      s: 99000,
      a: 88000
    },
    seatMap: "/images/seatmaps/olympic-hall.jpg",
    status: "upcoming",
    createdAt: "2023-12-20"
  },
  {
    id: 3,
    title: "아이유 콘서트: 'The Golden Hour'",
    artist: "아이유",
    date: "2024-05-01",
    time: "19:30",
    venue: "올림픽공원 체조경기장",
    address: "서울특별시 송파구 올림픽로 424",
    posterImage: "/images/concerts/iu.jpg",
    description: "아이유의 새 앨범 발매 기념 단독 콘서트로, 감미로운 목소리와 함께하는 특별한 밤을 선사합니다.",
    category: "K-POP",
    price: {
      vip: 154000,
      r: 132000,
      s: 110000,
      a: 88000
    },
    seatMap: "/images/seatmaps/kspo-dome.jpg",
    status: "upcoming",
    createdAt: "2024-01-05"
  },
  {
    id: 4,
    title: "블랙핑크 인 유어 에어리어",
    artist: "블랙핑크",
    date: "2024-06-10",
    time: "18:30",
    venue: "고척스카이돔",
    address: "서울특별시 구로구 경인로 430",
    posterImage: "/images/concerts/blackpink.jpg",
    description: "블랙핑크의 월드투어 서울 공연으로, 화려한 퍼포먼스와 함께 글로벌 히트곡을 만나볼 수 있습니다.",
    category: "K-POP",
    price: {
      vip: 165000,
      r: 145000,
      s: 125000,
      a: 99000
    },
    seatMap: "/images/seatmaps/gocheok-dome.jpg",
    status: "upcoming",
    createdAt: "2024-01-10"
  },
  {
    id: 5,
    title: "뮤지컬 '웃는 남자'",
    artist: "클라이브 오웬, 박효신 등",
    date: "2024-03-15",
    time: "19:00",
    venue: "블루스퀘어 신한카드홀",
    address: "서울특별시 용산구 이태원로 294",
    posterImage: "/images/concerts/laughing-man.jpg",
    description: "빅토르 위고의 동명 소설을 원작으로 한 뮤지컬로, 프랑스 혁명 시대를 배경으로 한 감동적인 이야기를 담고 있습니다.",
    category: "뮤지컬",
    price: {
      vip: 140000,
      r: 120000,
      s: 100000,
      a: 80000
    },
    seatMap: "/images/seatmaps/blue-square.jpg",
    status: "ongoing",
    createdAt: "2023-11-20"
  }
] 