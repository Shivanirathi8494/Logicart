import PrintableManifest from "@/features/manifest/PrintableManifest";

export default async function Page({
  params,
}: {
  params: Promise<{
    manifestNumber: string;
  }>;
}) {
  const { manifestNumber } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/manifests/${encodeURIComponent(manifestNumber)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return <div>Manifest not found.</div>;
  }

  const manifest = await response.json();

  return <PrintableManifest manifest={manifest} />;
}
