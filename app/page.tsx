'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { ArrowRight, ChevronDown, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { publicApi, LandingOverviewResponse } from '@/services/api/public';

type HealthData = {
  status: string;
  time: string;
};

const featureCards = [
  {
    title: 'Smart Expense Tracking',
    body: 'Classify spending patterns and detect budget pressure before month-end.'
  },
  {
    title: 'Goal-Based Savings',
    body: 'Track target progress with contribution history and projected completion.'
  },
  {
    title: 'Actionable Insights',
    body: 'Get trend analysis, category concentration, and monthly recommendations.'
  },
  {
    title: 'Admin Control Layer',
    body: 'Manage categories, users, reports, and financial tips from one panel.'
  }
];

const workflowSteps = [
  { title: 'Connect & Start', body: 'Create an account and begin tracking transactions in under two minutes.' },
  { title: 'Organize Finance', body: 'Use category filters, date ranges, and smart tagging for clean records.' },
  { title: 'Improve Monthly', body: 'Use insights and savings analytics to optimize spending behavior.' }
];

const testimonials = [
  {
    name: 'Nadia R.',
    role: 'Product Designer',
    quote: 'FinTrack made my monthly planning predictable. The dashboard is fast and clear.'
  },
  {
    name: 'Arian M.',
    role: 'Freelancer',
    quote: 'Category trends and savings progress helped me cut unnecessary expenses quickly.'
  },
  {
    name: 'Sabrina T.',
    role: 'Operations Lead',
    quote: 'Looks premium, works reliably, and gives me useful finance signals every week.'
  }
];

