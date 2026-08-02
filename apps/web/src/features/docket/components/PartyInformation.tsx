type Props = {
  title: string;
};

export default function PartyInformation({ title }: Props) {
  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        {title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        <input
          className="rounded-lg border p-3"
          placeholder="Name"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Contact Person"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Mobile Number"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Email Address"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="GST Number (Optional)"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Address Line 1"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Address Line 2"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="City"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="State"
        />

        <input
          className="rounded-lg border p-3"
          placeholder="Pincode"
        />

      </div>
    </section>
  );
}
