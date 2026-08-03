import { prisma } from "@/lib/prisma";
import { generateManifestNumber } from "@/lib/manifest/generateManifestNumber";

export class ManifestService{

static async create(data:any){

const manifestNumber=
await generateManifestNumber(data.origin);

return prisma.$transaction(async(tx)=>{

const manifest=await tx.manifest.create({

data:{

manifestNumber,

manifestDate:new Date(),

origin:data.origin,

destination:data.destination,

flightNumber:data.flightNumber,

vehicleNumber:data.vehicleNumber,

remarks:data.remarks,

shipments:{

create:data.shipments.map((id:string)=>({

shipment:{
connect:{id},
},

})),

},

},

include:{
shipments:true,
},

});

await tx.shipment.updateMany({

where:{
id:{
in:data.shipments,
},
},

data:{
status:"MANIFESTED",
},

});

return manifest;

});

}

}
