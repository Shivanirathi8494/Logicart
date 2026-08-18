import { Suspense } from "react";

import ApprovalClient from "@/features/onboarding/ApprovalClient";

export default function ApprovalPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 p-10">
          Loading approval request...
        </main>
      }
    >
      <ApprovalClient />
    </Suspense>
  );
}
