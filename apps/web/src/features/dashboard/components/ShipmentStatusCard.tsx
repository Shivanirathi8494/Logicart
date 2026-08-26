type Props = {
  dashboard: any;
};

export default function ShipmentStatusCard({
  dashboard,
}: Props) {

  const rows = [

    {
      status: "BOOKED",
      count: dashboard.booked,
      color: "bg-blue-500",
    },

    {
      status: "INSCAN",
      count: dashboard.inscan,
      color: "bg-yellow-500",
    },

    {
      status: "MANIFESTED",
      count: dashboard.manifested,
      color: "bg-indigo-500",
    },

    {
      status: "OUTSCAN",
      count: dashboard.outscan,
      color: "bg-purple-500",
    },

    {
      status: "DELIVERED",
      count: dashboard.delivered,
      color: "bg-green-500",
    },

  ];

  const total = rows.reduce(
    (sum, row) => sum + row.count,
    0
  );

  return (

<section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

<h2 className="mb-5 text-lg font-bold text-[#0b2340] sm:mb-6 sm:text-xl">

Shipment Status

</h2>

<div className="space-y-4">

{rows.map((row)=>(

<div
key={row.status}
>

<div className="mb-1 flex justify-between">

<span>

{row.status}

</span>

<span className="font-semibold">

{row.count}

</span>

</div>

<div className="h-3 rounded-full bg-slate-200">

<div
className={`${row.color} h-3 rounded-full`}
style={{
width:
total
? `${(row.count/total)*100}%`
: "0%",
}}
/>

</div>

</div>

))}

</div>

</section>

);

}
