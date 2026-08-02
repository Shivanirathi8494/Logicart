export interface RateRequest {
  origin: string;
  destination: string;
  chargeableWeight: number;
}

export interface RateResponse {
  freight: number;
  gst: number;
  total: number;
}

export function calculateRate(
  request: RateRequest
): RateResponse {

  // Temporary flat rate
  const ratePerKg = 120;

  const freight =
    request.chargeableWeight * ratePerKg;

  const gst = freight * 0.18;

  return {
    freight,
    gst,
    total: freight + gst,
  };
}
