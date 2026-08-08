"use client";

import { useEffect,useState } from "react";

export default function ManifestRegisterPage(){

  const [rows,setRows]=useState([]);

  useEffect(()=>{
    load();
  },[]);

  async function load(){

    const response=await fetch("/api/manifests");

    if(response.ok){
      setRows(await response.json());
    }

  }

  return(

    <div className="mx-auto max-w-7xl p-8">

      <h1 className="mb-6 text-3xl font-bold">

        Manifest Register

      </h1>

      <table className="w-full border">

        <thead className="bg-slate-100">

          <tr>

            <th className="border p-3">Manifest No</th>

            <th className="border p-3">Date</th>

            <th className="border p-3">Origin</th>

            <th className="border p-3">Destination</th>

            <th className="border p-3">Shipments</th>

            <th className="border p-3">Status</th>

            <th className="border p-3">Action</th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row:any)=>(

            <tr key={row.id}>

              <td className="border p-2">

                {row.manifestNumber}

              </td>

              <td className="border p-2">

                {new Date(
                  row.manifestDate
                ).toLocaleDateString()}

              </td>

              <td className="border p-2">

                {row.origin}

              </td>

              <td className="border p-2">

                {row.destination}

              </td>

              <td className="border p-2 text-center">

                {row.shipments.length}

              </td>

              <td className="border p-2">

                {row.status}

              </td>

              <td className="border p-2">

                <button
                  onClick={()=>
                    window.open(
                      "/portal/manifests/"+row.manifestNumber,
                      "_blank"
                    )
                  }
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >

                  View

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}
