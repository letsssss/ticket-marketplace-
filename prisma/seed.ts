import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 사용자 데이터 추가
  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      password: 'password1',
      username: '홍길동',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      password: 'password2',
      username: '김철수',
    },
  })

  console.log('사용자 데이터가 추가되었습니다:')
  console.log({ user1, user2 })

  // 콘서트 데이터 추가
  const concert1 = await prisma.concert.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: '2023 여름 페스티벌',
      artist: '다양한 아티스트',
      date: '2023-07-15',
      time: '18:00',
      venue: '올림픽 공원',
      address: '서울특별시 송파구 올림픽로 424',
      description: '올 여름 최고의 페스티벌! 국내 최고 아티스트들이 총출동합니다.',
      category: '페스티벌',
      price: '{"VIP": 150000, "R": 120000, "S": 90000}',
      status: 'upcoming',
    },
  })

  const concert2 = await prisma.concert.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: '클래식 오케스트라 공연',
      artist: '서울 필하모닉',
      date: '2023-08-20',
      time: '19:30',
      venue: '예술의전당',
      address: '서울특별시 서초구 남부순환로 2406',
      description: '베토벤, 모차르트 등 클래식 명곡을 한자리에서 감상하세요.',
      category: '클래식',
      price: '{"VIP": 100000, "R": 80000, "S": 60000, "A": 40000}',
      status: 'upcoming',
    },
  })

  console.log('콘서트 데이터가 추가되었습니다:')
  console.log({ concert1, concert2 })

  // 티켓 데이터 추가
  const ticket1 = await prisma.ticket.upsert({
    where: { id: 1 },
    update: {},
    create: {
      concertId: 1,
      sellerId: 1,
      title: '2023 여름 페스티벌 VIP 티켓',
      price: 140000,
      originalPrice: 150000,
      quantity: 2,
      grade: 'VIP',
      section: 'A',
      row: '1',
      seatNumber: '15-16',
      isConsecutiveSeats: true,
      description: 'VIP 구역 연석 2장입니다. 급하게 팝니다.',
      status: 'available',
    },
  })

  const ticket2 = await prisma.ticket.upsert({
    where: { id: 2 },
    update: {},
    create: {
      concertId: 2,
      sellerId: 2,
      title: '클래식 오케스트라 R석 티켓',
      price: 75000,
      originalPrice: 80000,
      quantity: 1,
      grade: 'R',
      section: 'B',
      row: '5',
      seatNumber: '23',
      isConsecutiveSeats: false,
      description: '일정이 겹쳐서 판매합니다. 좋은 자리입니다.',
      status: 'available',
    },
  })

  console.log('티켓 데이터가 추가되었습니다:')
  console.log({ ticket1, ticket2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 