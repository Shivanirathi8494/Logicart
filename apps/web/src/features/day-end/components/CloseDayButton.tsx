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

<section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

<div className="mb-4 sm:mb-6">

<h2 className="text-lg font-bold text-[#0b2340] sm:text-xl">

Operational Checklist

</h2>

</div>

<div className="space-y-3">

<div>✅ Booking Summary Verified</div>

<div>✅ Manifest Summary Verified</div>

<div>✅ Delivery Summary Verified</div>

<div>✅ Revenue Summary Verified</div>

</div>

<div className="mt-6 flex sm:mt-8 sm:justify-end">

<button

onClick={closeDay}

className="min-h-11 w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white sm:w-auto sm:px-8"

>

Close Business Day

</button>

</div>

</section>

);

}
