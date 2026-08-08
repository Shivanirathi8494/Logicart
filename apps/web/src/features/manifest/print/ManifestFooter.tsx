"use client";

import ManifestSummary from "./ManifestSummary";
import ManifestSignature from "./ManifestSignature";

export default function ManifestFooter({
  shipments,
}: any) {

  return (

    <>

      <ManifestSummary
        shipments={shipments}
      />

      <ManifestSignature />

    </>

  );

}
