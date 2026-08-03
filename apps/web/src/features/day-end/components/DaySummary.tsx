type Props = {
  summary: any;
};

export default function DaySummary({
  summary,
}: Props) {

  const rows = [

    ["Business Date", new Date(summary.businessDate).toLocaleDateString()],
    ["Branch", summary.branch],
    ["Bookings", summary.bookingCount],
    ["Manifests", summary.manifestCount],
    ["Outscan", summary.outscanCount],
    ["Delivered", summary.deliveredCount],
    ["Pending Delivery", summary.pendingDelivery],
    ["Revenue", "₹ " + summary.revenue],
    ["Cash Collection", "₹ " + summary.cashCollection],
    ["Online Collection", "₹ " + summary.onlineCollection],

  ];

  return (

<section className="rounded-xl border bg-white shadow-sm">

<div className="border-b bg-slate-50 p-5">

<h2 className="text-xl font-bold">

Operational Summary

</h2>

</div>

<table className="min-w-full">

<tbody>

{rows.map(([label,value])=>(

<tr
key={String(label)}
className="border-t"
>

<td className="w-80 bg-slate-50 p-4 font-semibold">

{label}

</td>

<td className="p-4">

{value}

</td>

</tr>

))}

</tbody>

</table>

</section>

);

}
