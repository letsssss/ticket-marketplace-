import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: 공연 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const query = searchParams.get("query")

    // ID로 특정 공연 조회
    if (id) {
      const concertId = parseInt(id)
      const concert = await prisma.concert.findUnique({
        where: { id: concertId }
      })

      if (!concert) {
        return NextResponse.json(
          { error: "공연을 찾을 수 없습니다" },
          { status: 404 }
        )
      }

      // price를 JSON으로 파싱하여 반환
      return NextResponse.json({
        ...concert,
        price: JSON.parse(concert.price)
      })
    }

    // 필터링 조건 설정
    let whereClause: any = {}

    if (category) {
      whereClause.category = category
    }

    if (status) {
      whereClause.status = status
    }

    if (query) {
      whereClause.OR = [
        { title: { contains: query } },
        { artist: { contains: query } },
        { venue: { contains: query } }
      ]
    }

    // 공연 목록 조회
    const concerts = await prisma.concert.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    })

    // 각 공연의 price를 JSON으로 파싱
    const concertsWithParsedPrice = concerts.map(concert => ({
      ...concert,
      price: JSON.parse(concert.price)
    }))

    return NextResponse.json(concertsWithParsedPrice)
  } catch (error) {
    console.error("공연 정보 조회 오류:", error)
    return NextResponse.json(
      { error: "공연 정보를 가져오는데 실패했습니다" },
      { status: 500 }
    )
  }
}

// POST: 공연 정보 추가
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 필수 필드 검증
    if (!data.title || !data.artist || !data.date || !data.venue) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다" },
        { status: 400 }
      )
    }

    // 공연 정보 추가
    const concert = await prisma.concert.create({
      data: {
        title: data.title,
        artist: data.artist,
        date: data.date,
        time: data.time || "",
        venue: data.venue,
        address: data.address || "",
        posterImage: data.posterImage || "",
        description: data.description || "",
        category: data.category || "",
        price: JSON.stringify(data.price || {}),
        seatMap: data.seatMap || "",
        status: data.status || "upcoming"
      }
    })

    // 응답 시 price를 다시 JSON으로 파싱
    return NextResponse.json({
      ...concert,
      price: JSON.parse(concert.price)
    }, { status: 201 })
  } catch (error) {
    console.error("공연 정보 추가 오류:", error)
    return NextResponse.json(
      { error: "공연 정보 추가에 실패했습니다" },
      { status: 500 }
    )
  }
}

// PUT: 공연 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "공연 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const concertId = parseInt(data.id.toString())

    // 공연 존재 여부 확인
    const existingConcert = await prisma.concert.findUnique({
      where: { id: concertId }
    })

    if (!existingConcert) {
      return NextResponse.json(
        { error: "공연을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // ID 제외한 데이터 추출
    const { id, price, ...updateData } = data

    // 공연 정보 수정
    const updatedConcert = await prisma.concert.update({
      where: { id: concertId },
      data: {
        ...updateData,
        price: price ? JSON.stringify(price) : existingConcert.price
      }
    })

    // 응답 시 price를 다시 JSON으로 파싱
    return NextResponse.json({
      ...updatedConcert,
      price: JSON.parse(updatedConcert.price)
    })
  } catch (error) {
    console.error("공연 정보 수정 오류:", error)
    return NextResponse.json(
      { error: "공연 정보 수정에 실패했습니다" },
      { status: 500 }
    )
  }
}

// DELETE: 공연 정보 삭제
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()

    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "공연 ID가 필요합니다" },
        { status: 400 }
      )
    }

    const concertId = parseInt(data.id.toString())

    // 공연 존재 여부 확인
    const existingConcert = await prisma.concert.findUnique({
      where: { id: concertId }
    })

    if (!existingConcert) {
      return NextResponse.json(
        { error: "공연을 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    // 공연 정보 삭제
    await prisma.concert.delete({
      where: { id: concertId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("공연 정보 삭제 오류:", error)
    return NextResponse.json(
      { error: "공연 정보 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
} 