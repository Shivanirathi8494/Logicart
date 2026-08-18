# 🚚 Logicarts Logistics Management System (LMS)

> A modern Logistics Management System built using **Next.js**, **React**, **TypeScript**, and **Tailwind CSS** to manage logistics operations, shipment tracking, partner onboarding, and customer interactions.

---

## 📌 Project Status

| Version | Status |
|----------|--------|
| **v1.1.0** | ✅ Public Website & Career Module Completed |

---

# ✨ Features

## 🌐 Public Website

- Responsive Landing Page
- Services
- Shipment Tracking
- About Us
- Contact Us
- Career Portal
- Custom 404 Page

---

## 💼 Career Application Module

Applicants can apply through dynamic application forms.

### Supported Categories

- 🚛 Delivery Partner
- 🚚 Fleet Owner
- 🏢 Franchise Partner
- 🏬 Warehouse Partner
- 🚜 Transport Vendor
- 💼 Sales Associate

### Features

- Dynamic popup application form
- Category-specific fields
- HTML email notifications
- Gmail SMTP integration
- Automatic Reference ID generation
- Professional email template
- Success confirmation workflow

---

# 🛠 Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

Current

- Next.js API Routes

Future

- Node.js
- Express.js / NestJS

## Database (Planned)

- PostgreSQL
- Redis

## Email

- Nodemailer
- Gmail SMTP

---

# 📂 Project Structure

```text
Logicart/
│
├── apps/
│   └── web/
│       ├── app/
│       ├── public/
│       └── src/
│           ├── components/
│           ├── features/
│           ├── lib/
│           └── styles/
│
├── docs/
│   ├── architecture/
│   ├── sprints/
│   └── srs/
│
├── tasks/
│
├── README.md
├── CHANGELOG.md
└── PROJECT_REQUIREMENTS.md
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd Logicart
```

---

## 2. Install Dependencies

```bash
cd apps/web

npm install
```

---

## 3. Configure Environment Variables

Create

```text
apps/web/.env.local
```

Example

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password

CAREER_EMAIL=hr@logicarts.in
```

> **Note:** Use a **Google App Password**, not your regular Gmail password.

---

## 4. Run Development Server

```bash
cd apps/web

npm run dev
```

Open

```
http://localhost:3000
```

---

## 5. Production Build

```bash
cd apps/web

npm run build

npm run start
```

---

# 📜 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

# 📧 Career Email Workflow

```text
Applicant

        │

        ▼

Career Application Dialog

        │

        ▼

Next.js API Route

        │

        ▼

Reference ID Generated

        │

        ▼

HTML Email Created

        │

        ▼

Nodemailer

        │

        ▼

Gmail SMTP

        │

        ▼

HR Mailbox
```

---

# 📍 Current Roadmap

## ✅ Completed

- Public Website
- Responsive UI
- Career Module
- Dynamic Forms
- HTML Email Notifications
- Gmail SMTP Integration
- Reference ID Generation

---

## 🚧 In Progress

- Project Documentation

---

## 📅 Planned

### Operations Portal

- Authentication
- Dashboard
- Shipment Management
- Docket Management
- Manifest
- Barcode & QR Support
- Reports

### Customer Portal

- Login
- Shipment Tracking
- Shipment History
- Invoice Download

### Administration

- User Management
- Roles & Permissions
- Audit Logs

---

# 🤝 Contributing

1.

```bash
git checkout -b feature/my-feature
```

2.

```bash
git commit -m "feat: add my feature"
```

3.

```bash
git push origin feature/my-feature
```

4.

Create a Pull Request.

---

# 📄 Documentation

- README.md
- CHANGELOG.md
- PROJECT_REQUIREMENTS.md
- Software Requirements Specification (SRS)
- Sprint Documentation
- Architecture Documentation

---

# 📄 License

Copyright © 2026 Logicarts.

All Rights Reserved.


---

# Latest Progress

## Operator Portal

Implemented a complete Air Cargo Operations Portal including:

- Portal Login
- Dashboard
- Sidebar Navigation
- Create Docket
- Tracking Number Generation
- Airport Master
- Dynamic Shipment Details
- Multiple Package Support
- Volumetric Weight Calculation
- Chargeable Weight Calculation
- Payment Module
- Air Waybill Foundation

Current Tracking Number Format:

BLR-DEL-YYMMDD-000001

## Current Warehouse & Manifest Workflow

### Loading Tally

- Loading Tally records eligible AWBs for warehouse processing.
- AWBs are grouped by source and destination for Manifest generation.
- Loading Tally numbers are generated automatically.
- Loading Tallies remain available while their status is `OPEN`.

### Manifest Generation

- A Manifest can be generated route-wise from a Loading Tally.
- The generated Manifest is linked to the Loading Tally.
- AWBs included in the Manifest are moved to `MANIFESTED`.
- When all AWBs in the Loading Tally have been assigned to Manifests, the Loading Tally changes from `OPEN` to `COMPLETED`.
- Completed Loading Tallies remain stored for historical records.

### Manifest Document

- Manifest Preview loads the generated Manifest by Manifest Number.
- The existing A4 printable Manifest format is preserved.
- The A4 document includes Manifest information, AWB details, pieces, weight, route and signatures.
- Printing uses the existing printable Manifest document.

### Branding

- Company branding uses `Logicarts`.


---

# RBAC & Onboarding Release

The Operations Portal now includes role-based access and onboarding workflows.

## Role-Based Access

### Admin

- Full portal access
- Dashboard
- Docket operations
- Warehouse operations
- Delivery
- Reports
- Revenue
- Masters
- Onboarding & Access

### Client

- Dashboard
- Create Docket
- Docket Management / Tracking
- Access limited to the Client's own shipments
- No Revenue access

### Agent

- Dashboard
- Create Docket
- Docket Management / Tracking
- Access limited to the Agent's own shipments
- No Revenue access

### Employee

- Dashboard
- Create Docket
- Docket Management
- Docket Update
- Inscan
- Outscan
- Delivery
- No Revenue access

## Onboarding & Access

Admin can create:

- Client
- Agent
- Customer
- Employee

Client and Agent onboarding requires approval from both Finance and MD before account activation.

Approval recipients:

- Finance: sujit.jha@logicarts.in
- MD: souravmishra@logicarts.in

## Logicarts ID Format

- Client: LGCL001
- Agent: LGAG001
- Employee: LGEM001
- Customer: LGCU001
- Onboarding Request: LGRQ001

IDs are system-generated and sequential.

## Current Navigation Simplification

The following items are removed from the current navigation:

- Users
- Branch Master
- Customer Master
- Vehicle Master

The current administration workflow is focused on Onboarding & Access.
