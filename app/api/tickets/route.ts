import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: 티켓 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const concertId = searchParams.get("concertId")
    const sellerId = searchParams.get("sellerId")
    const status = searchParams.get("status")
    const grade = searchParams.get("grade")
    const query = searchParams.get("query")

    // ID로 특정 티켓 조회
    if (id) {
      const ticketId = parseInt(id)
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { concert: true }
      })

      if (!ticket) {
        return NextResponse.json(
          { error: "티켓을 찾을 수 없습니다" },
          { status: 404 }
        )
      }

      return NextResponse.json(ticket)
    }

    // 필터링 조건 설정
    let whereClause: any = {}

    if (concertId) {
      whereClause.concertId = parseInt(concertId)
    }

    if (sellerId) {
      whereClause.sellerId = parseInt(sellerId)
    }

    if (status) {
      whereClause.status = status
    }

    if (grade) {
      whereClause.grade = grade
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // 티켓 목록 조회
    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: { concert: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("티켓 조회 오류:", error)
    return NextResponse.json(
      { error: "티켓 정보를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST: 티켓 등록
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 필수 필드 검증
    if (!data.concertId || !data.sellerId || !data.title || !data.price || !data.quantity || !data.grade) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다" },
        { status: 400 }
      )
    }

    // 공연 존재 여부 확인
    const concert = await prisma.concert.findUnique({
      where: { id: parseInt(data.concertId.toString()) }
    })

    if (!concert) {
      return NextResponse.json(
        { error: "해당 공연을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 티켓 등록
    const ticket = await prisma.ticket.create({
      data: {
        concertId: parseInt(data.concertId.toString()),
        sellerId: parseInt(data.sellerId.toString()),
        title: data.title,
        price: parseInt(data.price.toString()),
        originalPrice: parseInt(data.originalPrice?.toString() || data.price.toString()),
        quantity: parseInt(data.quantity.toString()),
        grade: data.grade,
        section: data.section || null,
        row: data.row || null,
        seatNumber: data.seatNumber || null,
        isConsecutiveSeats: data.isConsecutiveSeats || false,
        description: data.description || null,
        status: data.status || "available"
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error("티켓 등록 오류:", error)
    return NextResponse.json(
      { error: "티켓 등록에 실패했습니다" },
      { status: 500 }
    )
  }
}

// PUT: 티켓 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "티켓 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const ticketId = parseInt(data.id.toString())

    // 티켓 존재 여부 확인
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { error: "티켓을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 판매자 확인 (본인 티켓만 수정 가능)
    if (data.sellerId && existingTicket.sellerId !== parseInt(data.sellerId.toString())) {
      return NextResponse.json(
        { error: "본인의 티켓만 수정할 수 있습니다" },
        { status: 403 }
      )
    }

    // ID 제외한 데이터 추출
    const { id, ...updateData } = data

    // 티켓 정보 수정
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("티켓 수정 오류:", error)
    return NextResponse.json(
      { error: "티켓 정보 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

// DELETE: 티켓 삭제
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()

    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "티켓 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const ticketId = parseInt(data.id.toString())

    // 티켓 존재 여부 확인
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId }
    })

    if (!existingTicket) {
      return NextResponse.json(
        { error: "티켓을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 판매자 확인 (본인 티켓만 삭제 가능)
    if (data.sellerId && existingTicket.sellerId !== parseInt(data.sellerId.toString())) {
      return NextResponse.json(
        { error: "본인의 티켓만 삭제할 수 있습니다" },
        { status: 403 }
      )
    }

    // 티켓 삭제
    await prisma.ticket.delete({
      where: { id: ticketId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("티켓 삭제 오류:", error)
    return NextResponse.json(
      { error: "티켓 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}

