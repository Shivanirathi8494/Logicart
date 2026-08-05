import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {

  const session =
    request.cookies.get("logicarts_session");

  if (
    request.nextUrl.pathname.startsWith("/portal") &&
    !session
  ) {

    return NextResponse.redirect(
      new URL("/login", request.url),
    );

  }

  return NextResponse.next();

}

export const config = {

  matcher: [

    "/portal/:path*",

  ],

};
