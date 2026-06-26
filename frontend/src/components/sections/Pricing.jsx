import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { Check, Star } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    description: 'For individual exporters and small trading firms getting started with market research.',
    features: [
      '5 market analysis reports per month',
      'Top 50 country rankings',
      '100 importer leads per month',
      'Basic competitor tracking',
      'Email support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '₹14,999',
    period: '/month',
    description: 'For growing export businesses that need comprehensive trade intelligence and buyer databases.',
    features: [
      'Unlimited market analysis reports',
      'Full 203 country rankings',
      '500 importer leads per month',
      'Advanced competitor intelligence',
      'AI-generated research reports',
      'Product-market matching',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large export houses and trading companies that need dedicated support and custom integrations.',
    features: [
      'Everything in Professional',
      'Unlimited importer leads',
      'Custom data integrations',
      'Dedicated account manager',
      'API access',
      'Team collaboration',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function Pricing({ onOpenAuth }) {
  const fade = useFadeIn();

  // On mobile, show Professional first (most popular)
  const mobilePlans = [plans[1], plans[0], plans[2]];

  return (
    <section id="pricing" className="w-full bg-[#F5F7FA] py-10 md:py-14 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          {/* Section header */}
          <div className="mb-8 md:text-center">
            <span className="type-label text-[#2563EB] mb-2 block">Pricing</span>
            <h2 className="type-h2 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-[14px] md:text-[15px] text-[#64748B] md:max-w-xl md:mx-auto leading-relaxed">
              All plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>

          {/* Mobile: Professional card featured on top, then others */}
          {/* Desktop: 3-column grid */}
          <div className="md:hidden flex flex-col gap-4 max-w-md mx-auto">
            {mobilePlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-5 flex flex-col ${
                  plan.highlighted
                    ? 'bg-white border-[#2563EB] border-2'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                {plan.highlighted && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star size={13} className="text-[#F59E0B] fill-current" />
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">Most Popular</span>
                  </div>
                )}

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0F172A]">{plan.name}</h3>
                    <p className="text-[12px] text-[#64748B] mt-1 leading-relaxed max-w-[220px]">
                      {plan.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-[22px] font-bold text-[#0F172A] leading-none">{plan.price}</span>
                    {plan.period && (
                      <p className="text-[11px] text-[#64748B]">{plan.period}</p>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-[13px] text-[#334155]">
                      <Check size={14} className="text-[#059669] shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenAuth}
                  className={`w-full py-3 text-[15px] font-semibold rounded-lg transition-colors ${
                    plan.highlighted
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : 'bg-white text-[#2563EB] border-2 border-[#2563EB] hover:bg-[#EFF6FF]'
                  }`}
                  style={{ minHeight: '48px' }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid grid-cols-3 gap-5 max-w-4xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-5 flex flex-col relative ${
                  plan.highlighted
                    ? 'bg-white border-[#2563EB] border-2'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-[24px] font-bold text-[#0F172A]">{plan.price}</span>
                    <span className="text-[12px] text-[#64748B]">{plan.period}</span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex-1 mb-5">
                  <ul className="space-y-2">
                    {plan.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-[12px] text-[#334155]">
                        <Check size={13} className="text-[#059669] shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onOpenAuth}
                  className={`w-full py-2.5 text-[13px] font-semibold rounded-lg transition-colors ${
                    plan.highlighted
                      ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                      : 'bg-white text-[#2563EB] border border-[#2563EB] hover:bg-[#EFF6FF]'
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
