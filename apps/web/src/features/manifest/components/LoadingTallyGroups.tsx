"use client";

export default function LoadingTallyGroups({
  loadingTally,
}: any) {

  const groups = Object.values(

    loadingTally.shipments.reduce(

      (acc: any, item: any) => {

        const key =
          item.shipment.origin +
          "|" +
          item.shipment.destination;

        if (!acc[key]) {

          acc[key] = {

            origin: item.shipment.origin,
            destination: item.shipment.destination,
            shipments: [],

          };

        }

        acc[key].shipments.push(item.shipment);

        return acc;

      },

      {}

    )

  );

  async function generateManifest(group: any) {

    const response = await fetch(
      "/api/manifests/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          loadingTallyId: loadingTally.id,

          loadingTallyNumber: loadingTally.loadingTallyNumber,

          origin: group.origin,

          destination: group.destination,

          trackingNumbers: group.shipments.map(
            (s:any)=>s.trackingNumber
          ),

        }),
      }
    );

    if(response.status===409){

      const data = await response.json();

      window.open(
        "/portal/manifest/preview?manifest="+
        data.manifestNumber,
        "_blank"
      );

      return;

    }

    if(!response.ok){

      alert("Unable to generate Manifest.");

      return;

    }

    const manifest = await response.json();

    alert(
      "Manifest Generated\n\n" +
      manifest.manifestNumber
    );

    window.location.reload();


  }

  return (

    <div className="space-y-6">

      {groups.map((group: any, index: number) => {

        const pieces = group.shipments.reduce(
          (t: number, s: any) => t + s.packageCount,
          0
        );

        const weight = group.shipments.reduce(
          (t: number, s: any) => t + s.chargeableWeight,
          0
        );

        return (

          <section
            key={index}
            className="rounded-xl border bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold">

                  {group.origin} → {group.destination}

                </h2>

                <div className="mt-2 text-slate-500">

                  Shipments : {group.shipments.length}

                </div>

                <div className="text-slate-500">

                  Pieces : {pieces}

                </div>

                <div className="text-slate-500">

                  Weight : {weight} Kg

                </div>

              </div>

              <button
                onClick={() => generateManifest(group)}
                className="rounded-lg bg-green-600 px-6 py-3 text-white"
              >

                Generate Manifest

              </button>

            </div>

          </section>

        );

      })}

    </div>

  );

}
