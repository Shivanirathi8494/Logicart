import PrintableManifest from "@/features/manifest/PrintableManifest";

export default async function Page({
  params,
}: {
  params: Promise<{
    manifestNumber: string;
  }>;
}) {

  const { manifestNumber } = await params;

  return (
    <PrintableManifest
      manifestNumber={manifestNumber}
    />
  );

}
