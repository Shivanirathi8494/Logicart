"use client";

import { useEffect, useState } from "react";

interface DashboardStats {
  clients: number;
  shipmentsDelivered: number;
  citiesConnected: number;
  support: string;
}

export default function Stats() {
  const [stats, setStats] = useState<DashboardStats>({
    clients: 0,
    shipmentsDelivered: 0,
    citiesConnected: 0,
    support: "24×7 Customer Support",
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      value: `${stats.clients}+`,
      label: "Our Clients",
    },
    {
      value: `${stats.shipmentsDelivered}+`,
      label: "Shipments Delivered",
    },
    {
      value: `${stats.citiesConnected}+`,
      label: "Cities Connected",
    },
    {
      value: "24×7",
      label: stats.support,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-6 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm"
          >
            <div className="absolute left-1/2 top-0 h-1.5 w-14 -translate-x-1/2 rounded-b-full bg-[#ff7417]" />

            <h2 className="text-center text-4xl font-black tracking-tight text-[#0b2340] sm:text-5xl">
              {card.value}
            </h2>

            <p className="mt-3 text-center text-sm font-medium text-slate-500 sm:text-base">
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
