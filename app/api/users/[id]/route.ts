import { NextResponse } from "next/server"
import { users } from "../data"

// 특정 사용자 정보 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const user = users.find((u) => u.id === userId)
    
    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      )
    }
    
    // 비밀번호 제외하고 사용자 정보 반환
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("사용자 조회 오류:", error)
    return NextResponse.json(
      { error: "사용자 조회 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// 사용자 정보 업데이트
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const userData = await request.json()
    
    // 사용자 존재 여부 확인
    const userIndex = users.findIndex((u) => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      )
    }
    
    const user = users[userIndex]
    
    // 비밀번호 변경 요청인 경우
    if (userData.currentPassword && userData.newPassword) {
      // 현재 비밀번호 확인
      if (user.password !== userData.currentPassword) {
        return NextResponse.json(
          { error: "현재 비밀번호가 일치하지 않습니다" },
          { status: 400 }
        )
      }
      
      // 비밀번호 업데이트
      user.password = userData.newPassword
    }
    
    // 사용자 이름 업데이트
    if (userData.username) {
      user.username = userData.username
    }
    
    // 업데이트된 사용자 정보 저장
    users[userIndex] = user
    
    // 비밀번호 제외하고 응답
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("사용자 업데이트 오류:", error)
    return NextResponse.json(
      { error: "사용자 정보 업데이트 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

// 사용자 삭제
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id)
    const userIndex = users.findIndex((u) => u.id === userId)
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다" },
        { status: 404 }
      )
    }
    
    // 사용자 삭제
    users.splice(userIndex, 1)
    
    return NextResponse.json({ message: "사용자가 성공적으로 삭제되었습니다" })
  } catch (error) {
    console.error("사용자 삭제 오류:", error)
    return NextResponse.json(
      { error: "사용자 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    )
  }
} 