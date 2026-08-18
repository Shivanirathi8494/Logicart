import nodemailer from "nodemailer";

const FINANCE_EMAIL =
  "sujit.jha@logicarts.in";

const MD_EMAIL =
  "souravmishra@logicarts.in";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(
    process.env.SMTP_PORT ?? 587
  );

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure:
        process.env.SMTP_SECURE === "true",
      auth: {
        user,
        pass,
      },
    }),

    from:
      process.env.MAIL_FROM ||
      user,
  };
}

export async function sendApprovalEmails(input: {
  requestNumber: string;
  type: "CLIENT" | "AGENT";
  details: Record<string, unknown>;
  financeToken: string;
  mdToken: string;
}) {
  const smtp = createTransporter();

  if (!smtp) {
    console.warn(
      "SMTP not configured. Approval request saved without sending email."
    );

    return false;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const company =
    String(
      input.details.companyName || ""
    );

  const emailBody = (
    approver: string,
    token: string
  ) => `
Hello ${approver},

A new Logicarts ${input.type} onboarding request requires your approval.

Request Number: ${input.requestNumber}
Company: ${company}
GSTIN: ${String(input.details.gstin || "-")}
Contact Person: ${String(input.details.contactPerson || "-")}
Email: ${String(input.details.email || "-")}
Phone: ${String(input.details.phone || "-")}
Origin: ${String(input.details.origin || "-")}
Destination: ${String(input.details.destination || "-")}
Expected Monthly Billing: ${String(input.details.expectedMonthlyBilling || "-")}
Credit Days: ${String(input.details.creditDays || "-")}

Review request:
${baseUrl}/approval?token=${encodeURIComponent(token)}

Regards,
Logicarts
`;

  await Promise.all([
    smtp.transporter.sendMail({
      from: smtp.from,
      to: FINANCE_EMAIL,
      subject:
        `Logicarts ${input.type} Approval - ${input.requestNumber}`,
      text: emailBody(
        "Finance",
        input.financeToken
      ),
    }),

    smtp.transporter.sendMail({
      from: smtp.from,
      to: MD_EMAIL,
      subject:
        `Logicarts ${input.type} Approval - ${input.requestNumber}`,
      text: emailBody(
        "MD",
        input.mdToken
      ),
    }),
  ]);

  return true;
}

export async function sendAccountEmail(input: {
  email: string;
  name: string;
  username: string;
  temporaryPassword: string;
  type: "CLIENT" | "AGENT";
}) {
  const smtp = createTransporter();

  if (!smtp) {
    console.warn(
      "SMTP not configured. Account email not sent."
    );

    return false;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  await smtp.transporter.sendMail({
    from: smtp.from,
    to: input.email,
    subject:
      `Logicarts ${input.type} Account Activated`,
    text: `
Hello ${input.name},

Your Logicarts account has been activated.

Login:
${baseUrl}/login

Username:
${input.username}

Temporary Password:
${input.temporaryPassword}

Please change the password after login.

Regards,
Logicarts
`,
  });

  return true;
}
