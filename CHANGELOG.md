# Changelog

# v1.2.0 — RBAC & Onboarding

Release Date: 18 August 2026

## Added

### Role-Based Access Control

- Added ADMIN, CLIENT, AGENT and EMPLOYEE portal roles.
- Added role-based sidebar visibility.
- Added server-side route protection.
- Added role-specific dashboard behavior.

### Client Access

- Dashboard access.
- Docket generation.
- Docket management and tracking.
- Shipment visibility restricted to the client's own shipments.
- Revenue access blocked.

### Agent Access

- Dashboard access.
- Docket generation.
- Docket management and tracking.
- Shipment visibility restricted to the agent's own shipments.
- Revenue access blocked.
- Added Agent Type support:
  - Courier Company
  - Logistics Company
  - Aggregator

### Employee Access

- Dashboard access.
- Docket generation.
- Docket management.
- Docket updates.
- Inscan.
- Outscan.
- Delivery operations.
- Revenue access blocked.

### Admin Access

- Full portal access.
- Admin-only Revenue visibility.
- Onboarding & Access management.

### Onboarding

- Added Client onboarding.
- Added Agent onboarding.
- Added Customer creation.
- Added Employee creation.
- Added onboarding status tracking.
- Added Finance and MD dual-approval workflow.
- Added approval email workflow.
- Added automatic Client and Agent account activation after both approvals.
- Added credential email delivery after activation.

### Identifier Standards

- Client IDs: `LGCL001`, `LGCL002`, ...
- Agent IDs: `LGAG001`, `LGAG002`, ...
- Employee IDs: `LGEM001`, `LGEM002`, ...
- Customer IDs: `LGCU001`, `LGCU002`, ...
- Onboarding Request IDs: `LGRQ001`, `LGRQ002`, ...

### Security

- Revenue is available only to ADMIN users.
- Client shipment access is isolated by Client ID.
- Agent shipment access is isolated by Agent ID.
- Protected APIs require authenticated users.
- Admin-only areas are protected server-side.

## Changed

- Simplified Masters navigation to focus on Onboarding & Access.
- Removed Users from the current navigation.
- Removed Branch Master, Customer Master and Vehicle Master cards from the current Masters screen.
- Dashboard Revenue KPI is now conditionally returned and rendered only for Admin.
- Docket ownership now records Client / Agent association.

## Documentation

- Updated README for RBAC and onboarding.
- Updated project requirements to v1.2.0.
- Updated deployment and environment configuration guidance.

---


## v0.4.0

### Added

- Loading Tally workflow and database models
- Loading Tally API endpoints
- Automatic Loading Tally number generation
- Route-wise Manifest generation from Loading Tally
- Loading Tally to Manifest shipment linking
- Manifest preview and printable A4 Manifest components

### Improved

- AWBs are moved to `MANIFESTED` when included in a Manifest
- Loading Tallies automatically change from `OPEN` to `COMPLETED` after all AWBs are manifested
- Manifest data is loaded from the generated Manifest record
- Logicarts branding standardized across the updated documents

All notable changes to the Logicarts Logistics Management System (LMS) are documented in this file.

The project follows Semantic Versioning.

---

# v1.1.0 — Public Website & Career Module

Release Date: 02 August 2026

## Added

### Public Website

- Homepage
- Services Page
- Shipment Tracking Page
- About Us Page
- Career Page
- Contact Us Page
- Custom 404 Page

### Shared Components

- Header
- Top Bar
- Footer
- Page Hero
- Page Container

### Homepage

- Hero Banner
- Shipment Tracking Widget
- Company Statistics
- Services Overview
- Why Choose Us
- Air Presence
- Call-to-Action Section

### Career Module

- Six dynamic application categories
  - Delivery Partner
  - Fleet Owner
  - Franchise Partner
  - Warehouse Partner
  - Transport Vendor
  - Sales Associate
- Dynamic application dialog
- Category-specific fields
- HTML email notifications
- Professional email template
- Gmail SMTP integration
- Automatic Reference ID generation
- Success confirmation dialog

### Technical Improvements

- Modular feature structure
- Email template utilities
- Reusable UI components
- Improved project architecture

---

## Documentation

- Updated README
- Updated Software Requirements Specification (SRS)
- Updated Sprint Documentation
- Updated Architecture Documentation

---

## Planned

### Public Website

- Resume attachment support
- Applicant acknowledgement email
- SEO optimization
- UI enhancements

### Logistics Management System

- Authentication
- Operations Dashboard
- Docket Management
- Shipment Management
- Barcode & QR Support
- Inscan / Outscan
- Manifest Management
- Reports
- Customer Portal
- Admin Portal


## [0.4.0] - 2026-08-03

### Added

#### Air Cargo Operator Portal
- Added secure operator login UI.
- Added operator dashboard with sidebar navigation.
- Added Create Docket workflow.

#### Create Docket
- Auto-generated Tracking Number.
- Manual Tracking Number support.
- Airport (Station) master using IATA codes.
- Searchable Origin and Destination selector.
- Sender Information.
- Receiver Information.
- Dynamic Shipment Details.
- Multiple Package support.
- Automatic Volumetric Weight calculation.
- Automatic Chargeable Weight calculation.
- Payment Information module.
- UPI QR Payment placeholder.
- Air Waybill foundation.

### Changed
- Renamed Docket Number to Tracking Number.
- Improved Create Docket workflow.
- Simplified sender and receiver details.
- Improved shipment calculation workflow.

### Documentation
- Updated README.
- Updated SRS.
- Updated Sprint Documentation.
- Updated Architecture Documentation.

