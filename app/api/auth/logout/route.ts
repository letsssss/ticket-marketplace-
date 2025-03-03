import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // 인증 쿠키 삭제
    cookies().delete("auth-token")
    
    return NextResponse.json({ success: true, message: "로그아웃되었습니다." })
  } catch (error) {
    console.error("로그아웃 오류:", error)
    return NextResponse.json(
      { success: false, message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

