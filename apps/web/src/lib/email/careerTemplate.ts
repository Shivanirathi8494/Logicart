import { formatSubmissionDate } from "./utils/careerDate";

const LABELS: Record<string, string> = {
  fullName: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  company: "Company",
  city: "City",
  state: "State",

  vehicleType: "Vehicle Type",
  vehicleNumber: "Vehicle Number",
  licenseNumber: "Driving License Number",

  fleetSize: "Fleet Size",
  vehicleTypes: "Vehicle Types",
  coverageArea: "Coverage Area",

  investment: "Investment Capacity",
  officeLocation: "Office Location",
  warehouse: "Warehouse Available",

  warehouseArea: "Warehouse Area (sq.ft)",
  storageType: "Storage Type",

  truckCount: "Number of Trucks",
  gps: "GPS Enabled",
  coverage: "Coverage Area",

  experience: "Years of Experience",
  region: "Preferred Region",
};

const APPLICANT_FIELDS = [
  "fullName",
  "email",
  "phone",
  "company",
  "city",
  "state",
];

function buildRows(
  data: Record<string, any>,
  keys: string[]
) {
  return keys
    .filter((key) => data[key])
    .map(
      (key) => `
<tr>
<td style="padding:10px;border-bottom:1px solid #eee;width:220px;font-weight:600;">
${LABELS[key] ?? key}
</td>

<td style="padding:10px;border-bottom:1px solid #eee;">
${data[key]}
</td>
</tr>
`
    )
    .join("");
}

export function buildCareerEmail(
  data: Record<string, any>,
  referenceId: string
) {

  const applicantRows = buildRows(
    data,
    APPLICANT_FIELDS
  );

  const categoryRows = buildRows(
    data,
    Object.keys(data).filter(
      (k) =>
        !APPLICANT_FIELDS.includes(k) &&
        k !== "category" &&
        k !== "message"
    )
  );

  return `
<!DOCTYPE html>

<html>

<body
style="
background:#f4f6f9;
font-family:Arial,Helvetica,sans-serif;
padding:30px;
">

<div
style="
max-width:760px;
margin:auto;
background:white;
border-radius:14px;
overflow:hidden;
box-shadow:0 8px 30px rgba(0,0,0,.08);
">

<div
style="
background:#1877F2;
padding:35px;
color:white;
text-align:center;
">

<h1 style="margin:0;font-size:34px;">
LOGICARTS
</h1>

<p style="margin-top:10px;font-size:18px;">
Career Application
</p>

</div>

<div style="padding:35px;">

<div
style="
background:#EEF6FF;
border-left:5px solid #1877F2;
padding:18px;
margin-bottom:30px;
">

<p><b>Reference ID</b></p>

<h2 style="margin:0;color:#1877F2;">
${referenceId}
</h2>

<p style="margin-top:15px;">
<b>Application Type</b><br>

${data.category}
</p>

</div>

<h2 style="color:#1877F2;">
Applicant Details
</h2>

<table
style="
width:100%;
border-collapse:collapse;
margin-bottom:35px;
">

${applicantRows}

</table>

<h2 style="color:#1877F2;">
Category Details
</h2>

<table
style="
width:100%;
border-collapse:collapse;
margin-bottom:35px;
">

${categoryRows}

</table>

${
  data.message
    ? `
<h2 style="color:#1877F2;">
Additional Message
</h2>

<div
style="
background:#fafafa;
padding:18px;
border-left:4px solid #1877F2;
margin-bottom:35px;
">
${data.message}
</div>
`
    : ""
}

<div
style="
background:#F8F9FA;
padding:20px;
border-radius:8px;
">

<p>

<b>Submitted On</b>

<br>

${formatSubmissionDate()}

</p>

<p>

This email was generated automatically by the
<b>Logicarts Logistics Management System</b>.

</p>

</div>

</div>

</div>

</body>

</html>
`;
}
