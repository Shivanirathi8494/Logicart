"use client";

import ManifestHeader from "./print/ManifestHeader";
import ManifestTable from "./print/ManifestTable";

type Props = {
  manifest: any;
};

export default function PrintableManifest({
  manifest,
}: Props) {
  if (!manifest) return null;

  return (
    <div
      className="
        mx-auto
        box-border
        min-h-[297mm]
        w-[210mm]
        bg-white
        px-[12mm]
        py-[10mm]
        font-sans
        text-black
        print:m-0
        print:min-h-0
        print:w-[210mm]
        print:px-[12mm]
        print:py-[10mm]
      "
    >
      <ManifestHeader manifest={manifest} />

      <ManifestTable
        shipments={manifest.shipments}
      />
    </div>
  );
}
