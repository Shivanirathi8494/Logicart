"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  trackingNumber: string;
  onPreview: () => void;
  onPrint: () => void;
  onNew: () => void;
  onClose: () => void;
};

export default function CreateSuccessDialog({
  open,
  trackingNumber,
  onPreview,
  onPrint,
  onNew,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg rounded-xl p-4 sm:p-6">

        <DialogHeader>

          <DialogTitle className="pr-6 text-xl text-emerald-600 sm:text-2xl">
            ✓ Docket Created Successfully
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <p className="text-sm text-slate-500">
              AWB Number
            </p>

            <h2 className="break-all text-2xl font-bold text-[#0b2340] sm:text-3xl">
              {trackingNumber}
            </h2>

          </div>

          <div className="grid gap-3">

            <button
              onClick={onPreview}
              className="min-h-11 w-full rounded-lg bg-[#0b2340] px-4 py-3 font-semibold text-white"
            >
              Preview Air Waybill
            </button>

            <button
              onClick={onPrint}
              className="min-h-11 w-full rounded-lg border px-4 py-3 font-semibold"
            >
              Print
            </button>

            <button
              onClick={onNew}
              className="min-h-11 w-full rounded-lg border px-4 py-3 font-semibold"
            >
              Create New Docket
            </button>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}
