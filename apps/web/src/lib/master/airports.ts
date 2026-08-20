export type Airport = {
  code: string;
  city: string;
  airport: string;
};

export const airports: Airport[] = [
  { code: "AGX", city: "Agatti", airport: "Agatti Airport" },
  { code: "AHA", city: "Aizawl Region", airport: "Alliance Schedule Station AHA" },
  { code: "AJL", city: "Aizawl", airport: "Lengpui Airport" },
  { code: "AMD", city: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport" },
  { code: "ATQ", city: "Amritsar", airport: "Sri Guru Ram Dass Jee International Airport" },
  { code: "AVR", city: "Alliance Station AVR", airport: "Alliance Schedule Station AVR" },
  { code: "AYJ", city: "Ayodhya", airport: "Maharishi Valmiki International Airport Ayodhya Dham" },

  { code: "BBI", city: "Bhubaneswar", airport: "Biju Patnaik International Airport" },
  { code: "BDQ", city: "Vadodara", airport: "Vadodara Airport" },
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda International Airport" },
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "BUP", city: "Bathinda", airport: "Bathinda Airport" },

  { code: "CCU", city: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport" },
  { code: "COK", city: "Kochi", airport: "Cochin International Airport" },

  { code: "DED", city: "Dehradun", airport: "Jolly Grant Airport" },
  { code: "DEL", city: "Delhi", airport: "Indira Gandhi International Airport" },
  { code: "DHM", city: "Dharamshala", airport: "Kangra Airport" },
  { code: "DIU", city: "Diu", airport: "Diu Airport" },
  { code: "DMU", city: "Dimapur", airport: "Dimapur Airport" },

  { code: "GAU", city: "Guwahati", airport: "Lokpriya Gopinath Bordoloi International Airport" },
  { code: "GOI", city: "Goa", airport: "Dabolim Airport" },
  { code: "GOX", city: "Goa", airport: "Manohar International Airport" },
  { code: "GOP", city: "Gorakhpur", airport: "Gorakhpur Airport" },

  { code: "HGI", city: "Hollongi", airport: "Donyi Polo Airport" },
  { code: "HSS", city: "Hisar", airport: "Maharaja Agrasen Airport" },
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi International Airport" },

  { code: "IDR", city: "Indore", airport: "Devi Ahilyabai Holkar Airport" },
  { code: "IMF", city: "Imphal", airport: "Bir Tikendrajit International Airport" },
  { code: "IXA", city: "Agartala", airport: "Maharaja Bir Bikram Airport" },
  { code: "IXB", city: "Bagdogra", airport: "Bagdogra Airport" },
  { code: "IXC", city: "Chandigarh", airport: "Chandigarh International Airport" },
  { code: "IXD", city: "Prayagraj", airport: "Prayagraj Airport" },
  { code: "IXE", city: "Mangaluru", airport: "Mangaluru International Airport" },
  { code: "IXG", city: "Belagavi", airport: "Belagavi Airport" },
  { code: "IXI", city: "Lilabari", airport: "Lilabari Airport" },
  { code: "IXJ", city: "Jammu", airport: "Jammu Airport" },
  { code: "IXK", city: "Keshod", airport: "Keshod Airport" },
  { code: "IXL", city: "Leh", airport: "Kushok Bakula Rimpochee Airport" },
  { code: "IXM", city: "Madurai", airport: "Madurai Airport" },
  { code: "IXR", city: "Ranchi", airport: "Birsa Munda Airport" },
  { code: "IXS", city: "Silchar", airport: "Silchar Airport" },
  { code: "IXT", city: "Pasighat", airport: "Pasighat Airport" },
  { code: "IXU", city: "Aurangabad", airport: "Chhatrapati Sambhajinagar Airport" },
  { code: "IXZ", city: "Port Blair", airport: "Veer Savarkar International Airport" },

  { code: "JAI", city: "Jaipur", airport: "Jaipur International Airport" },
  { code: "JDH", city: "Jodhpur", airport: "Jodhpur Airport" },
  { code: "JGB", city: "Jagdalpur", airport: "Jagdalpur Airport" },
  { code: "JLG", city: "Alliance Station JLG", airport: "Alliance Schedule Station JLG" },
  { code: "JLR", city: "Jabalpur", airport: "Jabalpur Airport" },

  { code: "KUU", city: "Kullu", airport: "Kullu Manali Airport" },

  { code: "LKO", city: "Lucknow", airport: "Chaudhary Charan Singh International Airport" },

  { code: "MAA", city: "Chennai", airport: "Chennai International Airport" },

  { code: "NAG", city: "Nagpur", airport: "Dr. Babasaheb Ambedkar International Airport" },
  { code: "NNS", city: "Naini Saini", airport: "Naini Saini Airport" },

  { code: "PAB", city: "Bilaspur", airport: "Bilasa Devi Kevat Airport" },
  { code: "PAT", city: "Patna", airport: "Jay Prakash Narayan Airport" },
  { code: "PNQ", city: "Pune", airport: "Pune Airport" },

  { code: "RJA", city: "Rajahmundry", airport: "Rajahmundry Airport" },
  { code: "REW", city: "Rewa", airport: "Rewa Airport" },
  { code: "RPR", city: "Raipur", airport: "Swami Vivekananda Airport" },
  { code: "RUP", city: "Rupsi", airport: "Rupsi Airport" },

  { code: "SHL", city: "Shillong", airport: "Shillong Airport" },
  { code: "SLV", city: "Shimla", airport: "Shimla Airport" },
  { code: "SXR", city: "Srinagar", airport: "Sheikh ul-Alam International Airport" },
  { code: "SXV", city: "Salem", airport: "Salem Airport" },

  { code: "TEI", city: "Tezu", airport: "Tezu Airport" },
  { code: "TIR", city: "Tirupati", airport: "Tirupati Airport" },
  { code: "TRV", city: "Thiruvananthapuram", airport: "Trivandrum International Airport" },
  { code: "TRZ", city: "Tiruchirappalli", airport: "Tiruchirappalli International Airport" },

  { code: "UDR", city: "Udaipur", airport: "Maharana Pratap Airport" },

  { code: "VGA", city: "Vijayawada", airport: "Vijayawada International Airport" },
  { code: "VTZ", city: "Visakhapatnam", airport: "Visakhapatnam International Airport" },

  { code: "ZER", city: "Ziro", airport: "Ziro Airport" },
];

export const airportByCode =
  Object.fromEntries(
    airports.map((airport) => [
      airport.code,
      airport,
    ]),
  );
