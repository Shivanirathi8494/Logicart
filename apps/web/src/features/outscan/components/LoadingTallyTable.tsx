"use client";

export default function LoadingTallyTable({
  shipments,
  setShipments,
}: any) {

  function remove(id: string) {
    setShipments(
      shipments.filter(
        (shipment: any) => shipment.id !== id
      )
    );
  }

  function updatePackage(
    shipmentId: string,
    packageId: string,
    changes: Record<string, any>
  ) {
    setShipments(
      shipments.map((shipment: any) => {
        if (shipment.id !== shipmentId) {
          return shipment;
        }

        return {
          ...shipment,

          packages: (shipment.packages || []).map(
            (pkg: any) =>
              pkg.id === packageId
                ? {
                    ...pkg,
                    ...changes,
                  }
                : pkg
          ),
        };
      })
    );
  }

  function isLoaded(pkg: any) {
    return pkg.loadingSelected !== false;
  }

  return (
    <div className="space-y-4">

      {!shipments.length && (
        <section className="rounded-xl border bg-white p-8 text-center text-slate-500 shadow-sm">
          No AWBs Added
        </section>
      )}

      {shipments.map((shipment: any) => {
        const packages = shipment.packages || [];

        const loadedPackages = packages.filter(
          (pkg: any) => isLoaded(pkg)
        );

        const notLoadedPackages = packages.filter(
          (pkg: any) => !isLoaded(pkg)
        );

        const loadedWeight = loadedPackages.reduce(
          (total: number, pkg: any) =>
            total + Number(pkg.weight || 0),
          0
        );

        return (
          <section
            key={shipment.id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            {/* AWB HEADER */}

            <div className="flex flex-col gap-4 border-b bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div>
                <div className="text-sm text-slate-500">
                  AWB Number
                </div>

                <div className="mt-1 text-lg font-bold text-[#0b2340]">
                  {shipment.trackingNumber}
                </div>

                <div className="mt-1 text-sm text-slate-500">
                  {shipment.origin} → {shipment.destination}
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(shipment.id)}
                className="min-h-10 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:self-center"
              >
                Remove AWB
              </button>

            </div>

            {/* AWB SUMMARY */}

            <div className="grid grid-cols-2 gap-3 border-b p-4 sm:grid-cols-4 sm:gap-5 sm:p-5">

              <div>
                <div className="text-xs text-slate-500">
                  Total Pieces
                </div>

                <div className="mt-1 font-bold">
                  {packages.length ||
                    shipment.packageCount ||
                    0}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  Loading
                </div>

                <div className="mt-1 font-bold text-green-700">
                  {loadedPackages.length}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  Not Loading
                </div>

                <div className="mt-1 font-bold text-red-600">
                  {notLoadedPackages.length}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  Loading Weight
                </div>

                <div className="mt-1 font-bold">
                  {loadedWeight.toFixed(2)} Kg
                </div>
              </div>

            </div>

            {/* NO PACKAGE DETAILS */}

            {!packages.length ? (
              <div className="p-5 text-sm text-amber-700">
                Package details are not available for this AWB.
                Remove it and add it again from Ready for Dispatch.
              </div>
            ) : (
              <>
                {/* DESKTOP TABLE */}

                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full">

                    <thead className="bg-slate-50">

                      <tr>

                        <th className="w-24 p-4 text-center text-sm font-semibold">
                          Load
                        </th>

                        <th className="p-4 text-left text-sm font-semibold">
                          Piece
                        </th>

                        <th className="p-4 text-center text-sm font-semibold">
                          Weight
                        </th>

                        <th className="p-4 text-center text-sm font-semibold">
                          Dimensions
                        </th>

                        <th className="p-4 text-left text-sm font-semibold">
                          Remark
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {packages.map(
                        (pkg: any, index: number) => {
                          const loaded = isLoaded(pkg);

                          return (
                            <tr
                              key={pkg.id}
                              className="border-t"
                            >

                              <td className="p-4 text-center">

                                <input
                                  type="checkbox"
                                  checked={loaded}
                                  onChange={(event) => {
                                    const checked =
                                      event.target.checked;

                                    updatePackage(
                                      shipment.id,
                                      pkg.id,
                                      {
                                        loadingSelected:
                                          checked,

                                        loadingRemark:
                                          checked
                                            ? ""
                                            : pkg.loadingRemark ||
                                              "",
                                      }
                                    );
                                  }}
                                  className="h-5 w-5 cursor-pointer accent-[#ff7417]"
                                />

                              </td>

                              <td className="p-4 font-medium">
                                Piece {index + 1} of{" "}
                                {packages.length}
                              </td>

                              <td className="p-4 text-center">
                                {Number(
                                  pkg.weight || 0
                                ).toFixed(2)}{" "}
                                Kg
                              </td>

                              <td className="p-4 text-center text-sm text-slate-600">
                                {pkg.length ?? "-"} ×{" "}
                                {pkg.width ?? "-"} ×{" "}
                                {pkg.height ?? "-"}
                              </td>

                              <td className="p-4">

                                {loaded ? (
                                  <span className="text-sm text-slate-400">
                                    —
                                  </span>
                                ) : (
                                  <input
                                    type="text"
                                    value={
                                      pkg.loadingRemark ||
                                      ""
                                    }
                                    onChange={(event) =>
                                      updatePackage(
                                        shipment.id,
                                        pkg.id,
                                        {
                                          loadingRemark:
                                            event.target.value,
                                        }
                                      )
                                    }
                                    placeholder="Reason not loaded *"
                                    className="min-h-10 w-full rounded-lg border border-red-200 px-3 py-2 text-sm outline-none focus:border-red-400"
                                  />
                                )}

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>

                {/* MOBILE CARDS */}

                <div className="space-y-3 p-4 md:hidden">

                  {packages.map(
                    (pkg: any, index: number) => {
                      const loaded = isLoaded(pkg);

                      return (
                        <div
                          key={pkg.id}
                          className="rounded-lg border p-4"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <div className="font-semibold">
                                Piece {index + 1} of{" "}
                                {packages.length}
                              </div>

                              <div className="mt-1 text-sm text-slate-500">
                                {Number(
                                  pkg.weight || 0
                                ).toFixed(2)}{" "}
                                Kg
                              </div>

                              <div className="mt-1 text-xs text-slate-400">
                                {pkg.length ?? "-"} ×{" "}
                                {pkg.width ?? "-"} ×{" "}
                                {pkg.height ?? "-"}
                              </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm font-medium">

                              <input
                                type="checkbox"
                                checked={loaded}
                                onChange={(event) => {
                                  const checked =
                                    event.target.checked;

                                  updatePackage(
                                    shipment.id,
                                    pkg.id,
                                    {
                                      loadingSelected:
                                        checked,

                                      loadingRemark:
                                        checked
                                          ? ""
                                          : pkg.loadingRemark ||
                                            "",
                                    }
                                  );
                                }}
                                className="h-5 w-5 accent-[#ff7417]"
                              />

                              Load

                            </label>

                          </div>

                          {!loaded && (
                            <div className="mt-4">

                              <label className="mb-1 block text-xs font-medium text-red-600">
                                Remark *
                              </label>

                              <input
                                type="text"
                                value={
                                  pkg.loadingRemark || ""
                                }
                                onChange={(event) =>
                                  updatePackage(
                                    shipment.id,
                                    pkg.id,
                                    {
                                      loadingRemark:
                                        event.target.value,
                                    }
                                  )
                                }
                                placeholder="Reason this piece is not being loaded"
                                className="min-h-11 w-full rounded-lg border border-red-200 px-3 py-2 text-sm outline-none focus:border-red-400"
                              />

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              </>
            )}

          </section>
        );
      })}

    </div>
  );
}
