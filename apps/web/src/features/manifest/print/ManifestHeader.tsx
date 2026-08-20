"use client";

export default function ManifestHeader({
  manifest,
}: any) {
  if (!manifest) return null;

  const totalWeight = (manifest.shipments ?? []).reduce(
    (sum: number, item: any) =>
      sum + Number(item?.shipment?.chargeableWeight ?? 0),
    0
  );

  const manifestDate = manifest.manifestDate
    ? new Date(manifest.manifestDate)
    : new Date();

  const dateText = manifestDate
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .toUpperCase();

  const timeText = manifestDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="w-full font-sans text-[11px] leading-tight text-black">

      {/* LOGOS */}
      <div className="flex w-full items-center justify-between px-3 py-2">
        <img
          src="/logo/logicarts-logo.png"
          alt="Logicarts"
          className="h-[42px] w-auto object-contain"
        />

        <img
          src="/logo/alliance-air-logo.jpeg"
          alt="Alliance Air"
          className="h-[48px] w-auto object-contain"
        />
      </div>

      {/* TOP ROW */}
      <table className="w-full border-collapse border border-black">
        <tbody>
          <tr className="h-[28px]">
            <td className="w-[15%] border border-black px-2">
              {timeText}
            </td>

            <td className="w-[15%] border border-black px-2">
              {dateText}
            </td>

            <td className="w-[40%] border border-black text-center">
              <span className="text-[15px] font-bold">
                AIR CARGO MANIFEST
              </span>
            </td>

            <td className="w-[30%] border border-black px-2">
              PAGE:1-1
            </td>
          </tr>
        </tbody>
      </table>

      {/* OWNER / ISSUED BY */}
      <table className="w-full border-collapse border-x border-b border-black">
        <tbody>
          <tr className="h-[29px]">
            <td className="w-[50%] border-r border-black px-2">
              OWNER OR OPERATOR –{" "}
              <strong>ALLIANCE AIR</strong>
            </td>

            <td className="px-2">
              ISSUED BY-
            </td>
          </tr>
        </tbody>
      </table>

      {/* AIRCRAFT / FLIGHT / DATE / WEIGHT */}
      <table className="w-full border-collapse border-x border-b border-black">
        <tbody>
          <tr className="h-[38px]">
            <td className="w-[40%] border-r border-black px-2">
              A/C REGISTRATION NO – VT-
            </td>

            <td className="w-[20%] border-r border-black px-2">
              FLIGHT NO. -{" "}
              {manifest.flightNumber ?? ""}
            </td>

            <td className="w-[20%] border-r border-black px-2">
              <div>DATE: -</div>
              <div>{dateText}</div>
            </td>

            <td className="w-[20%] px-2">
              <div>WEIGHT IN KG</div>
              <div>{totalWeight.toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* DEPARTURE */}
      <table className="w-full border-collapse border-x border-b border-black">
        <tbody>
          <tr className="h-[28px]">
            <td className="px-2 font-bold">
              DEPARTURE
            </td>
          </tr>
        </tbody>
      </table>

      {/* LOADING / UNLOADING */}
      <table className="w-full border-collapse border-x border-b border-black">
        <tbody>
          <tr className="h-[38px]">
            <td className="w-1/2 border-r border-black px-2">
              POINT OF LADING –{" "}
              <strong>{manifest.origin}</strong>
            </td>

            <td className="w-1/2 px-2">
              POINT OF UNLADING -{" "}
              <strong>{manifest.destination}</strong>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  );
}
