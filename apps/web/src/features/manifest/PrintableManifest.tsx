"use client";

import ManifestHeader from "./print/ManifestHeader";
import ManifestTable from "./print/ManifestTable";
import ManifestFooter from "./print/ManifestFooter";

type Props = {
  manifest: any;
};

export default function PrintableManifest({
  manifest,
}: Props) {

  if (!manifest) return null;

  return (

    <div className="mx-auto w-[210mm] min-h-[297mm] bg-white p-6 text-black print:p-3">

      <ManifestHeader
        manifest={manifest}
      />

      <ManifestTable
        shipments={manifest.shipments}
      />

      <ManifestFooter
        shipments={manifest.shipments}
      />

    </div>

  );

}
