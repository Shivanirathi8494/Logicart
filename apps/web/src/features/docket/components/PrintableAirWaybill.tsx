"use client";

import Image from "next/image";

type Props = {
  shipment: any;
};

export default function PrintableAirWaybill({
  shipment,
}: Props) {

  return (

<div
className="mx-auto bg-white text-black"
style={{
width:"210mm",
minHeight:"297mm",
padding:"6mm",
fontFamily:"Arial, Helvetica, sans-serif",
fontSize:"10px",
lineHeight:"1.2",
}}
>

<table
className="w-full border-collapse"
style={{
border:"1px solid #000",
}}
>

<tbody>

<tr>

<td
rowSpan={3}
style={{
border:"1px solid #000",
width:"38%",
verticalAlign:"top",
padding:"6px",
}}
>

<b>Shipper's Name and Address</b>

<div className="mt-2">

<div><b>{shipment.senderName}</b></div>

<div>{shipment.senderAddress}</div>

<div>
{shipment.senderCity},
{shipment.senderState}
</div>

<div>
PIN : {shipment.senderPincode}
</div>

<div>
GSTIN :
{shipment.senderGSTIN}
</div>

<div>
Mob :
{shipment.senderPhone}
</div>

</div>

</td>

<td
style={{
border:"1px solid #000",
width:"14%",
textAlign:"center",
fontWeight:"bold",
}}
>

Not Negotiable

</td>

<td
rowSpan={3}
style={{
border:"1px solid #000",
width:"48%",
padding:"6px",
verticalAlign:"top",
}}
>

<div className="flex justify-between items-start">

<div>

<div
style={{
fontSize:"22px",
fontWeight:"bold",
}}
>

AIR WAYBILL

</div>

<div
style={{
fontWeight:"bold",
}}
>

(Air Consignment Note)

</div>

<div className="mt-1">

issued by

</div>

<div
style={{
fontSize:"18px",
fontWeight:"bold",
}}
>

LOGICARTS

</div>

</div>

<Image
src="/logo/logicarts-logo.png"
alt="Logicarts"
width={120}
height={45}
/>

</div>

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
textAlign:"center",
fontSize:"8px",
padding:"4px",
}}
>

Copies 1,2 and 3 of this Air Waybill are originals and have the same validity

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
textAlign:"center",
padding:"6px",
fontWeight:"bold",
}}
>

AWB No.

<br/>

{shipment.trackingNumber}

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"6px",
verticalAlign:"top",
}}
>

<b>Consignee's Name and Address</b>

<div className="mt-2">

<div>
<b>{shipment.receiverName}</b>
</div>

<div>
{shipment.receiverAddress}
</div>

<div>
{shipment.receiverCity},
{shipment.receiverState}
</div>

<div>
PIN :
{shipment.receiverPincode}
</div>

<div>
GSTIN :
{shipment.receiverGSTIN}
</div>

<div>
Mob :
{shipment.receiverPhone}
</div>

</div>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
verticalAlign:"top",
}}
>

<b>

Consignee's
Account Number

</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
fontSize:"8px",
lineHeight:"1.3",
}}
>

It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF.

ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER.

THE SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE.

THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITATION OF LIABILITY.

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

<b>

Issuing Carrier's
Agent Name and City

</b>

<br/><br/>

Logicarts Logistics Pvt Ltd

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

<b>

Accounting
Information

</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

&nbsp;

</td>

</tr>
<tr>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Agent's IATA Code</b>

<br/><br/>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Account No.</b>

<br/><br/>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Optional Shipping Information</b>

<br/><br/>

&nbsp;

</td>

</tr>

<tr>

<td
colSpan={2}
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Airport of Departure (Addr. of First Carrier)</b>

<br/><br/>

{shipment.origin}

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Reference Number</b>

<br/><br/>

&nbsp;

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Routing and Destination</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>By First Carrier</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Destination</b>

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"6px",
height:"45px",
}}
>

{shipment.origin}

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

LOGICARTS

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

{shipment.destination}

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Flight / Date</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Requested Flight</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Requested Date</b>

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"8px",
height:"40px",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
}}
>

&nbsp;

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Currency</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>CHGS Code</b>

</td>

<td
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Declared Value for Carriage</b>

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

INR

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

PP

</td>

<td
style={{
border:"1px solid #000",
padding:"6px",
}}
>

NVD

</td>

</tr>

<tr>

