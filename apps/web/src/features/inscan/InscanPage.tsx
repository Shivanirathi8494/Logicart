"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import InscanSearch from "./components/InscanSearch";
import InscanManifestSummary from "./components/InscanManifestSummary";
import InscanManifestTable from "./components/InscanManifestTable";

function InscanContent() {
  const params = useSearchParams();

  const manifestNumber =
    params.get("manifest");

  const [manifest, setManifest] =
    useState<any>(null);

  const [manifests, setManifests] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  useEffect(() => {
    loadCurrentUser();
    loadIncomingManifests();
  }, []);

  useEffect(() => {
    if (!manifestNumber) {
      return;
    }

    loadManifest(manifestNumber);
  }, [manifestNumber]);

  async function loadCurrentUser() {
    try {
      const response =
        await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

      if (response.ok) {
        setCurrentUser(
          await response.json()
        );
      }
    } catch (error) {
      console.error(
        "Unable to load current user:",
        error
      );
    }
  }

  async function loadIncomingManifests() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/manifests",
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        throw new Error(
          await response.text()
        );
      }

      const data =
        await response.json();

      setManifests(data);
    } catch (error) {
      console.error(
        "Unable to load incoming manifests:",
        error
      );

      setManifests([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadManifest(
    number: string
  ) {
    try {
      const response =
        await fetch(
          "/api/manifests/" +
            encodeURIComponent(number),
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        const data =
          await response.json();

        alert(
          data?.error ||
            "Unable to open manifest."
        );

        return;
      }

      setManifest(
        await response.json()
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to open manifest."
      );
    }
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff7417]">
            Destination Operations
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#0b2340]">
            Incoming / Unload
          </h1>

          <p className="mt-2 text-slate-500">
            View manifests arriving at your branch and receive the shipments.
          </p>
        </div>

        {currentUser?.branchCode && (
          <div className="rounded-xl border bg-white px-5 py-3 text-sm shadow-sm">

            <div className="text-slate-500">
              Receiving Branch
            </div>

            <div className="font-bold text-[#0b2340]">
              {currentUser.branchCode}
              {" — "}
              {currentUser.branchName}
            </div>

          </div>
        )}

      </div>


      {/* INCOMING MANIFESTS */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-lg font-bold text-[#0b2340]">
              Incoming Manifests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manifests addressed to your branch.
            </p>
          </div>

          <div className="text-sm font-medium text-slate-500">
            {manifests.length}
            {" manifest"}
            {manifests.length === 1
              ? ""
              : "s"}
          </div>

        </div>


        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading incoming manifests...
          </div>
        ) : manifests.length === 0 ? (
          <div className="p-12 text-center">

            <div className="text-lg font-semibold text-[#0b2340]">
              No incoming manifests.
            </div>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no manifests waiting for your branch.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50">
                <tr>

                  <th className="px-5 py-4 text-left">
                    Manifest
                  </th>

                  <th className="px-5 py-4 text-left">
                    Route
                  </th>

                  <th className="px-5 py-4 text-left">
                    Date
                  </th>

                  <th className="px-5 py-4 text-center">
                    Shipments
                  </th>

                  <th className="px-5 py-4 text-left">
                    Weight
                  </th>

                  <th className="px-5 py-4 text-right">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {manifests.map(
                  (item: any) => {

                    const shipmentCount =
                      item.shipments?.length ??
                      0;

                    const totalWeight =
                      (
                        item.shipments ??
                        []
                      ).reduce(
                        (
                          sum: number,
                          entry: any
                        ) =>
                          sum +
                          Number(
                            entry
                              ?.shipment
                              ?.chargeableWeight ??
                              0
                          ),
                        0
                      );

                    return (
                      <tr
                        key={item.id}
                        className="border-t transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-4 font-bold text-[#0b2340]">
                          {item.manifestNumber}
                        </td>

                        <td className="px-5 py-4">

                          <span className="font-semibold">
                            {item.origin}
                          </span>

                          <span className="mx-2 text-[#ff7417]">
                            →
                          </span>

                          <span className="font-semibold">
                            {item.destination}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {item.manifestDate
                            ? new Date(
                                item.manifestDate
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td className="px-5 py-4 text-center font-semibold">
                          {shipmentCount}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {totalWeight.toFixed(
                            2
                          )}
                          {" Kg"}
                        </td>

                        <td className="px-5 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              loadManifest(
                                item.manifestNumber
                              )
                            }
                            className="rounded-lg bg-[#ff7417] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#e9680d]"
                          >
                            Receive / Unload
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {/* MANUAL SEARCH FALLBACK */}
      <details className="rounded-2xl border bg-white shadow-sm">

        <summary className="cursor-pointer px-6 py-4 font-semibold text-[#0b2340]">
          Enter Manifest Number Manually
        </summary>

        <div className="border-t p-6">

          <InscanSearch
            onFound={setManifest}
          />

        </div>

      </details>


      {/* SELECTED MANIFEST */}
      {manifest && (
        <section className="space-y-4 sm:space-y-6">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff7417]">
              Selected Manifest
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#0b2340]">
              {manifest.manifestNumber}
            </h2>
          </div>

          <InscanManifestSummary
            manifest={manifest}
          />

          <InscanManifestTable
            manifest={manifest}
          />

        </section>
      )}

    </div>
  );
}


export default function InscanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          Loading...
        </div>
      }
    >
      <InscanContent />
    </Suspense>
  );
}
