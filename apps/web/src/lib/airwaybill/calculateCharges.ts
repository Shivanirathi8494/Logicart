export function calculateCharges(shipment: any) {
  const freight = Number(shipment.freight || 0);

  const gst = Number(shipment.gst || 0);

  const total = Number(shipment.total || 0);

  const chargeableWeight =
    Number(shipment.chargeableWeight || 0);

  const rate =
    chargeableWeight > 0
      ? freight / chargeableWeight
      : 0;

  return {
    freight,
    gst,
    total,
    rate,
    collect: 0,
  };
}
