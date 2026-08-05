import { Button } from "@/components/ui/button";

export default function ChangePasswordPage() {

  return (

    <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 shadow">

      <h1 className="mb-6 text-3xl font-bold">
        Change Password
      </h1>

      <div className="space-y-5">

        <div>

          <label className="mb-2 block font-medium">
            Current Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            New Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Confirm Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border p-3"
          />

        </div>

        <Button className="w-full">
          Update Password
        </Button>

      </div>

    </div>

  );

}
