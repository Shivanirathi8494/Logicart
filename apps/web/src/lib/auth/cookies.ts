import { cookies } from "next/headers";

const COOKIE_NAME = "logicarts_session";

export async function setSessionCookie(token: string) {

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

}

export async function getSessionCookie() {

  const cookieStore = await cookies();

  return cookieStore.get(COOKIE_NAME)?.value;

}

export async function deleteSessionCookie() {

  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);

}
