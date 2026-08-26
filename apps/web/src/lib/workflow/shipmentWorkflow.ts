import {
  getShipmentWorkingSide,
} from "@/lib/auth/authorization";

export type WorkingSide =
  | "ORIGIN"
  | "DESTINATION"
  | "BOTH"
  | "NONE";

export type ShipmentNextAction =
  | "INSCAN"
  | "UPDATE_DOCKET"
  | "LOAD_MANIFEST"
  | "UNLOAD"
  | "OUTSCAN"
  | "DELIVERY_CHALLAN"
  | "DELIVER"
  | "NONE";

type ShipmentLike = {
  origin: string;
  destination: string;
  status: string;
};

export function getShipmentWorkflow(
  branchCode: string,
  shipment: ShipmentLike,
): {
  workingSide: WorkingSide;
  nextAction: ShipmentNextAction;
} {
  const workingSide =
    getShipmentWorkingSide(
      branchCode,
      shipment,
    );

  const status =
    shipment.status
      ?.trim()
      .toUpperCase();

  /*
   * ORIGIN WORKING
   *
   * BOOKED
   *   -> Inscan
   *
   * INSCAN
   *   -> Docket update / loading
   *
   * MANIFESTED
   *   -> Origin processing complete
   */
  if (
    workingSide === "ORIGIN" ||
    workingSide === "BOTH"
  ) {
    if (status === "BOOKED") {
      return {
        workingSide,
        nextAction: "INSCAN",
      };
    }

    if (status === "INSCAN") {
      return {
        workingSide,
        nextAction: "LOAD_MANIFEST",
      };
    }

    if (status === "MANIFESTED") {
      return {
        workingSide,
        nextAction: "NONE",
      };
    }
  }

  /*
   * DESTINATION WORKING
   *
   * MANIFESTED
   *   -> Receive / Unload
   *
   * RECEIVED
   *   -> Outscan
   *
   * OUTSCAN
   *   -> Delivery Challan
   *
   * DELIVERED
   *   -> Complete
   */
  if (
    workingSide === "DESTINATION" ||
    workingSide === "BOTH"
  ) {
    if (status === "MANIFESTED") {
      return {
        workingSide,
        nextAction: "UNLOAD",
      };
    }

    if (status === "RECEIVED") {
      return {
        workingSide,
        nextAction: "OUTSCAN",
      };
    }

    if (status === "OUTSCAN") {
      return {
        workingSide,
        nextAction: "DELIVERY_CHALLAN",
      };
    }

    if (status === "DELIVERED") {
      return {
        workingSide,
        nextAction: "NONE",
      };
    }
  }

  return {
    workingSide,
    nextAction: "NONE",
  };
}
