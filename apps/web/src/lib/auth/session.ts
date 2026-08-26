import { randomUUID } from "crypto";

export const SESSION_DURATION_MINUTES = 30;

export const SESSION_MAX_AGE_SECONDS =
  SESSION_DURATION_MINUTES * 60;

export function generateSessionToken() {
  return randomUUID();
}

export function sessionExpiryDate(
  from = new Date()
) {
  return new Date(
    from.getTime() +
      SESSION_DURATION_MINUTES *
        60 *
        1000
  );
}
