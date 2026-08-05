import AirWaybill from "@/features/docket/components/AirWaybill";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<{
    tracking?:string;
  }>;
}){

  const { tracking="" } = await searchParams;

  return (
    <AirWaybill
      trackingNumber={tracking}
    />
  );

}
