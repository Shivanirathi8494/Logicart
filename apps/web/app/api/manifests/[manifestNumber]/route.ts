import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
request:Request,
{
params,
}:{
params:Promise<{
manifestNumber:string;
}>;
}){

const {manifestNumber}=await params;

const manifest=
await prisma.manifest.findUnique({

where:{
manifestNumber,
},

include:{

shipments:{

include:{
shipment:true,
},

},

},

});

return NextResponse.json(manifest);

}
