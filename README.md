# 🌱 AGRI — Municipal Agriculture Office Management & Trading System

A modern, responsive green-and-white agricultural management dashboard built with **React + Vite**, **Supabase** (Database, Authentication & Storage), and styled for seamless deployment on **Vercel**.

Designed for Municipal Agriculture Offices (MAO), Agricultural Extension Workers, and Agri-Trading cooperatives to streamline farmer support, track crop growth across primary commodities (**Rice**, **Corn**, **Vegetables**, and **Fruits**), automate grain silo and cold-storage inventory, and handle harvest procurement and market distribution.

---

## 🚀 Key Features

1. **Role-Based Authentication & Staff Management**
   - **Admin (Chief Agriculturist)**: System-wide authority, config adjustments, farmer deletions, master ledger audit.
   - **Agriculture Office Staff (Field Extension Officers)**: Farmer registration, field monitoring updates, harvest procurement vouchers, and sales issuance.
   - One-click demo role switcher included in the header for rapid evaluation.

2. **Farmer Registration & Directory**
   - Unique Farmer Code generation (`FMR-2026-XXX`).
   - Detailed farmer profiles: contact numbers, barangays/locations, total farm land area in hectares, primary crops cultivated, and active status.
   - Searchable, filterable by commodity and barangay, and exportable to CSV.

3. **Crop Monitoring & Growth Tracking**
   - Specialized tracking for **Rice**, **Corn**, **Vegetables**, and **Fruits**.
   - Lifecycle stages: *Land Preparation → Seedling → Vegetative → Flowering → Ripening → Harvest Ready → Harvested*.
   - Real-time crop health monitoring (*Healthy*, *Needs Water*, *Pest Warning*, *Damaged*).
   - Direct *"Procure Harvest"* button when a crop reaches *Harvest Ready* stage, linking field production to procurement.

4. **Crop Purchasing (Harvest Procurement)**
   - Buy harvested yields directly from registered farmers.
   - Automated total calculation (Quantity in kg × Price per kg).
   - Supports LandBank deposits, cash disbursements, and bank transfers.
   - **Automatic Inventory Integration**: Every confirmed purchase automatically credits warehouse storage silos and recalculates the weighted average unit cost.
   - Official printable **Harvest Purchase Voucher** with government letterhead and signature lines.

5. **Automated Inventory Management**
   - Live aggregated stock meters for **Rice**, **Corn**, **Vegetables**, and **Fruits**.
   - Tracks storage facilities (Central Silo 1 & 2, Grain Warehouse B, Cold Storage Rooms 1 & 2).
   - Low stock threshold indicators and spoilage alerts.
   - Manual inventory adjustments and direct quick-selling shortcuts.

6. **Crop Sales & Commercial Distribution**
   - Sell warehouse commodities to wholesalers, supermarkets, public market vendors, institutional buyers, and food banks.
   - Automatic stock validation to prevent overselling.
   - Immediate stock deduction upon sale confirmation.
   - Official printable **Sales Invoice Voucher** with signature block.

7. **Consolidated Transaction Ledger**
   - Chronological ledger combining Purchases (Expenses/Outflows) and Sales (Revenue/Inflows).
   - Filterable by transaction type, crop commodity, and date range.
   - Export ledger to CSV and print individual vouchers anytime.

8. **Reports & Analytics Hub**
   - Official formatted Municipal Agriculture Office Executive Report.
   - Sectoral yield analysis across Rice, Corn, Vegetables, and Fruits.
   - Financial trading balance sheet (Disbursements vs Sales Proceeds).
   - Browser-native one-click print styling for formal municipal meetings.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Emerald Agricultural Palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL + Row Level Security (RLS)
