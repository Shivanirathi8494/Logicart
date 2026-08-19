"use client";

import Image from "next/image";

type Props = {
  shipment: any;
};

function value(value: unknown): string {
  return value == null ? "" : String(value);
}

function formatMoney(value: unknown): string {
  const number = Number(value) || 0;
  return number.toFixed(2);
}

function formatDate(value: unknown): string {
  if (!value) return "";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN");
}

export default function PrintableAirWaybill({
  shipment,
}: Props) {
  const packages = Array.isArray(shipment.packages)
    ? shipment.packages
    : [];

  const airlineName =
    shipment.airline?.name || "Alliance Air";

  const airlineCode =
    shipment.airline?.iataDesignator || "9I";

  return (
    <div
      className="mx-auto bg-white text-black"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "6mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "10px",
        lineHeight: "1.2",
      }}
    >
      <table
        className="w-full border-collapse"
        style={{ border: "1px solid #000" }}
      >
        <tbody>

          {/* HEADER / SHIPPER */}
          <tr>
            <td
              rowSpan={3}
              style={{
                border: "1px solid #000",
                width: "38%",
                verticalAlign: "top",
                padding: "6px",
              }}
            >
              <b>Shipper&apos;s Name and Address</b>

              <div style={{ marginTop: "8px" }}>
                <div>
                  <b>{value(shipment.senderName)}</b>
                </div>

                <div>{value(shipment.senderAddress)}</div>

                <div>
                  {value(shipment.senderCity)}
                  {shipment.senderCity && shipment.senderState
                    ? ", "
                    : ""}
                  {value(shipment.senderState)}
                </div>

                <div>
                  PIN : {value(shipment.senderPincode)}
                </div>

                <div>
                  GSTIN : {value(shipment.senderGSTIN)}
                </div>

                <div>
                  Mob : {value(shipment.senderPhone)}
                </div>
              </div>
            </td>

            <td
              style={{
                border: "1px solid #000",
                width: "14%",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Not Negotiable
            </td>

            <td
              rowSpan={3}
              style={{
                border: "1px solid #000",
                width: "48%",
                padding: "6px",
                verticalAlign: "top",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "8px",
                  paddingTop: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  AIR WAYBILL
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  (Air Consignment Note)
                </div>

                <div>issued by</div>

                <div>
                  <img
                    src="/logo/alliance-air-logo.png"
                    alt="Alliance Air"
                    style={{
                      maxWidth: "220px",
                      maxHeight: "60px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display="none";
                    }}
                  />
                </div>

                <div>
                  <Image
                    src="/logo/logicarts-logo.png"
                    alt="Logicarts"
                    width={130}
                    height={45}
                  />
                </div>

                <div
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {airlineName} ({airlineCode})
                </div>
              </div>
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                fontSize: "8px",
                padding: "4px",
              }}
            >
              Copies 1, 2 and 3 of this Air Waybill are originals
              and have the same validity.
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                textAlign: "center",
                padding: "6px",
                fontWeight: "bold",
              }}
            >
              AWB No.
              <br />
              {value(shipment.trackingNumber)}
            </td>
          </tr>

          {/* CONSIGNEE */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
                verticalAlign: "top",
              }}
            >
              <b>Consignee&apos;s Name and Address</b>

              <div style={{ marginTop: "8px" }}>
                <div>
                  <b>{value(shipment.receiverName)}</b>
                </div>

                <div>{value(shipment.receiverAddress)}</div>

                <div>
                  {value(shipment.receiverCity)}
                  {shipment.receiverCity && shipment.receiverState
                    ? ", "
                    : ""}
                  {value(shipment.receiverState)}
                </div>

                <div>
                  PIN : {value(shipment.receiverPincode)}
                </div>

                <div>
                  GSTIN : {value(shipment.receiverGSTIN)}
                </div>

                <div>
                  Mob : {value(shipment.receiverPhone)}
                </div>
              </div>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
                verticalAlign: "top",
              }}
            >
              <b>Consignee&apos;s Account Number</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
                fontSize: "8px",
                lineHeight: "1.3",
              }}
            >
              It is agreed that the goods described herein are accepted
              in apparent good order and condition (except as noted)
              for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON
              THE REVERSE HEREOF.
              <br />
              <br />
              ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING
              ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY
              INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER.
            </td>
          </tr>

          {/* AGENT */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              <b>Issuing Carrier&apos;s Agent Name and City</b>
              <br />
              <br />
              Logicarts Logistics Pvt Ltd
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              <b>Accounting Information</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            />
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Agent&apos;s IATA Code</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Account No.</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Optional Shipping Information</b>
            </td>
          </tr>

          {/* ROUTING */}
          <tr>
            <td
              colSpan={2}
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Airport of Departure (Addr. of First Carrier)</b>
              <br />
              <br />
              {value(shipment.origin)}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Reference Number</b>
              <br />
              <br />
              
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Routing and Destination</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>By First Carrier</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Destination</b>
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
                height: "45px",
              }}
            >
              {value(shipment.origin)}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              {airlineName}
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              {value(shipment.destination)}
            </td>
          </tr>

          {/* FLIGHT */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Flight / Date</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Requested Flight</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Requested Date</b>
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "8px",
                height: "40px",
              }}
            >
              <div>
                {value(shipment.flightNumber) || "Alliance Air"}
              </div>

              <div>
                {value(shipment.aircraftType)}
              </div>

              <div>
                Terminal {value(shipment.arrivalTerminal)}
              </div>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "8px",
              }}
            >
              <div>
                {value(shipment.flightNumber) || "Alliance Air"}
              </div>

              <div>
                {value(shipment.aircraftType)}
              </div>

              <div>
                Terminal {value(shipment.arrivalTerminal)}
              </div>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "8px",
              }}
            >
              {formatDate(shipment.bookingDate)}
            </td>
          </tr>

          {/* CHARGES META */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Currency</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>CHGS Code</b>
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Declared Value for Carriage</b>
            </td>
          </tr>

          <tr>
            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              INR
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              PP
            </td>

            <td
              style={{
                border: "1px solid #000",
                padding: "6px",
              }}
            >
              NVD
            </td>
          </tr>

          {/* HANDLING */}
          <tr>
            <td
              colSpan={3}
              style={{
                border: "1px solid #000",
                padding: "4px",
              }}
            >
              <b>Handling Information</b>

              <div
                style={{
                  minHeight: "50px",
                  marginTop: "8px",
                }}
              >
                
{value(shipment.contents)}

<div style={{marginTop:"8px"}}>
STD:
{" "}
{shipment.scheduledDeparture
?new Date(
shipment.scheduledDeparture
).toLocaleTimeString(
"en-IN",
{
hour:"2-digit",
minute:"2-digit",
}
)
:""}
</div>

<div>
STA:
{" "}
{shipment.scheduledArrival
?new Date(
shipment.scheduledArrival
).toLocaleTimeString(
"en-IN",
{
hour:"2-digit",
minute:"2-digit",
}
)
:""}
</div>

              </div>
            </td>
          </tr>

          {/* CARGO / CHARGES */}
          <tr>
            <td
              colSpan={3}
              style={{
                border: "1px solid #000",
                padding: "0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "9px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "4px",
                        width: "8%",
                      }}
                    >
                      No. of
                      <br />
                      Pieces
                    </th>

                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "4px",
                        width: "14%",
                      }}
                    >
                      Actual /
                      <br />
                      Gross Weight
                    </th>

                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "4px",
                        width: "14%",
                      }}
                    >
                      Chargeable
                      <br />
                      Weight
                    </th>

                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "4px",
                        width: "44%",
                      }}
                    >
                      Nature and Quantity of Goods
                      <br />
                      (Including Dimensions or Volume)
                    </th>

                    <th
                      style={{
                        border: "1px solid #000",
                        padding: "4px",
                        width: "20%",
                      }}
                    >
                      Charges
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {value(shipment.packageCount)}
                    </td>

                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {value(shipment.actualWeight)}
                      KG
                    </td>

                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {value(shipment.chargeableWeight)}
                      KG
                    </td>

                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        minHeight: "110px",
                        verticalAlign: "top",
                      }}
                    >
                      <div>
                        {value(shipment.contents)}
                      </div>

                      {packages.length > 0 && (
                        <>
                          <div style={{ marginTop: "10px" }}>
                            <b>Dimensions</b>
                          </div>

                          {packages.map(
                            (pkg: any, index: number) => (
                              <div key={index}>
                                {value(pkg.length)} ×{" "}
                                {value(pkg.width)} ×{" "}
                                {value(pkg.height)} cm
                              </div>
                            ),
                          )}
                        </>
                      )}
                    </td>

                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        verticalAlign: "top",
                      }}
                    >
                      <div>
                        Freight : ₹{" "}
                        {formatMoney(shipment.freight)}
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        GST : ₹{" "}
                        {formatMoney(shipment.gst)}
                      </div>

                      <div style={{ marginTop: "12px" }}>
                        <b>
                          Total : ₹{" "}
                          {formatMoney(shipment.total)}
                        </b>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* FOOTER */}
          <tr>
            <td
              colSpan={3}
              style={{
                border: "1px solid #000",
                padding: "8px",
                fontSize: "8px",
              }}
            >
              <b>Declared Value for Carriage :</b> NVD
            </td>
          </tr>

          <tr>
            <td
              colSpan={3}
              style={{
                border: "1px solid #000",
                padding: "8px",
                fontSize: "8px",
              }}
            >
              <b>Shipper&apos;s Certification</b>
              <br />
              The information supplied by the shipper is complete
              and accurate to the best of the shipper&apos;s knowledge.
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  );
}
