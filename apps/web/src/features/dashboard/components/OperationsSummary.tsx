type Props={
dashboard:any;
};

export default function OperationsSummary({
dashboard,
}:Props){

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-bold">

Operations Summary

</h2>

<div className="grid gap-6 md:grid-cols-2">

<div>

<div className="text-slate-500">

Total Shipments

</div>

<div className="text-3xl font-bold">

{dashboard.totalShipment}

</div>

</div>

<div>

<div className="text-slate-500">

Total Manifest

</div>

<div className="text-3xl font-bold">

{dashboard.totalManifest}

</div>

</div>

<div>

<div className="text-slate-500">

Delivery Challans

</div>

<div className="text-3xl font-bold">

{dashboard.totalChallan}

</div>

</div>

<div>

<div className="text-slate-500">

Pending Delivery

</div>

<div className="text-3xl font-bold text-red-600">

{dashboard.pendingDelivery}

</div>

</div>

</div>

</section>

);

}
