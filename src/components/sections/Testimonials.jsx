import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Director, Mehta Textiles Pvt. Ltd.',
    location: 'Surat, Gujarat',
    text: 'GlobeX helped us identify 3 new export markets in the Middle East that we had never considered. Within 6 months, our export revenue grew by 40%. The buyer database alone is worth the subscription.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Export Manager, Krishna Agro Exports',
    location: 'Nashik, Maharashtra',
    text: 'We used to spend weeks researching new markets manually. GlobeX gives us actionable country rankings and verified importer contacts in minutes. It has completely changed how we plan our export strategy.',
    rating: 5,
  },
  {
    name: 'Vikram Patel',
    role: 'CEO, Patel Engineering Components',
    location: 'Ahmedabad, Gujarat',
    text: 'The competitor tracking feature is invaluable. We can see exactly where our competitors are shipping and find gaps they are missing. The data is reliable and the reports are professional enough to share with our board.',
    rating: 5,
  },
];

export default function Testimonials() {
  const fade = useFadeIn();

  return (
    <section className="w-full bg-white py-14 md:py-16 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          <div className="text-center mb-10">
            <span className="type-label text-[#2563EB] mb-2 block">Trusted by Exporters</span>
            <h2 className="type-h2 mb-3">What Indian Exporters Say About GlobeX</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-5 bg-[#F5F7FA] rounded border border-[#E5E7EB]">
                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>

                <p className="text-[13px] text-[#334155] leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>

                <div className="border-t border-[#E5E7EB] pt-3">
                  <div className="text-[13px] font-semibold text-[#0F172A]">{t.name}</div>
                  <div className="text-[11px] text-[#64748B]">{t.role}</div>
                  <div className="text-[11px] text-[#94A3B8]">{t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
