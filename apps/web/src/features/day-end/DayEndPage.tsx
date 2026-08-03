"use client";

import { useEffect, useState } from "react";

import DaySummary from "./components/DaySummary";
import CloseDayButton from "./components/CloseDayButton";

export default function DayEndPage() {

  const [summary, setSummary] = useState<any>();

  useEffect(() => {
    load();
  }, []);

  async function load() {

    const response = await fetch("/api/day-end");

    const data = await response.json();

    setSummary(data);

  }

  if (!summary) {

    return (
      <div className="p-10">
        Loading Day End Summary...
      </div>
    );

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Day End Closing
        </h1>

        <p className="mt-2 text-slate-500">
          Verify operational summary and close today's business.
        </p>

      </div>

      <DaySummary summary={summary} />

      <CloseDayButton summary={summary} />

    </div>

  );

}
