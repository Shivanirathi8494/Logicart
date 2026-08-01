const majorMetros = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

const nonMetroHubs = [
  "Pune",
  "Guwahati",
  "Kochi",
  "Jaipur",
  "Lucknow",
  "Bhubaneswar",
  "Indore",
  "Coimbatore",
  "Nagpur",
  "Surat",
  "Mangalore",
  "Ranchi",
];

const regionalConnectivity = [
  "Dehradun",
  "Imphal",
  "Aizawl",
  "Agatti",
  "Dimapur",
  "Dibrugarh",
  "Jorhat",
  "Shillong",
  "Belagavi",
  "Mysuru",
  "Diu",
  "Port Blair",
];

function CityGrid({
  title,
  cities,
}: {
  title: string;
  cities: string[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h3 className="mb-6 text-2xl font-bold text-[#1877F2]">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cities.map((city) => (
          <div
            key={city}
            className="rounded-lg bg-slate-50 px-4 py-3 text-center font-medium text-slate-700 transition hover:bg-[#1877F2] hover:text-white"
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AirPresence() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-5xl font-bold text-slate-900">
            Our Air Presence
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Connecting businesses across India through an extensive air cargo network.
          </p>
        </div>

        <div className="mt-16 space-y-8">

          <CityGrid
            title="✈️ Major Metros"
            cities={majorMetros}
          />

          <CityGrid
            title="📍 Major Non-Metro Hubs"
            cities={nonMetroHubs}
          />

          <CityGrid
            title="🌐 Regional & Tier-3 Connectivity"
            cities={regionalConnectivity}
          />

        </div>

        <div className="mt-16 rounded-2xl bg-[#1877F2] p-10 text-center text-white">
          <h3 className="text-4xl font-bold">
            31+ Strategic Locations
          </h3>

          <p className="mt-3 text-lg text-blue-100">
            Delivering reliable air cargo connectivity across metropolitan cities,
            regional hubs, and emerging destinations throughout India.
          </p>
        </div>

      </div>
    </section>
  );
}
