import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We're here to help with your logistics and shipment needs."
      />

      <PageContainer>

        <div className="grid gap-10 lg:grid-cols-2">

          <div className="rounded-2xl border bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-3xl font-bold">
              Send us a Message
            </h2>

            <div className="space-y-5">

              <input
                className="w-full rounded-lg border p-4"
                placeholder="Full Name"
              />

              <input
                className="w-full rounded-lg border p-4"
                placeholder="Email Address"
              />

              <input
                className="w-full rounded-lg border p-4"
                placeholder="Phone Number"
              />

              <textarea
                rows={6}
                className="w-full rounded-lg border p-4"
                placeholder="Your Message"
              />

              <Button className="w-full">
                Send Message
              </Button>

            </div>

          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm">

            <h2 className="mb-6 text-3xl font-bold">
              Contact Us Information
            </h2>

            <div className="space-y-6 text-gray-700">

              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>

              <div>
                <strong>Email</strong>
                <p>info@logicarts.in</p>
              </div>

              <div>
                <strong>Office</strong>
                <p>Bangalore, Karnataka, India</p>
              </div>

            </div>

            <div className="mt-10 flex h-72 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              Google Map (Coming Soon)
            </div>

          </div>

        </div>

      </PageContainer>    </>
  );
}
