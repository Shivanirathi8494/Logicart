import { randomUUID } from "crypto";

export function generateSessionToken() {
  return randomUUID();
}

export function sessionExpiryDate() {
  const expires = new Date();

  expires.setDate(expires.getDate() + 7);

  return expires;
}
