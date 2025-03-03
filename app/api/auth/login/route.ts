import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// 임시 사용자 데이터베이스 (app/api/users/route.ts와 공유)
// 실제 구현에서는 데이터베이스에서 사용자를 확인해야 합니다.
import { users } from "../../users/data"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      )
    }

    // 사용자 인증
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      // 실제 구현에서는 JWT 토큰을 생성하고 안전하게 저장해야 합니다.
      const token = `fake-jwt-token-${user.id}`

      // 쿠키에 토큰 저장
      cookies().set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1시간
        path: "/",
      })

      // 비밀번호를 제외한 사용자 정보 반환
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({ 
        success: true, 
        user: userWithoutPassword
      })
    } else {
      return NextResponse.json(
        { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("로그인 오류:", error)
    return NextResponse.json(
      { success: false, message: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