const faq = [
  {
    q: 'Is FinTrack mobile responsive?',
    a: 'Yes. The full experience is optimized for mobile, tablet, and desktop workflows.'
  },
  {
    q: 'Can I manage both income and expenses?',
    a: 'Yes. You can add, edit, filter, and analyze both with category-level visibility.'
  },
  {
    q: 'Is role-based access supported?',
    a: 'Yes. Admin and user experiences are separated with protected routes and controls.'
  }
];

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const { user, loading, logout } = useAuth();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [overviewPeriod, setOverviewPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [overview, setOverview] = useState<LandingOverviewResponse | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    fetch(`${apiBase}/health`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Health fetch failed');
        const data = (await res.json()) as HealthData;
        setHealth(data);
      })
      .catch(() => {
        setHealth(null);
      });
  }, []);

  useEffect(() => {
    publicApi
      .overview(overviewPeriod)
      .then(({ data }) => setOverview(data))
      .catch(() => setOverview(null));
  }, [overviewPeriod]);

  const metrics = useMemo(
    () => [
      { label: 'Platform Status', value: health?.status === 'ok' ? 'Online' : 'Unavailable' },
      { label: 'Live API Time', value: health?.time ? new Date(health.time).toLocaleTimeString() : '--:--:--' },
      { label: 'Sections', value: 'Premium SaaS Landing' },
      { label: 'Mode', value: theme === 'dark' ? 'Dark' : 'Light' }
    ],
    [health, theme]
  );

  const dashboardHref = user?.role === 'admin' ? '/admin' : '/dashboard';
  const topDistribution = overview?.distribution?.[0];

  return (
    <div className="min-h-screen bg-hero text-white">
      <section className="grid-pattern mx-auto max-w-7xl px-6 py-8 md:py-12">
        <nav className="mb-12 flex items-center justify-between rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 backdrop-blur">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white">
            FinTrack
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {!loading && !user && (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}

            {!loading && user && (
              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3 py-1.5">
                  {user.photoUrl ? (
                    <Image
                      src={user.photoUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold">
                      {user.name
                        .split(' ')
                        .map((item) => item[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="hidden text-sm font-medium md:block">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </summary>

                <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-white/15 bg-slate-950/95 p-2 shadow-soft">
                  <Link href={dashboardHref} className="block rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                  </Link>
                  <Link href="/dashboard/profile" className="block rounded-xl px-3 py-2 text-sm hover:bg-white/10">
                    Profile Settings
                  </Link>
                  <button className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/10" onClick={logout}>
                    Logout
                  </button>
                </div>
              </details>
            )}
          </div>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-indigo-300/40 bg-indigo-500/20 px-4 py-1 text-xs">Built for financial clarity</p>
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">Premium finance intelligence for modern users</h1>
            <p className="mt-5 max-w-xl text-slate-300">Track income, control expenses, and reach goals with decision-grade analytics and startup-level UX polish.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={user ? dashboardHref : '/auth/register'}>
                <Button className="gap-2">
                  {user ? 'Open Dashboard' : 'Start Free'} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Preview Experience
                </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-white/10">
            <h3 className="mb-4 text-lg font-semibold">Live Platform Pulse</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-slate-300">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((item) => (
            <Card key={item.title} className="bg-white/5">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Your Overview at a Glance</h2>
              <p className="mt-2 max-w-2xl text-slate-300">A powerful command center for your money. Connect your accounts and see everything in one unified, beautiful interface.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${overviewPeriod === 'monthly' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-slate-300'}`}
                onClick={() => setOverviewPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${overviewPeriod === 'yearly' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-slate-300'}`}
                onClick={() => setOverviewPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/5">
              <p className="text-sm text-slate-300">Total Balance</p>
              <p className="mt-3 text-4xl font-bold">{currency(overview?.metrics.totalBalance || 0)}</p>
              <p className="mt-2 text-sm text-emerald-300">+{(overview?.metrics.totalBalanceChange || 0).toFixed(1)}%</p>
            </Card>
            <Card className="bg-white/5">
              <p className="text-sm text-slate-300">{overviewPeriod === 'monthly' ? 'Monthly Savings' : 'Yearly Savings'}</p>
              <p className="mt-3 text-4xl font-bold">{currency(overview?.metrics.monthlySavings || 0)}</p>
              <p className="mt-2 text-sm text-emerald-300">+{(overview?.metrics.monthlySavingsChange || 0).toFixed(1)}%</p>
            </Card>
            <Card className="bg-white/5">
              <p className="text-sm text-slate-300">Net Worth</p>
              <p className="mt-3 text-4xl font-bold">{currency(overview?.metrics.netWorth || 0)}</p>
              <p className="mt-2 text-sm text-emerald-300">+{(overview?.metrics.netWorthChange || 0).toFixed(1)}%</p>
            </Card>
          </div>

          <Card className="mt-6 bg-white/5">
            <h3 className="text-2xl font-semibold">Expense Distribution</h3>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full" style={{ background: `conic-gradient(#10b981 0 ${topDistribution?.percentage || 0}%, rgba(255,255,255,0.15) ${topDistribution?.percentage || 0}% 100%)` }}>
                  <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-slate-950/90 text-center">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Top</p>
                    <p className="mt-1 text-sm font-semibold text-slate-200">{topDistribution?.category || 'No Data'}</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-300">{topDistribution?.percentage || 0}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {(overview?.distribution || []).map((item) => (
                  <div key={item.category}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <p className="font-semibold text-slate-200">{item.category}</p>
                      <p className="font-semibold text-slate-100">{currency(item.amount)}</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/15">
                      <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}

                {!overview?.distribution?.length && <p className="text-sm text-slate-400">No expense data available yet.</p>}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 backdrop-blur">
          <h2 className="text-2xl font-bold">How FinTrack Works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {workflowSteps.map((step, index) => (
              <Card key={step.title} className="bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Step {index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold">Customer Highlights</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-white/5">
              <p className="text-sm text-slate-200">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-slate-400">{item.role}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {faq.map((item) => (
            <Card key={item.q} className="bg-white/5">
              <h3 className="text-base font-semibold">{item.q}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-indigo-300/25 bg-indigo-500/20 p-8 text-center">
          <h2 className="text-3xl font-bold">Ready to run your finance with clarity?</h2>
          <p className="mt-3 text-slate-200">Move from raw transactions to confident monthly decisions.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href={user ? dashboardHref : '/auth/register'}>
              <Button>{user ? 'Go to Dashboard' : 'Create Account'}</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
