import { Button } from "@/components/ui/button";

export default function Page() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          Company Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Configure company information.
        </p>

      </div>

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Company Name
            </label>

            <input
              defaultValue="Logicarts"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              GST Number
            </label>

            <input
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Phone
            </label>

            <input
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium">
              Address
            </label>

            <textarea
              rows={4}
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div className="mt-8">

          <Button>
            Save Company
          </Button>

        </div>

      </div>

    </div>

  );

}
