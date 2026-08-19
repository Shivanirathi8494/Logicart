export type ExternalFlightSchedule = {
  externalId?: string;

  airlineIata: string;
  airlineName?: string;

  flightNumber: string;

  origin: string;
  destination: string;

  scheduledDeparture: string;
  scheduledArrival: string;

  aircraftType?: string;

  departureTerminal?: string;
  arrivalTerminal?: string;
};
