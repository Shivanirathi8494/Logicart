import CreateDocketPage from "@/features/docket/CreateDocketPage";

export default async function Page({
  searchParams,
}:{
  searchParams:Promise<{
    tracking?:string;
  }>;
}){

  const { tracking } = await searchParams;

  return (
    <CreateDocketPage
      trackingNumber={tracking}
    />
  );

}
