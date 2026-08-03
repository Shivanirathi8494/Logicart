type Props={
dashboard:any;
};

export default function RecentManifests({
dashboard,
}:Props){

return(

<section className="rounded-xl border bg-white shadow-sm">

<div className="border-b bg-slate-50 p-5">

<h2 className="text-xl font-bold">

Recent Manifests

</h2>

</div>

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">

Manifest

</th>

<th className="p-4 text-left">

Origin

</th>

<th className="p-4 text-left">

Destination

</th>

<th className="p-4 text-left">

Shipments

</th>

</tr>

</thead>

<tbody>

{dashboard.recentManifests.map((manifest:any)=>(

<tr
key={manifest.id}
className="border-t"
>

<td className="p-4 font-medium">

{manifest.manifestNumber}

</td>

<td className="p-4">

{manifest.origin}

</td>

<td className="p-4">

{manifest.destination}

</td>

<td className="p-4">

{manifest.shipments.length}

</td>

</tr>

))}

</tbody>

</table>

</section>

);

}
