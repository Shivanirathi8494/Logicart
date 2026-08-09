import ManifestPreviewPage from "@/features/manifest/ManifestPreviewPage";

export default async function Page({
  params,
}: {
  params: Promise<{
    manifestNumber: string;
  }>;
}) {
  const { manifestNumber } = await params;

  return (
    <ManifestPreviewPage
      manifestNumber={manifestNumber}
    />
  );
}
