"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CircleCheckBig } from "lucide-react";

interface Props {
  open: boolean;
  referenceId: string;
  onClose: () => void;
}

export default function CareerSuccessDialog({
  open,
  referenceId,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">

        <div className="flex flex-col items-center text-center">

          <CircleCheckBig
            className="mb-5 text-green-600"
            size={72}
          />

          <DialogHeader>

            <DialogTitle className="text-2xl">
              Application Submitted
            </DialogTitle>

          </DialogHeader>

          <p className="mt-4 text-gray-600">
            Thank you for your interest in Logicarts.
          </p>

          <div className="mt-6 w-full rounded-xl bg-slate-100 p-4">

            <p className="text-sm text-gray-500">
              Reference ID
            </p>

            <p className="mt-1 text-lg font-bold text-[#1877F2]">
              {referenceId}
            </p>

          </div>

          <p className="mt-6 text-sm text-gray-500">
            Our recruitment team will review your
            application and contact you if your
            profile matches our current openings.
          </p>

          <Button
            className="mt-8 w-full"
            onClick={onClose}
          >
            Close
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}
