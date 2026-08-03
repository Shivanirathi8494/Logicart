type Props={
dashboard:any;
};

export default function KPICards({
dashboard,
}:Props){

const cards=[

{
title:"Booked",
value:dashboard.booked,
},

{
title:"Inscan",
value:dashboard.inscan,
},

{
title:"Outscan",
value:dashboard.outscan,
},

{
title:"Revenue",
value:"₹ "+dashboard.revenue,
},

{
title:"Open Manifest",
value:dashboard.openManifests,
},

{
title:"Open Challans",
value:dashboard.openChallans,
},

];

return(

<div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">

{cards.map(card=>(

<div
key={card.title}
className="rounded-xl border bg-white p-6 shadow-sm"
>

<div className="text-sm text-slate-500">

{card.title}

</div>

<div className="mt-3 text-3xl font-bold">

{card.value}

</div>

</div>

))}

</div>

);

}
