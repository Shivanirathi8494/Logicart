import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/auth";

export async function POST(request: NextRequest) {
  try {

    const { username, password } = await request.json();

    const result = await authenticate(username, password);

    if (!result) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        username: result.user.username,
        fullName: result.user.fullName,
        role: result.user.role,
      },
    });

    response.cookies.set("logicarts_session", result.session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error: any) {

    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }
}
