export function generateDocketNumber(sequence: number) {
  const now = new Date();

  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");

  const seq = String(sequence).padStart(6, "0");

  return `SRC${yy}${mm}${dd}${seq}`;
}
