"use client";

import { useState } from "react";
import PageHero from "@/components/page/PageHero";
import PageContainer from "@/components/page/PageContainer";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Message sent successfully.");

        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert(result.error);
      }
    } catch {
      alert("Unable to send message.");
    }

    setLoading(false);
  };

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
                value={form.name}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className="w-full rounded-lg border p-4"
                placeholder="Full Name"
              />

              <input
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className="w-full rounded-lg border p-4"
                placeholder="Email Address"
              />

              <input
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                className="w-full rounded-lg border p-4"
                placeholder="Phone Number"
              />

              <textarea
                value={form.message}
                onChange={(e) =>
                  handleChange("message", e.target.value)
                }
                rows={6}
                className="w-full rounded-lg border p-4"
                placeholder="Your Message"
              />

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Send Message"}
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
