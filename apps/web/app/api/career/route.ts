import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

import { buildCareerEmail } from "@/lib/email/careerTemplate";
import { generateReferenceId } from "@/lib/email/utils/careerReference";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const referenceId = generateReferenceId();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Logicarts Careers" <${process.env.SMTP_USER}>`,
      to: process.env.CAREER_EMAIL,
      subject: `Logicarts Career Application | ${body.category} | ${referenceId}`,
      html: buildCareerEmail(body, referenceId),
    });

    return NextResponse.json({
      success: true,
      referenceId,
      message: "Application submitted successfully.",
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}
