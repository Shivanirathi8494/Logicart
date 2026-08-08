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

      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle className="text-2xl text-green-600">
            ✓ Docket Created Successfully
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <p className="text-sm text-slate-500">
              AWB Number
            </p>

            <h2 className="text-3xl font-bold">
              {trackingNumber}
            </h2>

          </div>

          <div className="grid gap-3">

            <button
              onClick={onPreview}
              className="rounded-lg bg-slate-900 py-3 text-white"
            >
              Preview Air Waybill
            </button>

            <button
              onClick={onPrint}
              className="rounded-lg border py-3"
            >
              Print
            </button>

            <button
              onClick={onNew}
              className="rounded-lg border py-3"
            >
              Create New Docket
            </button>

          </div>

        </div>

      </DialogContent>

    </Dialog>
  );
}
