import { prisma } from "@/lib/prisma";

export async function generateLoadingTallyNumber(
  origin:string,
){

  const now=new Date();

  const yy=String(now.getFullYear()).slice(-2);
  const mm=String(now.getMonth()+1).padStart(2,"0");
  const dd=String(now.getDate()).padStart(2,"0");

  const prefix=`LT-${origin}-${yy}${mm}${dd}-`;

  const latest=await prisma.loadingTally.findFirst({

    where:{
      loadingTallyNumber:{
        startsWith:prefix,
      },
    },

    orderBy:{
      loadingTallyNumber:"desc",
    },

  });

  let sequence=1;

  if(latest){

    sequence=
      Number(
        latest.loadingTallyNumber.split("-").pop()
      )+1;

  }

  return prefix+
    String(sequence).padStart(6,"0");

}
