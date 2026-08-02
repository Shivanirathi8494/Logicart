export default function PrintableAirWaybill() {

const trackingNumber="BLR-DEL-260802-000001";

return(

<div className="bg-white p-8 text-black">

<div className="flex justify-between">

<div>

<h1 className="text-3xl font-bold">

LOGICARTS AIR CARGO

</h1>

<p className="text-gray-500">

Air Waybill

</p>

</div>

</div>

<div className="mt-8">

<h2 className="font-semibold">

Tracking Number

</h2>

<p className="text-xl font-bold">

{trackingNumber}

</p>

<div className="mt-3 rounded border border-dashed p-3 text-sm text-slate-500">
  Barcode: {trackingNumber}
</div>

</div>

<hr className="my-8"/>

<div className="grid grid-cols-2 gap-8">

<div>

<h3 className="font-semibold">

Sender

</h3>

<p>Name</p>

<p>Phone</p>

<p>Address</p>

</div>

<div>

<h3 className="font-semibold">

Receiver

</h3>

<p>Name</p>

<p>Phone</p>

<p>Address</p>

</div>

</div>

<hr className="my-8"/>

<div className="grid grid-cols-4 gap-4">

<div>

Packages

</div>

<div>

Actual

</div>

<div>

Volumetric

</div>

<div>

Chargeable

</div>

</div>

<hr className="my-8"/>

<div className="grid grid-cols-3 gap-6">

<div>

Freight

</div>

<div>

GST

</div>

<div>

Total

</div>

</div>

<div className="mt-12 flex justify-between">

<div>

____________________

<br/>

Customer Signature

</div>

<div>

____________________

<br/>

Booking Executive

</div>

</div>

</div>

);

}
