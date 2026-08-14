import { MapPin } from "lucide-react";

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

export default function AirPresence() {
  const cities = [
    ...majorMetros,
    ...nonMetroHubs,
    ...regionalConnectivity,
  ];

  return (
    <section className="overflow-hidden bg-[#0b2340] py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ff7417]">
            Our Air Presence
          </p>

          <h2 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">
            31+ Cities. One Network.
          </h2>
        </div>

        <div className="relative mt-16 overflow-hidden">
          <div className="city-marquee flex min-w-max gap-4 pb-3">
            {[...cities, ...cities].map((city, index) => (
              <div
                key={`${city}-${index}`}
                className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-medium backdrop-blur-sm"
              >
                <MapPin
                  size={18}
                  className="text-[#ff7417]"
                />
                {city}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 text-center">
          <p className="mx-auto max-w-2xl text-base leading-7 text-slate-300">
            Connecting businesses across metropolitan cities,
            regional hubs and emerging destinations throughout India.
          </p>
        </div>

      </div>


    </section>
  );
}
