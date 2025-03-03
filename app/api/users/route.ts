import { NextResponse } from "next/server"
import { users } from "./data"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 이메일로 사용자 조회 (쿼리 파라미터 사용)
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    
    if (email) {
      console.log("이메일로 사용자 조회:", email)
      // 특정 이메일로 사용자 조회
      const user = users.find(u => u.email === email)
      
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
    return NextResponse.json(users.map(({ password, ...user }) => user))
  } catch (error) {
    console.error("사용자 조회 오류:", error)
    return NextResponse.json(
      { error: "사용자 조회 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json()
    
    console.log("회원가입 요청 데이터:", { email: newUser.email })
    
    // 필수 필드 검증
    if (!newUser.email || !newUser.password) {
      console.log("필수 필드 누락:", { email: !!newUser.email, password: !!newUser.password })
      return NextResponse.json(
        { error: "이메일과 비밀번호는 필수 입력 항목입니다." },
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
    console.log("현재 등록된 사용자:", users.map(u => ({ id: u.id, email: u.email })))
    const existingUser = users.find(user => user.email === newUser.email)
    
    if (existingUser) {
      console.log("이메일 중복 발견:", { existingUser: existingUser.email, newEmail: newUser.email })
      return NextResponse.json(
        { error: "이미 사용 중인 이메일 주소입니다." },
        { status: 409 }
      )
    }
    
    // 사용자 추가
    newUser.id = users.length + 1
    users.push(newUser)
    
    console.log("새 사용자 등록 완료:", { email: newUser.email, id: newUser.id })
    console.log("현재 등록된 사용자 수:", users.length)
    
    const { password, ...userWithoutPassword } = newUser
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error("사용자 등록 오류:", error)
    return NextResponse.json(
      { error: "사용자 등록 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const updatedUser = await request.json()
  const index = users.findIndex((u) => u.id === updatedUser.id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser }
    const { password, ...userWithoutPassword } = users[index]
    return NextResponse.json(userWithoutPassword)
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users.splice(index, 1)
    return NextResponse.json({ message: "User deleted successfully" })
  }
  return NextResponse.json({ error: "User not found" }, { status: 404 })
}

