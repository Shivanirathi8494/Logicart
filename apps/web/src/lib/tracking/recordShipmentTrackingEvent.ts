import type {
  Prisma,
  ShipmentStatus,
  ShipmentTrackingEventType,
} from "@prisma/client";

type TrackingClient = Pick<Prisma.TransactionClient, "shipmentTrackingEvent">;

type RecordShipmentTrackingEventInput = {
  db: TrackingClient;
  shipmentId: string;
  status: ShipmentStatus;
  locationCode: string;
  locationName?: string | null;
  eventType?: ShipmentTrackingEventType;
  createdByUserId?: string | null;
  remarks?: string | null;
  eventAt?: Date;
};

export async function recordShipmentTrackingEvent({
  db,
  shipmentId,
  status,
  locationCode,
  locationName = null,
  eventType = "STATUS_CHANGE",
  createdByUserId = null,
  remarks = null,
  eventAt = new Date(),
}: RecordShipmentTrackingEventInput) {
  return db.shipmentTrackingEvent.create({
    data: {
      shipmentId,
      status,
      eventType,
      locationCode: locationCode.trim().toUpperCase(),
      locationName: locationName?.trim() || null,
      createdByUserId,
      remarks: remarks?.trim() || null,
      eventAt,
    },
  });
}
