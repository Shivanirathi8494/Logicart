import Link from "next/link";

const actions=[

{
title:"Create Docket",
href:"/portal/operations/create-docket",
},

{
title:"Search Shipment",
href:"/portal/operations/search-docket",
},

{
title:"Inscan",
href:"/portal/warehouse/inscan",
},

{
title:"Outscan",
href:"/portal/warehouse/outscan",
},

{
title:"Generate Manifest",
href:"/portal/warehouse/manifest",
},

{
title:"Delivery Challan",
href:"/portal/delivery/challan",
},

];

export default function QuickActions(){

return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<h2 className="mb-6 text-xl font-bold">

Quick Actions

</h2>

<div className="grid gap-4 md:grid-cols-3">

{actions.map(action=>(

<Link
key={action.href}
href={action.href}
className="rounded-lg border p-5 text-center hover:bg-blue-600 hover:text-white transition"
>

{action.title}

</Link>

))}

</div>

</section>

);

}
