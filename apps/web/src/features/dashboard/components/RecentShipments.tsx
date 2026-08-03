type Props={
dashboard:any;
};

export default function RecentShipments({
dashboard,
}:Props){

return(

<section className="overflow-hidden rounded-xl border bg-white shadow-sm">

<div className="border-b bg-slate-50 p-5">

<h2 className="text-xl font-bold">

Recent Shipments

</h2>

</div>

<table className="min-w-full">

<thead className="bg-slate-100">

<tr>

<th className="p-4 text-left">Tracking</th>

<th className="p-4 text-left">Sender</th>

<th className="p-4 text-left">Destination</th>

<th className="p-4 text-left">Status</th>

</tr>

</thead>

<tbody>

{dashboard.recentShipments.map((shipment:any)=>(

<tr
key={shipment.id}
className="border-t"
>

<td className="p-4 font-medium">

{shipment.trackingNumber}

</td>

<td className="p-4">

{shipment.senderName}

</td>

<td className="p-4">

{shipment.destination}

</td>

<td className="p-4">

<span className="rounded-full bg-blue-100 px-3 py-1 text-sm">

{shipment.status}

</span>

</td>

</tr>

))}

</tbody>

</table>

</section>

);

}
