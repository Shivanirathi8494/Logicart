import Sidebar from "@/components/portal/Sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-slate-100 p-8">
        {children}
      </main>
    </div>
  );
}