"use client";

import { useEffect,useState } from "react";

export default function LoadingTallyList({
  onSelect,
}:any){

  const [rows,setRows]=useState([]);

  useEffect(()=>{

    load();

  },[]);

  async function load(){

    const response=await fetch(
      "/api/loading-tallies/open"
    );

    if(response.ok){

      setRows(await response.json());

    }

  }

  return(

    <div className="rounded-xl border bg-white">

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-3 text-left">

              Loading Tally

            </th>

            <th className="p-3">

              Date

            </th>

            <th className="p-3">

              Shipments

            </th>

            <th className="p-3">

            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row:any)=>(

            <tr
              key={row.id}
              className="border-b"
            >

              <td className="p-3">

                {row.loadingTallyNumber}

              </td>

              <td className="p-3">

                {new Date(
                  row.loadingDate
                ).toLocaleDateString()}

              </td>

              <td className="p-3">

                {row.shipments.length}

              </td>

              <td className="p-3">

                <button
                  onClick={()=>onSelect(row)}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >

                  Open

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}
