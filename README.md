# RAS PROPERTIES
### *"Your Trusted Partner in Real Estate"*

A production-ready, fully responsive full-stack real-estate website and web application engineered for the Indian real-estate market.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL / SQLite**, **Leaflet OpenStreetMap**, and secure role-based JWT Authentication.

---

## 🌟 Key Features

### 🏢 Public Marketplace
- **Hero Property Search Engine**: Instant tabbed search (**BUY**, **RENT**, **COMMERCIAL**) with city selection (Noida, Greater Noida, Ghaziabad, Gurgaon, Delhi NCR, Lucknow), budget range in INR (Lakhs & Crores), property type, and bedroom chips.
- **Faceted Search & Filters**: URL-synced search filtering by price range, BHK, locality, furnishing status, RERA verification, and featured status.
- **Interactive Property Details (`/properties/[slug]`)**:
  - High-resolution image gallery with full-screen lightbox modal.
  - Indian currency formatting (₹85 Lakh, ₹2.45 Cr, ₹38,000 / mo).
  - Society & unit specs (BHK, baths, super built-up area, floor level, facing, parking).
  - OpenStreetMap & Leaflet interactive map with custom Indian pins and popups.
  - Interactive **Home Loan EMI Calculator** with live breakdown of monthly EMI, principal, and total interest.
  - Direct **Call Now** (`tel:+91...`) and **WhatsApp** (`https://wa.me/...`) buttons pre-populated with Property ID and title.
  - **Schedule Site Visit Modal** with date and time slot selection.
  - **Send Direct Enquiry Modal** with real database submission.
- **Agent Profiles & Directory (`/agents`, `/agents/[id]`)**:
  - Certified UP/HR RERA advisor profiles, ratings, active listings, and client reviews.
- **CMS Blog & Buying Guides (`/blog`, `/blog/[slug]`)**:
  - In-depth articles covering UP-RERA compliance, circle rates, stamp duty calculations, and neighborhood hotspots.
- **Mobile Fixed Contact Bar**: Sticky bottom contact bar on mobile devices for 1-tap Call, WhatsApp, and Enquiry access.

---

### 👤 Registered User Dashboard (`/dashboard`)
- **Dashboard Overview**: Metrics for saved properties, active inquiries, my listings, and pending reviews.
- **Saved Properties (`/dashboard/saved`)**: Personal shortlist with instant favorite toggling.
- **My Enquiries (`/dashboard/enquiries`)**: Track inquiry status (NEW, CONTACTED, SCHEDULED, COMPLETED) with advisor notes.
- **Scheduled Visits (`/dashboard/visits`)**: Manage site inspection bookings and assigned executive details.
- **My Properties (`/dashboard/my-properties`)**: View, preview, and delete listings posted by the user.
- **8-Step Property Submission Wizard (`/dashboard/post-property`)**:
  1. Basic Information (Title, Type, Buy/Rent/Lease)
  2. Location & Pincode (City, Sector, State)
  3. Pricing (Total INR Price & Price/Sq.Ft.)
  4. Property Specifications (BHK, Baths, Balconies, Area in Sq.Ft., Floor, Facing)
  5. Society Amenities Multi-Select (24x7 Security, Power Backup, Gym, Pool, etc.)
  6. Image & Media Gallery (Multiple image management)
  7. RERA & Contact Information
  8. Live Preview & Submit for Admin Approval
- **Notification Center (`/dashboard/notifications`)**: Real-time alerts for property approvals, enquiry replies, and site visits.

---

### 🛡️ Admin Control Center (`/admin`)
- **System Metrics & Analytics**: Total users, listings, pending approvals, verified properties, total inquiries, site visits, and page view counters.
- **Interactive Distribution Charts**: Property type distribution and Buy vs. Rent vs. Lease inventory breakdown.
- **Listing Management (`/admin/properties`)**:
  - One-click **Approve / Reject** property workflow.
  - Toggle **Featured** and **RERA Verified** status badges.
  - Delete fraudulent or duplicate listings.
- **User Management (`/admin/users`)**:
  - Change user roles: `USER`, `OWNER`, `AGENT`, `ADMIN`.
  - Suspend or activate user accounts.
  - Delete accounts.
- **Customer Enquiry Management (`/admin/enquiries`)**: Real-time leads overview with contact numbers.
- **Site Visit Management (`/admin/visits`)**: Review customer appointment requests.
- **Blog & Editorial CMS (`/admin/blog`)**: Publish and manage real-estate articles.
- **Website & Regulatory Settings (`/admin/settings`)**: Configure helpline numbers, official WhatsApp, UP RERA registration number, and corporate office address.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS + Custom Design Tokens |
| **Database** | PostgreSQL |
| **ORM** | Prisma ORM |
| **Authentication** | Secure JWT + Bcryptjs Password Hashing + HTTP-Only Cookies |
| **Maps** | Leaflet + OpenStreetMap (Zero API key dependency) |
| **Charts** | Recharts Responsive Analytics |
| **Icons** | Lucide React |
| **Emails** | Resend API + HTML Transactional Templates |
| **Image Hosting** | Cloudinary API + Verified CDN |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js 18+ or 20+ (LTS recommended)
- npm / pnpm / yarn

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "RAS Properties"
npm install
```

### 3. Environment Variables Setup
Copy `.env.example` to `.env` and set a Neon or local PostgreSQL connection string and a unique development secret:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database & Seed Real Data
For local development only, initialize the database and add demo data:
```powershell
# This clears existing data; never run it against a production database.
$env:ALLOW_DEMO_SEED = "true"
npm run db:setup
Remove-Item Env:ALLOW_DEMO_SEED
```

The seed command requires an explicit opt-in and refuses to run in production.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Accounts

The local development seed creates test accounts:

| Account Type | Email | Password |
|---|---|---|
| **Super Admin** | `admin@rasproperties.in` | `AdminPassword@2026` |
| **Certified Agent** | `rajesh.sharma@rasproperties.in` | `UserPassword@2026` |
| **Property Owner / User** | `ramesh.kumar@gmail.com` | `UserPassword@2026` |

*(Quick 1-click login buttons are also built directly into the login page for effortless evaluation!)*

---

## 🌐 Production Deployment (Vercel + Neon PostgreSQL)

1. Create a PostgreSQL database in Neon and copy its pooled connection string.
2. Import this GitHub repository into Vercel and keep the default Next.js build settings.
3. In Vercel **Project Settings → Environment Variables**, configure:
   - `DATABASE_URL`: the Neon connection string
   - `AUTH_SECRET`: a unique random secret (generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NEXT_PUBLIC_APP_URL`: the deployed Vercel URL, such as `https://your-project.vercel.app`
4. Set `DATABASE_URL` in your local `.env` to the Neon connection string temporarily, then run `npx prisma db push` to create the schema. Do not run `npm run db:setup` or `prisma/seed.ts` against production; the demo seed clears database records and creates public demo credentials.
5. Redeploy in Vercel after setting the environment variables. The build script generates the PostgreSQL Prisma client and builds the app.
6. To create the first production admin, register your own account on the deployed site, then promote that account in Neon SQL Editor:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## 📄 License
© 2026 RAS Properties. All rights reserved. Built for Indian Real Estate Excellence.
