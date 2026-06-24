import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { BarChart3, TrendingUp, Users, Radar, LineChart, Building2, FileText, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Market Opportunity Analysis',
    desc: 'Analyze trade flows across 203 countries to find high-growth export destinations for your specific products and HS codes.',
  },
  {
    icon: TrendingUp,
    title: 'Country Demand Forecasting',
    desc: 'Predict which markets will see increasing import demand using historical customs data and AI-powered trend models.',
  },
  {
    icon: Users,
    title: 'Importer Lead Discovery',
    desc: 'Access verified profiles of international importers with trade histories, shipment volumes, and direct contact details.',
  },
  {
    icon: Radar,
    title: 'Competitor Export Tracking',
    desc: 'Track competitor export patterns, destination markets, and shipment volumes to identify strategic gaps and opportunities.',
  },
  {
    icon: LineChart,
    title: 'Product-Market Matching',
    desc: 'Match your products with the most compatible markets based on HS codes, tariff data, demand signals, and competition levels.',
  },
  {
    icon: Building2,
    title: 'Buyer Company Profiles',
    desc: 'Detailed company profiles including annual import volumes, product categories, shipping patterns, and reliability scores.',
  },
  {
    icon: FileText,
    title: 'AI Research Reports',
    desc: 'Generate comprehensive market entry reports with country rankings, risk assessments, and actionable trade recommendations.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Duty Intelligence',
    desc: 'Navigate international export regulations, tariff rates, HS classifications, and duty optimization for your shipments.',
  },
];

export default function FeaturesMatrix() {
  const fade = useFadeIn();

  return (
    <section id="features" className="w-full bg-[#F5F7FA] py-14 md:py-16 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          <div className="text-center mb-10">
            <span className="type-label text-[#2563EB] mb-2 block">Platform Features</span>
            <h2 className="type-h2 mb-3">Everything You Need to Scale Exports</h2>
            <p className="text-[14px] text-[#64748B] max-w-2xl mx-auto">
              A complete suite of export intelligence tools for Indian manufacturers, traders, and MSME exporters.
            </p>
          </div>

          {/* Volza-style 2-column feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feat, idx) => (
              <div key={idx} className="feature-card">
                <div className="icon-wrap">
                  <feat.icon size={18} />
                </div>
                <div>
                  <div className="card-title">{feat.title}</div>
                  <div className="card-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
