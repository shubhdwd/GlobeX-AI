import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';
import DashboardNavbar from '../components/dashboard/DashboardNavbar.jsx';
import MetricCard from '../components/dashboard/MetricCard.jsx';
import BuyerTable from '../components/dashboard/BuyerTable.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import TrendChart from '../components/dashboard/TrendChart.jsx';

const METRICS = [
  {
    icon: Users,
    title: 'Total Buyers Discovered',
    value: '2,841',
    trend: '+12% this month',
    trendUp: true,
    color: '#00d4ff',
    delay: 0.1,
  },
  {
    icon: Globe,
    title: 'Countries Reached',
    value: '47',
    trend: '+3 new markets',
    trendUp: true,
    color: '#00ff88',
    delay: 0.18,
  },
  {
    icon: MessageSquare,
    title: 'Active Leads',
    value: '138',
    trend: '+28% vs last month',
    trendUp: true,
    color: '#a855f7',
    delay: 0.26,
  },
  {
    icon: Send,
    title: 'Outreach Campaigns',
    value: '24',
    trend: '-2 this week',
    trendUp: false,
    color: '#fbbf24',
    delay: 0.34,
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [metricsData, setMetricsData] = React.useState(METRICS);

  React.useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        const s = data.data;
        if (isMounted && s) {
          setMetricsData([
            { ...METRICS[0], value: s.totalLeads?.toLocaleString() || '0' },
            { ...METRICS[1], value: s.totalOpportunities?.toLocaleString() || '0' },
            { ...METRICS[2], value: s.activeAgents?.toLocaleString() || '0' },
            { ...METRICS[3], value: s.recentInteractions?.toLocaleString() || '0' }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard summary', err);
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, []);

  // Get first name only
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#020617]">
      <DashboardNavbar />

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(220px, 32vw, 340px)', marginTop: '60px' }}>
        {/* Port image */}
        <img
          src="/dashboard-banner.jpg"
          alt="Global shipping port"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center 60%' }}
        />
        {/* Dark gradient overlay — bottom-to-top + left tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.55) 60%, rgba(2,6,23,0.3) 100%),' +
              'linear-gradient(to top, rgba(2,6,23,1) 0%, rgba(2,6,23,0.1) 50%, transparent 100%)',
          }}
        />

        {/* Welcome text */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto left-0 right-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-2">
              Dashboard
            </p>
            <h1 className="text-white font-extrabold leading-tight mb-2" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)' }}>
              Welcome back, <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">{firstName}</span> 👋
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-lg">
              Here's what's happening with your export pipeline today.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16">

        {/* Metric cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-10 mb-8">
          {metricsData.map((m) => (
            <MetricCard key={m.title} {...m} />
          ))}
        </div>

        {/* Two-column layout: buyer table + quick actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Buyer table takes 2/3 width on xl */}
          <div className="xl:col-span-2">
            <BuyerTable isEmpty={false} />
          </div>
          {/* Quick actions sidebar */}
          <div className="xl:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Trend chart — full width */}
        <TrendChart />
      </div>
    </div>
  );
}
