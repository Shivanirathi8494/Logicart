import { Button } from "@/components/ui/button";

export default function Page() {

  return (

    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Email Settings
      </h1>

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="grid gap-5 md:grid-cols-2">

          <input
            placeholder="SMTP Host"
            className="rounded-lg border p-3"
          />

          <input
            placeholder="Port"
            className="rounded-lg border p-3"
          />

          <input
            placeholder="Username"
            className="rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-lg border p-3"
          />

          <input
            placeholder="Sender Email"
            className="rounded-lg border p-3 md:col-span-2"
          />

        </div>

        <div className="mt-8 flex gap-4">

          <Button>
            Save
          </Button>

          <Button variant="outline">
            Test Connection
          </Button>

        </div>

      </div>

    </div>

  );

}
