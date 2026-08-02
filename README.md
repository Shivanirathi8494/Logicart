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

