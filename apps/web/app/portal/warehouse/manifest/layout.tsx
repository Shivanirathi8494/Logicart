import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/authorization";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user =
    await getCurrentUser();

  const allowed = [
    "ADMIN",
    "EMPLOYEE",
    "WAREHOUSE",
  ];

  if (
    !user ||
    !allowed.includes(
      user.role
    )
  ) {
    redirect(
      "/portal/dashboard"
    );
  }

  return children;
}
