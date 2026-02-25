# FinTrack - Smart Finance Tracker

FinTrack is a premium financial intelligence platform designed for modern users to track income, control expenses, and reach financial goals with actionable insights.

## Features

- **Dashboard**: Comprehensive overview of your financial health.
- **Expense Tracking**: Smart classification of spending patterns.
- **Budgeting**: Set and monitor monthly budgets.
- **Insights**: Category concentration and trend analysis.
- **Admin Panel**: Manage categories, users, and global settings.
- **Dark Mode**: Premium SaaS aesthetics with full dark mode support.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, Shadcn UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/Auth**: Custom Context & Hooks
- **API**: Axios with interceptors

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd fintrack-smart-finance
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file based on `.env.example`:

   ```bash
   NEXT_PUBLIC_API_URL=https://your-api-url.com/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

### 1. Push to GitHub/GitLab/Bitbucket

Ensure your code is pushed to a remote repository.

### 2. Import to Vercel

1. Go to the Vercel Dashboard and click **New Project**.
2. Select your repository.
3. In the **Environment Variables** section, add `NEXT_PUBLIC_API_URL` with your production API URL.
4. Click **Deploy**.

### 3. Build & Output Settings

The project uses standard Next.js build settings:

- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## License

MIT
