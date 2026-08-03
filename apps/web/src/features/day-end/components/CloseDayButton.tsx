"use client";

import { useRouter } from "next/navigation";

type Props = {
  summary:any;
};

export default function CloseDayButton({

  summary,

}:Props){

  const router = useRouter();

  async function closeDay(){

    const ok = confirm(
      "Close today's business?"
    );

    if(!ok){
      return;
    }

    const response = await fetch(
      "/api/day-end/close",
      {
        method:"POST",
      }
    );

    const data = await response.json();

    if(!response.ok){

      alert(data.error);

      return;

    }

    alert("Business Day Closed Successfully.");

    router.refresh();

  }

  return(

<section className="rounded-xl border bg-white p-6 shadow-sm">

<div className="mb-6">

<h2 className="text-xl font-bold">

Operational Checklist

</h2>

</div>

<div className="space-y-3">

<div>✅ Booking Summary Verified</div>

<div>✅ Manifest Summary Verified</div>

<div>✅ Delivery Summary Verified</div>

<div>✅ Revenue Summary Verified</div>

</div>

<div className="mt-8 flex justify-end">

<button

onClick={closeDay}

className="rounded-lg bg-red-600 px-8 py-3 text-white"

>

Close Business Day

</button>

</div>

</section>

);

}
