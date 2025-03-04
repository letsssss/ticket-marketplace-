import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: 사용자 조회
export async function GET(request: NextRequest) {
  try {
    // 이메일로 사용자 조회 (쿼리 파라미터 사용)
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    if (email) {
      console.log("이메일로 사용자 조회:", email)
      // 특정 이메일로 사용자 조회
      const user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (user) {
        // 사용자가 존재하면 비밀번호를 제외하고 반환
        const { password, ...userWithoutPassword } = user
        return NextResponse.json({ exists: true, user: userWithoutPassword })
      } else {
        // 사용자가 존재하지 않으면 false 반환
        return NextResponse.json({ exists: false })
      }
    }
    
    // 모든 사용자 조회 (비밀번호 제외)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    console.error("사용자 조회 오류:", error)
    return NextResponse.json(
      { error: "사용자 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST: 사용자 등록 (회원가입)
export async function POST(request: NextRequest) {
  try {
    const newUser = await request.json()
    
    console.log("회원가입 요청 데이터:", { email: newUser.email })
    
    // 필수 필드 검증
    if (!newUser.email || !newUser.password || !newUser.username) {
      console.log("필수 필드 누락:", { 
        email: !!newUser.email, 
        password: !!newUser.password,
        username: !!newUser.username
      })
      return NextResponse.json(
        { error: "이메일, 비밀번호, 사용자 이름은 필수 입력 항목입니다." },
        { status: 400 }
      )
    }
    
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      console.log("이메일 형식 오류:", newUser.email)
      return NextResponse.json(
        { error: "유효한 이메일 주소를 입력해주세요." },
        { status: 400 }
      )
    }
    
    // 이메일 중복 검사
    const existingUser = await prisma.user.findUnique({
      where: { email: newUser.email }
    })
    
    if (existingUser) {
      console.log("이메일 중복 발견:", { existingEmail: existingUser.email, newEmail: newUser.email })
      return NextResponse.json(
        { error: "이미 사용 중인 이메일 주소입니다." },
        { status: 409 }
      )
    }
    
    // 사용자 추가
    const user = await prisma.user.create({
      data: {
        email: newUser.email,
        password: newUser.password, // 실제 구현에서는 비밀번호 해싱 필요
        username: newUser.username
      }
    })
    
    console.log("새 사용자 등록 완료:", { email: user.email, id: user.id })
    
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("사용자 등록 오류:", error)
    return NextResponse.json(
      { error: "사용자 등록 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// PUT: 사용자 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      )
    }
    
    const userId = parseInt(data.id.toString())
    
    // 사용자 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }
    
    // 이메일 변경 시 중복 검사
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: "이미 사용 중인 이메일 주소입니다." },
          { status: 409 }
        )
      }
    }
    
    // 비밀번호 필드 제외 (별도 API로 처리하는 것이 좋음)
    const { id, password, ...updateData } = data
    
    // 사용자 정보 수정
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("사용자 정보 수정 오류:", error)
    return NextResponse.json(
      { error: "사용자 정보 수정 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE: 사용자 삭제
export async function DELETE(request: NextRequest) {
  try {
    const data = await request.json()
    
    // ID 검증
    if (!data.id) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      )
    }
    
    const userId = parseInt(data.id.toString())
    
    // 사용자 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }
    
    // 사용자 삭제
    await prisma.user.delete({
      where: { id: userId }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("사용자 삭제 오류:", error)
    return NextResponse.json(
      { error: "사용자 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

