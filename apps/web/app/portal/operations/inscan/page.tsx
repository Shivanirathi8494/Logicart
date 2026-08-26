import { Suspense } from "react";

import InscanClient from "./InscanClient";

export default function Page() {
  return (
    <Suspense fallback={<InscanLoading />}>
      <InscanClient />
    </Suspense>
  );
}

function InscanLoading() {
  return <div className="p-6 text-sm text-slate-500">Loading shipment...</div>;
}
