export function generateTrackingNumber(
  origin: string,
  destination: string,
  sequence: number
) {
  const today = new Date();

  const yy = String(today.getFullYear()).slice(-2);
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const seq = String(sequence).padStart(6, "0");

  return `${origin}-${destination}-${yy}${mm}${dd}-${seq}`;
}
