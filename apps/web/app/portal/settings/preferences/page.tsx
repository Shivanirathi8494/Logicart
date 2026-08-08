import { Button } from "@/components/ui/button";

export default function Page() {

  return (

    <div className="space-y-8">

      <h1 className="text-3xl font-bold">
        Application Preferences
      </h1>

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="space-y-5">

          <label className="flex items-center gap-3">

            <input type="checkbox" defaultChecked />

            Enable Email Notifications

          </label>

          <label className="flex items-center gap-3">

            <input type="checkbox" defaultChecked />

            Auto Generate AWB Number

          </label>

          <label className="flex items-center gap-3">

            <input type="checkbox" defaultChecked />

            Enable Delivery Challan Printing

          </label>

          <label className="flex items-center gap-3">

            <input type="checkbox" />

            Enable Debug Logging

          </label>

        </div>

        <div className="mt-8">

          <Button>
            Save Preferences
          </Button>

        </div>

      </div>

    </div>

  );

}
