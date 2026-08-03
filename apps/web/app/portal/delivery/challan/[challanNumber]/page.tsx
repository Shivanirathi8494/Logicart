import DeliveryChallanPreviewPage from "@/features/delivery-challan/DeliveryChallanPreviewPage";

export default async function Page({
  params,
}:{
  params:Promise<{
    challanNumber:string;
  }>;
}){

  const { challanNumber } = await params;

  return (
    <DeliveryChallanPreviewPage
      challanNumber={challanNumber}
    />
  );

}
