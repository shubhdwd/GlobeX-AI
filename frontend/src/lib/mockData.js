// Mock data derived from India Export Data & Trade Map (Decaffeinated Coffee & Cane Sugar/Jaggery)

export const mockDashboardSummary = {
  overview: {
    buyersFound: 845,
    countriesAnalyzed: 52,
    activeLeads: 215,
    avgLeadScore: 86
  },
  pipeline: [
    { status: 'Discovery', count: 320 },
    { status: 'Qualified', count: 185 },
    { status: 'Contacted', count: 90 },
    { status: 'In Negotiation', count: 42 },
    { status: 'Closed Won', count: 28 }
  ],
  topCountries: [
    { country: 'United States', demandScore: 98 },
    { country: 'Germany', demandScore: 94 },
    { country: 'UAE', demandScore: 92 },
    { country: 'UK', demandScore: 88 },
    { country: 'Japan', demandScore: 85 }
  ],
  recentLeads: [
    { name: 'Tchibo GmbH', location: 'Germany', interest: 'High' },
    { name: 'ASR Group', location: 'United States', interest: 'High' },
    { name: 'Al Khaleej Sugar', location: 'UAE', interest: 'Medium' }
  ]
};

export const productData = {
  Coffee: {
    buyers: [
      { id: 'c1', companyName: 'Tchibo Coffee International', country: 'Germany', countryCode: 'DE', industry: 'Food & Beverages (Decaf Coffee)', leadScore: 98, email: 'purchasing@tchibo.de', website: 'www.tchibo.de', isVerified: true, importVolume: '22,400 MT/yr', annualRevenue: '€3.2B', employeeCount: '11,000+', phone: '+49 40 6387-0' },
      { id: 'c2', companyName: 'Keurig Dr Pepper Inc.', country: 'United States', countryCode: 'US', industry: 'Beverages', leadScore: 95, email: 'imports@kdrp.com', website: 'www.keurigdrpepper.com', isVerified: true, importVolume: '135,000 MT/yr', annualRevenue: '$14.0B', employeeCount: '28,000+', phone: '+1 877 208-9991' },
      { id: 'c3', companyName: 'Cafés Richard', country: 'France', countryCode: 'FR', industry: 'Coffee Roasting', leadScore: 89, email: 'contact@cafesrichard.fr', website: 'www.cafesrichard.fr', isVerified: true, importVolume: '8,500 MT/yr', annualRevenue: '€150M', employeeCount: '1,200', phone: '+33 1 40 86 22 22' },
      { id: 'c4', companyName: 'UCC Ueshima Coffee Co.', country: 'Japan', countryCode: 'JP', industry: 'Coffee Roasting', leadScore: 91, email: 'global@ucc.co.jp', website: 'www.ucc.co.jp', isVerified: true, importVolume: '45,000 MT/yr', annualRevenue: '¥310B', employeeCount: '4,500', phone: '+81 78-304-8811' },
      { id: 'c5', companyName: 'Massimo Zanetti', country: 'Italy', countryCode: 'IT', industry: 'Food & Beverages', leadScore: 88, email: 'procurement@mzb.com', website: 'www.mzb-group.com', isVerified: true, importVolume: '32,000 MT/yr', annualRevenue: '€1.1B', employeeCount: '3,000', phone: '+39 0422 3126' }
    ],
    marketOpportunities: [
      { id: 1, country: 'Germany', countryCode: 'DE', demandScore: 94, avgTariff: 0, growthRate: '+14.2%', competition: 'Medium', marketSize: '$3.2B', trend: 'Growing', insights: 'Surge in EU imports for decaffeinated coffee. Strong sustainability focus.' },
      { id: 2, country: 'United States', countryCode: 'US', demandScore: 89, avgTariff: 0, growthRate: '+8.7%', competition: 'High', marketSize: '$5.5B', trend: 'Stable', insights: 'Consistent demand for Indian spices and coffee. Strong market for organic labels.' },
      { id: 3, country: 'Italy', countryCode: 'IT', demandScore: 85, avgTariff: 0, growthRate: '+6.5%', competition: 'High', marketSize: '$2.1B', trend: 'Stable', insights: 'Traditional roasting market looking for alternative decaf sources.' }
    ],
    compliance: {
      country: 'Germany (EU)',
      tariffs: [
        { product: 'Decaffeinated Coffee (090112)', tariffRate: '0% (Under GSP/EBA)', notes: 'Preferential origin rules apply.' }
      ],
      regulations: [
        { id: 1, title: 'EU Deforestation Regulation (EUDR)', description: 'Coffee exports must prove they do not originate from recently deforested land.' },
        { id: 2, title: 'Maximum Residue Limits (MRLs)', description: 'Strict limits on pesticide residues. Requires lab testing.' }
      ]
    }
  },
  Jaggery: {
    buyers: [
      { id: 'j1', companyName: 'ASR Group', country: 'United States', countryCode: 'US', industry: 'Sugar & Sweeteners', leadScore: 96, email: 'sourcing@asr-group.com', website: 'www.asr-group.com', isVerified: true, importVolume: '55,000 MT/yr', annualRevenue: '$2.5B', employeeCount: '6,000+', phone: '+1 800 223-1122' },
      { id: 'j2', companyName: 'Al Khaleej Sugar', country: 'United Arab Emirates', countryCode: 'AE', industry: 'Sugar Refinery', leadScore: 92, email: 'procurement@alkhaleejsugar.ae', website: 'www.alkhaleejsugar.ae', isVerified: true, importVolume: '1.5M MT/yr', annualRevenue: 'Undisclosed', employeeCount: '800+', phone: '+971 4 881 6666' },
      { id: 'j3', companyName: 'Tate & Lyle Sugars', country: 'United Kingdom', countryCode: 'GB', industry: 'Food Ingredients', leadScore: 89, email: 'imports@tateandlylesugars.com', website: 'www.wearetateandlylesugars.com', isVerified: true, importVolume: '45,000 MT/yr', annualRevenue: '£800M', employeeCount: '1,500', phone: '+44 20 7476 4455' },
      { id: 'j4', companyName: 'Lantic Inc.', country: 'Canada', countryCode: 'CA', industry: 'Sugar Refining', leadScore: 85, email: 'supply@lantic.ca', website: 'www.lantic.ca', isVerified: true, importVolume: '20,000 MT/yr', annualRevenue: '$700M', employeeCount: '1,000', phone: '+1 514-527-8686' },
      { id: 'j5', companyName: 'Mitr Phol Group', country: 'Thailand', countryCode: 'TH', industry: 'Sugar & Bio-Energy', leadScore: 82, email: 'global@mitrphol.com', website: 'www.mitrphol.com', isVerified: false, importVolume: '110,000 MT/yr', annualRevenue: '$3.0B', employeeCount: '15,000+', phone: '+66 2 790 6000' }
    ],
    marketOpportunities: [
      { id: 1, country: 'United States', countryCode: 'US', demandScore: 95, avgTariff: 2.5, growthRate: '+18.5%', competition: 'Low', marketSize: '$1.2B', trend: 'Booming', insights: 'Surging demand for natural, unrefined sweeteners and organic jaggery in health food sectors.' },
      { id: 2, country: 'United Arab Emirates', countryCode: 'AE', demandScore: 91, avgTariff: 5, growthRate: '+12.0%', competition: 'Medium', marketSize: '$450M', trend: 'Growing', insights: 'High demand driven by the large South Asian diaspora and traditional sweet manufacturing.' },
      { id: 3, country: 'United Kingdom', countryCode: 'GB', demandScore: 88, avgTariff: 0, growthRate: '+9.2%', competition: 'Medium', marketSize: '$320M', trend: 'Stable', insights: 'Consistent ethnic market demand with growing crossover into mainstream natural foods.' }
    ],
    compliance: {
      country: 'United States (FDA)',
      tariffs: [
        { product: 'Cane Sugar / Jaggery (170114)', tariffRate: 'TRQ Applies', notes: 'Subject to Tariff-Rate Quota (TRQ) limits.' }
      ],
      regulations: [
        { id: 1, title: 'FDA Facility Registration', description: 'Manufacturing facilities must be registered with the US FDA before exporting.' },
        { id: 2, title: 'FSMA Compliance', description: 'Must adhere to the Food Safety Modernization Act (FSMA) preventive controls.' },
        { id: 3, title: 'Labeling Requirements', description: 'Nutritional facts must comply with FDA guidelines, specifically for added sugars.' }
      ]
    }
  }
};

// Fallbacks for backward compatibility
export const mockBuyers = productData.Coffee.buyers;
export const mockMarketOpportunities = productData.Coffee.marketOpportunities;
export const mockCompliance = productData.Coffee.compliance;
export const mockGlobalExpansionOpportunities = { opportunities: productData.Coffee.marketOpportunities };
