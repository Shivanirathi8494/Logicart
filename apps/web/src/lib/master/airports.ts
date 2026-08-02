export interface Airport {
  code: string;
  city: string;
  airport: string;
}

export const airports: Airport[] = [
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda International Airport" },
  { code: "DEL", city: "Delhi", airport: "Indira Gandhi International Airport" },
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi International Airport" },
  { code: "MAA", city: "Chennai", airport: "Chennai International Airport" },
  { code: "CCU", city: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport" },
  { code: "AMD", city: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport" },
];
