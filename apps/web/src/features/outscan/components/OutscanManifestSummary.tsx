"use client";

export default function OutscanManifestSummary({
  manifest,
  selected,
}: any) {

  const totalWeight = manifest.shipments.reduce(
    (a:number,b:any)=>
      a+b.shipment.chargeableWeight,
    0
  );

  const totalPieces = manifest.shipments.reduce(
    (a:number,b:any)=>
      a+b.shipment.packageCount,
    0
  );

  return(

<section className="grid grid-cols-6 gap-4 rounded-xl border bg-white p-5 shadow-sm">

<div>

<div className="text-sm text-slate-500">

Manifest

</div>

<div className="font-semibold">

{manifest.manifestNumber}

</div>

</div>

<div>

<div className="text-sm text-slate-500">

Origin

</div>

<div className="font-semibold">

{manifest.origin}

</div>

</div>

<div>

<div className="text-sm text-slate-500">

Destination

</div>

<div className="font-semibold">

{manifest.destination}

</div>

</div>

<div>

<div className="text-sm text-slate-500">

Shipments

</div>

<div className="font-semibold">

{manifest.shipments.length}

</div>

</div>

<div>

<div className="text-sm text-slate-500">

Pieces

</div>

<div className="font-semibold">

{totalPieces}

</div>

</div>

<div>

<div className="text-sm text-slate-500">

Weight

</div>

<div className="font-semibold">

{totalWeight} Kg

</div>

</div>

</section>

);

}
