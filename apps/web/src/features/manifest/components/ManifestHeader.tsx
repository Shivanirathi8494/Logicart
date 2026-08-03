"use client";

export default function ManifestHeader(){

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h1 className="text-3xl font-bold">

AIR CARGO MANIFEST

</h1>

<div className="mt-6 grid gap-6 md:grid-cols-3">

<input
className="rounded-lg border p-3"
placeholder="Origin"
/>

<input
className="rounded-lg border p-3"
placeholder="Destination"
/>

<input
className="rounded-lg border p-3"
placeholder="Manifest Date"
/>

<input
className="rounded-lg border p-3"
placeholder="Flight Number"
/>

<input
className="rounded-lg border p-3"
placeholder="Vehicle Number"
/>

<input
className="rounded-lg border p-3"
placeholder="Manifest Number"
readOnly
value="Auto Generated"
/>

</div>

</section>

);

}
