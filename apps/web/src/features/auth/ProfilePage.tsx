import { Button } from "@/components/ui/button";

export default function ProfilePage() {

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your account information.
        </p>

      </div>

      <div className="rounded-xl border bg-white p-8 shadow">

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Full Name
            </label>

            <input
              defaultValue="Administrator"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Username
            </label>

            <input
              defaultValue="admin"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Email
            </label>

            <input
              defaultValue="admin@logicarts.com"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Mobile
            </label>

            <input
              defaultValue="9876543210"
              className="w-full rounded-lg border p-3"
            />

          </div>

        </div>

        <div className="mt-8">

          <Button>
            Save Profile
          </Button>

        </div>

      </div>

    </div>

  );

}
