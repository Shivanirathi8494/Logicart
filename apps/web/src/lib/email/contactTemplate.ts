import { formatSubmissionDate } from "./utils/careerDate";

export function buildContactEmail(data: Record<string, any>) {
  return `
<!DOCTYPE html>

<html>

<body style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">

<div style="max-width:700px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,.08);">

<div style="background:#1877F2;color:white;padding:30px;text-align:center;">

<h1 style="margin:0;">Logicarts</h1>

<p style="margin-top:8px;">New Contact Enquiry</p>

</div>

<div style="padding:30px;">

<table style="width:100%;border-collapse:collapse;">

<tr>
<td style="padding:10px;font-weight:bold;">Full Name</td>
<td style="padding:10px;">${data.name}</td>
</tr>

<tr>
<td style="padding:10px;font-weight:bold;">Email</td>
<td style="padding:10px;">${data.email}</td>
</tr>

<tr>
<td style="padding:10px;font-weight:bold;">Phone</td>
<td style="padding:10px;">${data.phone}</td>
</tr>

</table>

<h3>Message</h3>

<div style="background:#f8fafc;padding:20px;border-left:4px solid #1877F2;">
${data.message}
</div>

<hr style="margin:30px 0;">

<p>

<b>Submitted On</b><br>

${formatSubmissionDate()}

</p>

</div>

</div>

</body>

</html>
`;
}
