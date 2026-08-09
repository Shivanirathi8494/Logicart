import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    manifestNumber: string;
  }>;
}) {
  const { manifestNumber } = await params;

  redirect(
    "/portal/manifest/preview?manifest=" +
      encodeURIComponent(manifestNumber)
  );
}
