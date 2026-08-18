# Logicarts Logistics Management System (LMS)

**Version:** v1.2.0
**Last Updated:** 18 August 2026

---

# Project Overview

Logicarts Logistics Management System (LMS) is a modern web-based logistics platform designed to manage shipments, logistics operations, customer interactions, partner onboarding, and air cargo operations.

The platform currently includes a production-ready public website, a complete Operations Portal, role-based access control, and a dual-approval onboarding workflow.

---

# Functional Requirements

## Public Website

- Responsive Home Page
- Services Page
- Shipment Tracking Page
- About Us Page
- Career Page
- Contact Us Page
- Custom 404 Page

---

## Career Application Module

Supported Categories:

- Delivery Partner
- Fleet Owner
- Franchise Partner
- Warehouse Partner
- Transport Vendor
- Sales Associate

Features:

- Dynamic application forms
- Category-specific fields
- Professional application dialog
- Reference ID generation
- HTML email notifications
- Gmail SMTP integration
- Success confirmation dialog

---

## Shipment Tracking

### Current

- Shipment tracking
- AWB search
- Shipment lookup

### Planned

- Live shipment tracking
- Tracking history
- Status timeline
- Proof of delivery

---

## Operations Portal

### Authentication

- Secure login
- Session management
- Protected routes

### Dashboard

- Shipment KPIs
- Operational metrics
- Role-specific dashboards

### Docket Management

- Docket generation
- AWB generation
- Shipment search
- Shipment tracking
- Shipment status updates

### Warehouse Operations

- Loading tally
- Manifest generation
- Manifest search
- Inscan
- Outscan

### Delivery Operations

- Delivery challan generation
- Delivery updates

### Reports

- Booking reports
- Shipment reports
- Manifest reports
- Delivery reports
- Revenue reports

---

## Role-Based Access Control (RBAC)

### Admin

- Full portal access
- Dashboard
- Docket operations
- Warehouse operations
- Delivery operations
- Reports
- Revenue visibility
- Masters
- Onboarding and access management

### Client

- Dashboard
- Docket generation
- Shipment tracking
- Access restricted to the client's own shipments
- No revenue access

### Agent

- Dashboard
- Docket generation
- Shipment tracking
- Access restricted to the agent's own shipments
- No revenue access

### Employee

- Dashboard
- Docket generation
- Docket updates
- Inscan
- Outscan
- Delivery operations
- No revenue access

---

## Onboarding and Access Management

Admin can create:

- Clients
- Agents
- Customers
- Employees

### Approval Workflow

Client and Agent onboarding requires approval from both Finance and the Managing Director.

Approval flow:

Admin

↓

Finance Approval

↓

MD Approval

↓

Account Activation

↓

Credential Email Delivery

### Approval Recipients

Finance:

- sujit.jha@logicarts.in

Managing Director:

- souravmishra@logicarts.in

---

## Identifier Standards

| Entity | Format |
| --- | --- |
| Client | LGCL001 |
| Agent | LGAG001 |
| Employee | LGEM001 |
| Customer | LGCU001 |
| Onboarding Request | LGRQ001 |

---

# Non-Functional Requirements

## Performance

- Fast page load
- Responsive UI
- Optimized assets

## Security

- Protected APIs
- Environment-based configuration
- Role-based menu visibility
- Revenue visibility restricted to administrators
- Client-specific shipment isolation
- Agent-specific shipment isolation

## Scalability

- Modular architecture
- Reusable components
- API-first design

## Maintainability

- TypeScript
- Feature-based architecture
- Reusable UI components

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

### Current

- Next.js API Routes

### Future

- Node.js
- Express.js
- NestJS

## Database

### Current

- PostgreSQL
- Prisma ORM

### Future

- Redis

## Email

- Nodemailer
- Gmail SMTP

---

# Project Status

## Completed (v1.2.0)

- Public website
- Career application module
- Dashboard
- Docket management
- Manifest workflow
- Inscan and Outscan
- Delivery workflow
- RBAC
- Dual-approval onboarding
- Email notifications

## In Progress

- Documentation

## Planned

- Customer self-service enhancements
- Audit logs
- Mobile application

---

# Future Enhancements

- Resume attachment support
- Applicant acknowledgement email
- SEO optimization
- Performance optimization
- Analytics dashboard
- GPS vehicle tracking
- AI-powered logistics insights
