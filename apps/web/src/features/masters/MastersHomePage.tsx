import MasterCard from "./components/MasterCard";

export default function MastersHomePage() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Masters
        </h1>

        <p className="mt-2 text-slate-500">
          Manage master data used throughout the Logistics Management System.
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <MasterCard
          title="Branch Master"
          description="Manage branches and locations."
          href="/portal/masters/branches"
        />

        <MasterCard
          title="Customer Master"
          description="Manage customers and billing details."
          href="/portal/masters/customers"
        />

        <MasterCard
          title="Vehicle Master"
          description="Manage vehicles used for transportation."
          href="/portal/masters/vehicles"
        />

      </div>

    </div>

  );

}
