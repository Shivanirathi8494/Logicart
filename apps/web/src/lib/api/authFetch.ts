export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  const response = await fetch(
    input,
    init,
  );

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      const redirect =
        encodeURIComponent(
          window.location.pathname +
          window.location.search
        );

      window.location.href =
        `/login?expired=1&redirect=${redirect}`;
    }

    throw new Error(
      "SESSION_EXPIRED"
    );
  }

  return response;
}
