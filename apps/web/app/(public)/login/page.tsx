import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <>
      <PageHero
        title="Customer Login"
        subtitle="Access your Logicarts dashboard."
      />

      <PageContainer>

        <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 shadow">

          <input
            className="mb-4 w-full rounded-lg border p-4"
            placeholder="Email"
          />

          <input
            type="password"
            className="mb-6 w-full rounded-lg border p-4"
            placeholder="Password"
          />

          <Button className="w-full">
            Sign In
          </Button>

        </div>

      </PageContainer>
    </>
  );
}
