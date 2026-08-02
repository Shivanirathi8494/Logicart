"use client";

import { useState } from "react";

import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

import CareerApplicationDialog from "@/features/career/CareerApplicationDialog";
import { CareerCategory } from "@/features/career/categoryConfig";

const categories: {
  title: CareerCategory;
  description: string;
}[] = [
  {
    title: "Delivery Partner",
    description: "Join our last-mile delivery network.",
  },
  {
    title: "Fleet Owner",
    description: "Partner your fleet with Logicarts.",
  },
  {
    title: "Franchise Partner",
    description: "Expand our network in your region.",
  },
  {
    title: "Warehouse Partner",
    description: "Provide warehouse and fulfillment support.",
  },
  {
    title: "Transport Vendor",
    description: "Support nationwide transportation services.",
  },
  {
    title: "Sales Associate",
    description: "Grow your career with our sales team.",
  },
];

export default function CareerPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CareerCategory | null>(null);

  return (
    <>
      <PageHero
        title="Careers"
        subtitle="Join Logicarts and grow with one of India's expanding logistics networks."
      />

      <PageContainer>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-2xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                {category.title}
              </h2>

              <p className="mt-4 text-gray-600">
                {category.description}
              </p>

              <Button
                className="mt-8 w-full"
                onClick={() => setSelectedCategory(category.title)}
              >
                Apply Now
              </Button>
            </div>
          ))}

        </div>

      </PageContainer>

      {selectedCategory && (
        <CareerApplicationDialog
          open={true}
          category={selectedCategory}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedCategory(null);
            }
          }}
        />
      )}
    </>
  );
}