- **Deployment**: [Vercel](https://vercel.com/) (configured for single-page routing & fast edge CDN)

---

## 📁 Project Structure

```
AGRI/
├── src/
│   ├── components/       # Reusable UI widgets (Navbar, Sidebar, StatCard, Badge, Modal, ReceiptModal)
│   ├── pages/            # Feature views (Dashboard, Farmers, Crops, Inventory, Purchasing, Sales, Transactions, Reports, Login)
│   ├── layouts/          # MainLayout (with responsive sidebar) & AuthLayout
│   ├── services/         # Supabase client, farmerService, cropService, inventoryService, transactionService, dataStorage, mockData
│   ├── hooks/            # useAuth context with role switching
│   ├── App.jsx           # Root application component
│   ├── main.jsx          # React DOM entrypoint
│   └── index.css         # Tailwind & print media styles
├── public/
│   └── favicon.svg       # Agricultural sprout favicon
├── supabase/
│   └── schema.sql        # Complete PostgreSQL database schema, RLS policies, and auto-inventory triggers
├── .env.example          # Template for Supabase environment keys
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies & scripts
└── README.md             # Documentation
```

---

## ⚡ Quick Start Guide

### 1. Clone or Open the Workspace
```bash
cd AGRI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note**: The application includes a self-contained **reactive demo store** with realistic sample farmers, crops, inventory silos, and vouchers pre-loaded. You can immediately test all features without needing to configure backend keys first.

---

## 🗄️ Supabase Setup (Optional for Live Production)

To connect AGRI to your real Supabase cloud project:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase project dashboard.
3. Open the file `supabase/schema.sql` in this repo and copy-paste its contents into the SQL Editor, then click **Run**.
4. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-api-key
   ```
5. Restart your dev server (`npm run dev`). The top bar will display a green **Supabase Live** badge.

---

## 🌐 Deploying to Vercel

### Option A: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option B: Deploy via GitHub / GitLab / Bitbucket
1. Push your `AGRI` repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Vite**.
4. (Optional) Add your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will build and serve your application on a global edge CDN.

---

## 🌐 Dual Separated Portals (Connected by a Shared Database)

The system is architected into two separate websites sharing the **exact same live Supabase / PostgreSQL database**:

### 1. 🌾 Farmer Connect Website (`/farmer`)
- **Direct Login / Self-Registration**: [http://localhost:5173/farmer/login](http://localhost:5173/farmer/login)
- Mobile-first, simplified green portal tailored for farmers in the field.
- **Features**:
  - Sign in using **Farmer ID Code** (e.g. `FMR-2026-001`) or **Mobile Number** (`0917-234-5678`).
  - **Online Self-Registration**: New farmers can sign up directly.
  - **Live Crop Lifecycle Monitoring**: Visual progress bars across Rice, Corn, Vegetables, and Fruits.
  - **Notify Harvest Ready / Request MAO Pickup**: Alert the municipal office with 1 click when crops are ripe.
  - **Instant Digital Payout Vouchers**: Real-time records of municipal payments disbursed via LandBank or cash.

### 2. 🏛️ Municipal Agriculture Office Portal (`/office`)
- **Office Staff & Admin Login**: [http://localhost:5173/office/login](http://localhost:5173/office/login)
- Comprehensive municipal operations and trading dashboard for Extension Officers and Chief Agriculturists.
- **Features**:
  - Sign in with official municipal email (`staff@agri.gov` / `admin@agri.gov`).
  - Directory of all registered farmers across municipal barangays.
  - Full crop lifecycle monitoring for all commodities.
  - Automatic inventory management across grain silos and cold storage rooms.
  - Harvest procurement from farmers (auto-credits inventory & generates payment vouchers).
  - Commercial crop sales to wholesalers & public markets (auto-deducts inventory).
  - Consolidated financial ledger and printable executive reports.

### 3. 🏡 Central Municipal Gateway (`/`)
- Public landing page displaying live guaranteed commodity prices, municipal notices, and direct gateways into both portals.

---

## 👥 Demo Credentials & Portals

| Portal / Role | URL / Route | Login Identifier | Password / Code | Access Level |
|---|---|---|---|---|
| **🌾 Farmer Beneficiary** | `/farmer/login` | `FMR-2026-001` *(or Phone: `0917-234-5678`)* | *No password required* | View planted crops, field growth stages, request harvest collection, view payout vouchers |
| **🏛️ Field Staff** | `/office/login` | `staff@agri.gov` | `staff123` | Farmer enrollment, crop monitoring, purchasing, sales vouchers |
| **🛡️ Administrator** | `/office/login` | `admin@agri.gov` | `admin123` | Full administrative controls, configuration, deletion rights |

*(Both login portals also provide 1-click instant demo access buttons).*

---

## 📄 License
MIT License. Created for the Municipal Agriculture Office.
