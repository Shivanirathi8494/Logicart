"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props={
dashboard:any;
};

export default function ShipmentStatusChart({
dashboard,
}:Props){

const data=[

{
name:"Booked",
value:dashboard.booked,
color:"#3b82f6",
},

{
name:"Inscan",
value:dashboard.inscan,
color:"#f59e0b",
},

{
name:"Manifested",
value:dashboard.manifested,
color:"#6366f1",
},

{
name:"Outscan",
value:dashboard.outscan,
color:"#8b5cf6",
},

{
name:"Delivered",
value:dashboard.delivered,
color:"#22c55e",
},

];

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-bold">

Shipment Distribution

</h2>

<div className="h-80">

<ResponsiveContainer>

<PieChart>

<Pie
data={data}
dataKey="value"
nameKey="name"
outerRadius={110}
label
>

{data.map((entry,index)=>(

<Cell
key={index}
fill={entry.color}
/>

))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</section>

);

}
