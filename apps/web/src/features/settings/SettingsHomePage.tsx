import Link from "next/link";

const settings = [

  {
    title:"Company Profile",
    description:"Manage company information.",
    href:"/portal/settings/company",
  },

  {
    title:"Number Series",
    description:"Configure tracking and document numbering.",
    href:"/portal/settings/number-series",
  },

  {
    title:"Email Settings",
    description:"Configure SMTP server and notifications.",
    href:"/portal/settings/email",
  },

  {
    title:"Application Preferences",
    description:"General application settings.",
    href:"/portal/settings/preferences",
  },

];

export default function SettingsHomePage(){

return(

<div className="space-y-8">

<div>

<h1 className="text-3xl font-bold">

Settings

</h1>

<p className="mt-2 text-slate-500">

Configure the Logistics Management System.

</p>

</div>

<div className="grid gap-6 md:grid-cols-2">

{settings.map(setting=>(

<Link

key={setting.title}

href={setting.href}

className="rounded-xl border bg-white p-6 shadow-sm hover:border-blue-600"

>

<h2 className="text-xl font-semibold">

{setting.title}

</h2>

<p className="mt-2 text-slate-500">

{setting.description}

</p>

</Link>

))}

</div>

</div>

);

}
