"use client";

import { useEffect, useState } from "react";
import PrintableManifest from "./PrintableManifest";

export default function ManifestPreviewPage() {

  const [manifest, setManifest] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    );

    const manifestNumber =
      params.get("manifest");

    if (!manifestNumber) {

      setError(
        "Manifest number is missing."
      );

      return;

    }

    async function loadManifest() {

      try {

        const response = await fetch(
          "/api/manifests/" +
          encodeURIComponent(manifestNumber),
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          setError(
            data?.error ??
            "Unable to load manifest."
          );

          return;

        }

        setManifest(data);

      } catch (error) {

        console.error(
          "Manifest load error:",
          error
        );

        setError(
          "Unable to load manifest."
        );

      }

    }

    loadManifest();

  }, []);

  if (error) {

    return (
      <div className="p-8 text-red-600">
        {error}
      </div>
    );

  }

  if (!manifest) {

    return (
      <div className="p-8">
        Loading manifest...
      </div>
    );

  }

  return (

    <>

      <div className="print:hidden flex justify-end gap-3 p-4">

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white"
        >
          Print Manifest
        </button>

      </div>

      <PrintableManifest
        manifest={manifest}
      />

    </>

  );

}
