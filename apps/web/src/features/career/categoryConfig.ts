export type CareerCategory =
  | "Delivery Partner"
  | "Fleet Owner"
  | "Franchise Partner"
  | "Warehouse Partner"
  | "Transport Vendor"
  | "Sales Associate";

export interface CareerField {
  name: string;
  label: string;
  type: "text" | "number";
}

export interface CareerConfig {
  title: CareerCategory;
  description: string;
  fields: CareerField[];
  requiresResume: boolean;
}

export const CAREER_CATEGORIES: CareerConfig[] = [
  {
    title: "Delivery Partner",
    description: "Join our growing delivery network.",
    requiresResume: false,
    fields: [
      { name: "vehicleType", label: "Vehicle Type", type: "text" },
      { name: "vehicleNumber", label: "Vehicle Number", type: "text" },
      { name: "licenseNumber", label: "Driving License Number", type: "text" },
    ],
  },

  {
    title: "Fleet Owner",
    description: "Partner your fleet with Logicarts.",
    requiresResume: false,
    fields: [
      { name: "fleetSize", label: "Fleet Size", type: "number" },
      { name: "vehicleTypes", label: "Vehicle Types", type: "text" },
      { name: "coverageArea", label: "Coverage Area", type: "text" },
    ],
  },

  {
    title: "Franchise Partner",
    description: "Expand with the Logicarts network.",
    requiresResume: false,
    fields: [
      { name: "investment", label: "Investment Capacity", type: "text" },
      { name: "officeLocation", label: "Office Location", type: "text" },
      { name: "warehouse", label: "Warehouse Available", type: "text" },
    ],
  },

  {
    title: "Warehouse Partner",
    description: "Provide warehouse and fulfillment support.",
    requiresResume: false,
    fields: [
      { name: "warehouseArea", label: "Warehouse Area (sq.ft)", type: "number" },
      { name: "storageType", label: "Storage Type", type: "text" },
    ],
  },

  {
    title: "Transport Vendor",
    description: "Support nationwide transportation.",
    requiresResume: false,
    fields: [
      { name: "truckCount", label: "Number of Trucks", type: "number" },
      { name: "gps", label: "GPS Enabled", type: "text" },
      { name: "coverage", label: "Coverage Area", type: "text" },
    ],
  },

  {
    title: "Sales Associate",
    description: "Join our business development team.",
    requiresResume: true,
    fields: [
      { name: "experience", label: "Years of Experience", type: "number" },
      { name: "region", label: "Preferred Region", type: "text" },
    ],
  },
];
