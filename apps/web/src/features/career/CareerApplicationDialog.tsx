"use client";

import { useState } from "react";
import CareerSuccessDialog from "./CareerSuccessDialog";
import { CAREER_CATEGORIES, CareerCategory } from "./categoryConfig";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CareerCategory;
}

export default function CareerApplicationDialog({
  open,
  onOpenChange,
  category,
}: Props) {
  const config = CAREER_CATEGORIES.find(
    (item) => item.title === category
  );

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  if (!config) return null;

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setReferenceId(result.referenceId);
        setFormData({});
        setSuccessOpen(true);
      } else {
        alert(result.error || "Submission failed.");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
        className="
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          p-8
        "
      >
          <DialogHeader>
            <DialogDescription>
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Applicant Information
                </h3>

                <p className="text-sm text-slate-500">
                  Please provide your contact information.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name *
              </Label>
              <Input
                className="h-11"
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                Email *
              </Label>
              <Input
                className="h-11"
                type="email"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone *
              </Label>
              <Input
                className="h-11"
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                City *
              </Label>
              <Input
                className="h-11"
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                State
              </Label>
              <Input
                className="h-11"
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold text-slate-700">
                Company
              </Label>
              <Input
                className="h-11"
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            <section className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {category === "Fleet Owner" && "Fleet Information"}
                  {category === "Delivery Partner" && "Driver Information"}
                  {category === "Warehouse Partner" && "Warehouse Details"}
                  {category === "Transport Vendor" && "Transport Details"}
                  {category === "Franchise Partner" && "Franchise Details"}
                  {category === "Sales Associate" && "Professional Details"}
                </h3>

                <p className="text-sm text-slate-500">
                  Provide category specific information.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.name}>
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  {field.label}
                </Label>

                <Input
                  className="h-11"
                  type={field.type}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-semibold">
                Additional Information
              </h3>

              <div className="space-y-2">
                <Label className="block text-sm font-semibold text-slate-700">
                  Message
                </Label>

                <Textarea
                  className="resize-none"
                  rows={5}
                  onChange={(e) =>
                    handleChange("message", e.target.value)
                  }
                />
              </div>
            </section>

            {config.requiresResume && (
              <section className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Resume
                </h3>

                <div className="space-y-2">
                  <Label className="block">
                    Upload Resume
                  </Label>
                  <Input className="h-11" type="file" />
                </div>
              </section>
            )}

            <div className="mt-8 flex justify-end gap-3 border-t pt-6">
            <Button
              variant="outline"
              className="px-8"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              className="bg-[#1877F2] px-8"
              onClick={handleSubmit}
            >
              Submit Application
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>

      <CareerSuccessDialog
        open={successOpen}
        referenceId={referenceId}
        onClose={() => {
          setSuccessOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}
