export interface Airport {
  code: string;
  city: string;
  airport: string;
}

export const airports: Airport[] = [
  // Andhra Pradesh
  { code: "TIR", city: "Tirupati", airport: "Tirupati Airport" },
  { code: "VGA", city: "Vijayawada", airport: "Vijayawada International Airport" },
  { code: "VTZ", city: "Visakhapatnam", airport: "Visakhapatnam International Airport" },
  { code: "RJA", city: "Rajahmundry", airport: "Rajahmundry Airport" },
  { code: "KJB", city: "Kurnool", airport: "Kurnool Airport" },

  // Arunachal Pradesh
  { code: "HGI", city: "Itanagar", airport: "Donyi Polo Airport" },
  { code: "IXT", city: "Pasighat", airport: "Pasighat Airport" },

  // Assam
  { code: "GAU", city: "Guwahati", airport: "Lokpriya Gopinath Bordoloi International Airport" },
  { code: "DIB", city: "Dibrugarh", airport: "Dibrugarh Airport" },
  { code: "DMU", city: "Dimapur", airport: "Dimapur Airport" },
  { code: "JRH", city: "Jorhat", airport: "Jorhat Airport" },
  { code: "IXI", city: "Lilabari", airport: "Lilabari Airport" },
  { code: "TEZ", city: "Tezpur", airport: "Tezpur Airport" },
  { code: "RUP", city: "Rupsi", airport: "Rupsi Airport" },
  { code: "SHL", city: "Shillong", airport: "Shillong Airport" },

  // Bihar
  { code: "PAT", city: "Patna", airport: "Jay Prakash Narayan International Airport" },
  { code: "GAY", city: "Gaya", airport: "Gaya International Airport" },
  { code: "DBR", city: "Darbhanga", airport: "Darbhanga Airport" },
  { code: "Purnea", city: "Purnea", airport: "Purnea Airport" },

  // Chandigarh
  { code: "IXC", city: "Chandigarh", airport: "Chandigarh International Airport" },

  // Chhattisgarh
  { code: "RPR", city: "Raipur", airport: "Swami Vivekananda Airport" },
  { code: "PAB", city: "Bilaspur", airport: "Bilasa Devi Kevat Airport" },

  // Delhi
  { code: "DEL", city: "Delhi", airport: "Indira Gandhi International Airport" },

  // Goa
  { code: "GOI", city: "Goa", airport: "Dabolim Airport" },
  { code: "GOX", city: "Goa", airport: "Manohar International Airport" },

  // Gujarat
  { code: "AMD", city: "Ahmedabad", airport: "Sardar Vallabhbhai Patel International Airport" },
  { code: "BDQ", city: "Vadodara", airport: "Vadodara Airport" },
  { code: "BHJ", city: "Bhuj", airport: "Bhuj Airport" },
  { code: "BHU", city: "Bhavnagar", airport: "Bhavnagar Airport" },
  { code: "JGA", city: "Jamnagar", airport: "Jamnagar Airport" },
  { code: "IXK", city: "Keshod", airport: "Keshod Airport" },
  { code: "PBD", city: "Porbandar", airport: "Porbandar Airport" },
  { code: "RAJ", city: "Rajkot", airport: "Rajkot International Airport" },
  { code: "STV", city: "Surat", airport: "Surat Airport" },

  // Haryana
  { code: "HSS", city: "Hisar", airport: "Hisar Airport" },

  // Himachal Pradesh
  { code: "KUU", city: "Kullu", airport: "Kullu-Manali Airport" },
  { code: "DHM", city: "Kangra", airport: "Kangra Airport" },
  { code: "SLV", city: "Shimla", airport: "Shimla Airport" },

  // Jammu & Kashmir
  { code: "IXJ", city: "Jammu", airport: "Jammu Airport" },
  { code: "SXR", city: "Srinagar", airport: "Srinagar International Airport" },

  // Jharkhand
  { code: "IXW", city: "Jamshedpur", airport: "Sonari Airport" },
  { code: "IXR", city: "Ranchi", airport: "Birsa Munda Airport" },
  { code: "DGH", city: "Deoghar", airport: "Deoghar Airport" },

  // Karnataka
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda International Airport" },
  { code: "IXE", city: "Mangaluru", airport: "Mangaluru International Airport" },
  { code: "HBX", city: "Hubballi", airport: "Hubballi Airport" },
  { code: "MYQ", city: "Mysuru", airport: "Mysuru Airport" },
  { code: "IXG", city: "Belagavi", airport: "Belagavi Airport" },
  { code: "CNN", city: "Kannur", airport: "Kannur International Airport" },
  { code: "GBI", city: "Kalaburagi", airport: "Kalaburagi Airport" },

  // Kerala
  { code: "COK", city: "Kochi", airport: "Cochin International Airport" },
  { code: "CCJ", city: "Kozhikode", airport: "Calicut International Airport" },
  { code: "TRV", city: "Thiruvananthapuram", airport: "Trivandrum International Airport" },

  // Madhya Pradesh
  { code: "BHO", city: "Bhopal", airport: "Raja Bhoj Airport" },
  { code: "IDR", city: "Indore", airport: "Devi Ahilya Bai Holkar Airport" },
  { code: "JLR", city: "Jabalpur", airport: "Jabalpur Airport" },
  { code: "GWL", city: "Gwalior", airport: "Rajmata Vijaya Raje Scindia Airport" },
  { code: "HJR", city: "Khajuraho", airport: "Khajuraho Airport" },
  { code: "REW", city: "Rewa", airport: "Rewa Airport" },

  // Maharashtra
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj International Airport" },
  { code: "NAG", city: "Nagpur", airport: "Dr. Babasaheb Ambedkar International Airport" },
  { code: "PNQ", city: "Pune", airport: "Pune Airport" },
  { code: "NDC", city: "Nanded", airport: "Shri Guru Gobind Singh Ji Airport" },
  { code: "IXU", city: "Aurangabad", airport: "Chhatrapati Sambhajinagar Airport" },
  { code: "ISK", city: "Nashik", airport: "Nashik Airport" },
  { code: "SAG", city: "Shirdi", airport: "Shirdi Airport" },
  { code: "KLH", city: "Kolhapur", airport: "Kolhapur Airport" },
  { code: "RTC", city: "Ratnagiri", airport: "Ratnagiri Airport" },

  // Manipur
  { code: "IMF", city: "Imphal", airport: "Bir Tikendrajit International Airport" },

  // Meghalaya

  // Mizoram
  { code: "AJL", city: "Aizawl", airport: "Lengpui Airport" },

  // Nagaland

  // Odisha
  { code: "BBI", city: "Bhubaneswar", airport: "Biju Patnaik International Airport" },
  { code: "JRG", city: "Jharsuguda", airport: "Veer Surendra Sai Airport" },
  { code: "PYB", city: "Jeypore", airport: "Jeypore Airport" },

  // Puducherry
  { code: "PNY", city: "Puducherry", airport: "Puducherry Airport" },

  // Punjab
  { code: "ATQ", city: "Amritsar", airport: "Sri Guru Ram Dass Jee International Airport" },
  { code: "LUH", city: "Ludhiana", airport: "Ludhiana Airport" },
  { code: "IXP", city: "Pathankot", airport: "Pathankot Airport" },
  { code: "AIP", city: "Adampur", airport: "Adampur Airport" },

  // Rajasthan
  { code: "JAI", city: "Jaipur", airport: "Jaipur International Airport" },
  { code: "JDH", city: "Jodhpur", airport: "Jodhpur Airport" },
  { code: "UDR", city: "Udaipur", airport: "Maharana Pratap Airport" },
  { code: "JSA", city: "Jaisalmer", airport: "Jaisalmer Airport" },
  { code: "BKB", city: "Bikaner", airport: "Nal Airport" },
  { code: "KQH", city: "Kishangarh", airport: "Kishangarh Airport" },

  // Sikkim
  { code: "PYG", city: "Pakyong", airport: "Pakyong Airport" },

  // Tamil Nadu
  { code: "MAA", city: "Chennai", airport: "Chennai International Airport" },
  { code: "CJB", city: "Coimbatore", airport: "Coimbatore International Airport" },
  { code: "IXM", city: "Madurai", airport: "Madurai Airport" },
  { code: "TRZ", city: "Tiruchirappalli", airport: "Tiruchirappalli International Airport" },
  { code: "TCR", city: "Thoothukudi", airport: "Tuticorin Airport" },
  { code: "TJV", city: "Thanjavur", airport: "Thanjavur Airport" },
  { code: "SXV", city: "Salem", airport: "Salem Airport" },

  // Telangana
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi International Airport" },

  // Tripura
  { code: "IXA", city: "Agartala", airport: "Maharaja Bir Bikram Airport" },

  // Uttar Pradesh
  { code: "LKO", city: "Lucknow", airport: "Chaudhary Charan Singh International Airport" },
  { code: "VNS", city: "Varanasi", airport: "Lal Bahadur Shastri International Airport" },
  { code: "AGR", city: "Agra", airport: "Agra Airport" },
  { code: "KNU", city: "Kanpur", airport: "Kanpur Airport" },
  { code: "IXD", city: "Prayagraj", airport: "Prayagraj Airport" },
  { code: "GOP", city: "Gorakhpur", airport: "Gorakhpur Airport" },
  { code: "AYJ", city: "Ayodhya", airport: "Maharishi Valmiki International Airport" },
  { code: "VSV", city: "Kushinagar", airport: "Kushinagar International Airport" },
  { code: "HDO", city: "Hindon", airport: "Hindon Airport" },

  // Uttarakhand
  { code: "DED", city: "Dehradun", airport: "Jolly Grant Airport" },
  { code: "PGH", city: "Pantnagar", airport: "Pantnagar Airport" },
  { code: "NNS", city: "Nainital", airport: "Nainital Airport" },

  // West Bengal
  { code: "CCU", city: "Kolkata", airport: "Netaji Subhas Chandra Bose International Airport" },
  { code: "IXB", city: "Bagdogra", airport: "Bagdogra International Airport" },
  { code: "RDP", city: "Durgapur", airport: "Kazi Nazrul Islam Airport" },
  { code: "COH", city: "Cooch Behar", airport: "Cooch Behar Airport" },

  // Andaman & Nicobar Islands
  { code: "IXZ", city: "Port Blair", airport: "Veer Savarkar International Airport" },

  // Ladakh
  { code: "IXL", city: "Leh", airport: "Kushok Bakula Rimpochee Airport" },

  // Lakshadweep
  { code: "AGX", city: "Agatti", airport: "Agatti Airport" },
];
