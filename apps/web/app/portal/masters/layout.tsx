import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/authorization";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user =
    await getCurrentUser();

  if (
    !user ||
    user.role !== "ADMIN"
  ) {
    redirect(
      "/portal/dashboard"
    );
  }

  return children;
}
