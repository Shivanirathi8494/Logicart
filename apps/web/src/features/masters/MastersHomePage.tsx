import MasterCard from "./components/MasterCard";

export default function MastersHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Masters
        </h1>

        <p className="mt-2 text-slate-500">
          Manage Logicarts onboarding and access.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <MasterCard
          title="Onboarding & Access"
          description="Create clients, agents, customers and employees."
          href="/portal/masters/onboarding"
        />
      </div>
    </div>
  );
}