<td
colSpan={3}
style={{
border:"1px solid #000",
padding:"4px",
}}
>

<b>Handling Information</b>

<div
style={{
height:"50px",
marginTop:"8px",
}}
>

&nbsp;

</div>

</td>

</tr>
<tr>

<td
colSpan={3}
style={{
border:"1px solid #000",
padding:"0",
}}
>

<table
style={{
width:"100%",
borderCollapse:"collapse",
fontSize:"9px",
}}
>

<thead>

<tr>

<th style={{border:"1px solid #000",padding:"4px",width:"8%"}}>
No. of
Pieces
</th>

<th style={{border:"1px solid #000",padding:"4px",width:"14%"}}>
Gross
Weight
</th>

<th style={{border:"1px solid #000",padding:"4px",width:"14%"}}>
Chargeable
Weight
</th>

<th style={{border:"1px solid #000",padding:"4px",width:"44%"}}>
Nature and Quantity of Goods
(Including Dimensions or Volume)
</th>

<th style={{border:"1px solid #000",padding:"4px",width:"20%"}}>
Charges
</th>

</tr>

</thead>

<tbody>

<tr>

<td
style={{
border:"1px solid #000",
padding:"8px",
textAlign:"center",
}}
>

{shipment.packageCount}

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
textAlign:"center",
}}
>

{shipment.actualWeight}

KG

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
textAlign:"center",
}}
>

{shipment.chargeableWeight}

KG

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
height:"90px",
verticalAlign:"top",
}}
>

<div>

{shipment.contents}

</div>

<br/>

Dimensions

<br/>

{shipment.packages?.map(
(pkg:any,index:number)=>(
<div key={index}>

{pkg.length} × {pkg.width} × {pkg.height} cm

</div>
)
)}

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
verticalAlign:"top",
}}
>

Freight

:
₹ {shipment.freight}

<br/><br/>

GST

:
₹ {shipment.gst}

<br/><br/>

Total

:
₹ {shipment.total}

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"6px",
height:"80px",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
}}
>

&nbsp;

</td>

<td
style={{
border:"1px solid #000",
}}
>

&nbsp;

</td>

</tr>

<tr>

<td
colSpan={5}
style={{
border:"1px solid #000",
padding:"6px",
fontSize:"8px",
}}
>

<b>

Declared Value for Carriage :

</b>

NVD

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

<b>

Declared Value for Customs :

</b>

NCV

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

<b>

Insurance :

</b>

Not Covered

</td>

</tr>

</tbody>

</table>

</td>

</tr>
<tr>

<td
colSpan={3}
style={{
border:"1px solid #000",
padding:"0",
}}
>

<table
style={{
width:"100%",
borderCollapse:"collapse",
fontSize:"9px",
}}
>

<tbody>

<tr>

<td
style={{
border:"1px solid #000",
padding:"8px",
width:"65%",
verticalAlign:"top",
height:"95px",
}}
>

<b>Shipper's Certification</b>

<br/><br/>

I hereby certify that the particulars on this Air Waybill
are correct and complete and that the shipment does not
contain any prohibited or dangerous goods except as
declared.

<br/><br/><br/><br/>

Signature of Shipper

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
verticalAlign:"top",
}}
>

<b>For Logicarts</b>

<br/><br/>

Shipment Accepted

<br/><br/>

Booking Date

<br/>

<b>

{new Date(
shipment.bookingDate
).toLocaleDateString()}

</b>

<br/><br/>

Origin

<br/>

<b>

{shipment.origin}

</b>

<br/><br/>

Destination

<br/>

<b>

{shipment.destination}

</b>

<br/><br/><br/>

Authorized Signature

</td>

</tr>

<tr>

<td
style={{
border:"1px solid #000",
padding:"8px",
}}
>

<b>Remarks</b>

<br/><br/>

{shipment.remarks || "-"}

</td>

<td
style={{
border:"1px solid #000",
padding:"8px",
}}
>

<b>Payment Reference</b>

<br/><br/>

{shipment.paymentReference || "-"}

</td>

</tr>

<tr>

<td
colSpan={2}
style={{
border:"1px solid #000",
padding:"6px",
fontSize:"8px",
textAlign:"center",
}}
>

This is a computer generated Air Waybill and does not require a physical signature.

<br/>

LOGICARTS LOGISTICS PRIVATE LIMITED

</td>

</tr>

</tbody>

</table>

</td>

</tr>

</tbody>

</table>

</div>

);

}