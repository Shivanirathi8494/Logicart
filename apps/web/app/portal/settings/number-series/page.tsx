import { Button } from "@/components/ui/button";

export default function Page() {

  return (

    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Number Series
      </h1>

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Tracking Prefix
            </label>

            <input
              defaultValue="DEL"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Manifest Prefix
            </label>

            <input
              defaultValue="MNF"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Challan Prefix
            </label>

            <input
              defaultValue="DC"
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div className="mt-8">

          <Button>
            Save Series
          </Button>

        </div>

      </div>

    </div>

  );

}
