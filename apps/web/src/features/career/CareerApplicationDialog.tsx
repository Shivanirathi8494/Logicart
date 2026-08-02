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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Apply for {category}
            </DialogTitle>

            <DialogDescription>
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label>Full Name *</Label>
              <Input
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Phone *</Label>
              <Input
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div>
              <Label>City *</Label>
              <Input
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>

            <div>
              <Label>State</Label>
              <Input
                onChange={(e) => handleChange("state", e.target.value)}
              />
            </div>

            <div>
              <Label>Company</Label>
              <Input
                onChange={(e) => handleChange("company", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.name}>
                <Label>{field.label}</Label>

                <Input
                  type={field.type}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Label>Message</Label>

            <Textarea
              rows={5}
              onChange={(e) =>
                handleChange("message", e.target.value)
              }
            />
          </div>

          {config.requiresResume && (
            <div className="mt-6">
              <Label>Resume</Label>
              <Input type="file" />
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              Submit Application
            </Button>
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
