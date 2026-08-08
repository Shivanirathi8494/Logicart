"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ShipmentDialog({
  open,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-5xl">

        <DialogHeader>

          <DialogTitle>

            Shipment Details

          </DialogTitle>

        </DialogHeader>

        <div className="space-y-8">

          <div className="grid grid-cols-4 gap-6">

            <div>

              <p className="text-sm text-slate-500">

                AWB Number

              </p>

              <p className="font-semibold">

                BLR-DEL-260803-000001

              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">

                Status

              </p>

              <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">

                Booked

              </span>

            </div>

          </div>

          <div className="border-t pt-6">

            Shipment details will appear here.

          </div>

          <div className="flex justify-end gap-4">

            <button className="rounded border px-5 py-2">

              Print

            </button>

            <button className="rounded border px-5 py-2">

              Edit

            </button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
