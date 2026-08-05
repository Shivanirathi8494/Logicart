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

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.label}
            className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >

            <h2 className="text-5xl font-bold text-[#1877F2]">

              {card.value}

            </h2>

            <p className="mt-3 text-gray-500">

              {card.label}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}
