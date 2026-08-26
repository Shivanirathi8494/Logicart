type Props={
dashboard:any;
};

export default function OperationsSummary({
dashboard,
}:Props){

return(

<section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

<h2 className="mb-5 text-lg font-bold text-[#0b2340] sm:mb-6 sm:text-xl">

Operations Summary

</h2>

<div className="grid grid-cols-2 gap-4 sm:gap-6">

<div>

<div className="text-slate-500">

Total Shipments

</div>

<div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">

{dashboard.totalShipment}

</div>

</div>

<div>

<div className="text-slate-500">

Total Manifest

</div>

<div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">

{dashboard.totalManifest}

</div>

</div>

<div>

<div className="text-slate-500">

Delivery Challans

</div>

<div className="mt-1 text-2xl font-bold text-[#0b2340] sm:text-3xl">

{dashboard.totalChallan}

</div>

</div>

<div>

<div className="text-slate-500">

Pending Delivery

</div>

<div className="mt-1 text-2xl font-bold text-red-600 sm:text-3xl">

{dashboard.pendingDelivery}

</div>

</div>

</div>

</section>

);

}
