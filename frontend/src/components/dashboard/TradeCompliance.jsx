import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, Loader2, AlertCircle, Search, Filter, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { productData } from '../../lib/mockData';

export default function TradeCompliance() {
  const [selectedProduct, setSelectedProduct] = useState('Coffee');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & AI Checking States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('Spices');
  const [modalCountry, setModalCountry] = useState('Germany');
  const [checkingCompliance, setCheckingCompliance] = useState(false);
  const [checkingStep, setCheckingStep] = useState(0);
  
  const { token } = useAuth();

  const checkingSteps = [
    'Understanding Compliance Request...',
    'Searching RAG Regulations...',
    'Querying Global Trade Rules...',
    'Checking Specific Certifications...',
    'Formulating Compliance Plan...'
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const comp = productData[selectedProduct].compliance;
        const countryList = [{ countryCode: comp.country.includes('Germany') ? 'DE' : 'US', country: comp.country }];
        setCountries(countryList);
        
        if (countryList.length > 0) {
          handleSelectCountry(countryList[0].countryCode || countryList[0].country, comp);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCountries(false);
      }
    };

    if (token) {
      fetchCountries();
    }
  }, [token, selectedProduct]);

  const handleSelectCountry = async (countryId, compData = null) => {
    setSelectedCountry(countryId);
    setLoadingData(true);
    setDataError(null);
    try {
      const comp = compData || productData[selectedProduct].compliance;
      // Convert tariffs and regulations to match the UI expected grouped structure
      const mockRequirements = [];
      comp.tariffs.forEach((t, i) => mockRequirements.push({
        id: `t-${i}`, documentName: t.product, description: `${t.tariffRate} - ${t.notes}`, isRequired: true, category: 'Tariffs', authority: 'Customs', processingTime: 'N/A', estimatedCost: t.tariffRate
      }));
      comp.regulations.forEach((r, i) => mockRequirements.push({
        id: `r-${i}`, documentName: r.title, description: r.description, isRequired: true, category: 'Regulations', authority: 'Ministry', processingTime: '2-4 weeks', estimatedCost: 'Varies'
      }));

      const grouped = mockRequirements.reduce((acc, req) => {
        if (!acc[req.category]) acc[req.category] = [];
        acc[req.category].push(req);
        return acc;
      }, {});

      setComplianceData({
        country: comp.country,
        countryCode: countryId,
        totalRequirements: mockRequirements.length,
        requirements: mockRequirements,
        grouped
      });
    } catch (err) {
      setDataError(err.message);
      setComplianceData(null);
    } finally {
      setLoadingData(false);
    }
  };

  const runComplianceCheck = async (e) => {
    e.preventDefault();
    setCheckingCompliance(true);
    setCheckingStep(0);
    
    const interval = setInterval(() => {
      setCheckingStep(prev => (prev < checkingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = `Check export compliance for ${modalProduct} exported from India to ${modalCountry}. Please identify required certifications and document rules.`;
      
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: promptText })
      });
      
      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to run compliance check');
      }

      // Try to parse results from country_rules tool
      const toolResults = json.data?.tool_results || {};
      const rules = toolResults.country_rules || {};
      
      // Let's format the retrieved rules to match our UI
      const mockRequirements = [
        {
          id: 'REQ-01',
          documentName: 'Export Clearance Certificate',
          description: `Required for exporting ${modalProduct} from India.`,
          isRequired: true,
          category: 'Licensing',
          authority: 'DGFT / Customs',
          processingTime: '3-5 days',
          estimatedCost: 'Free / Nominal'
        }
      ];

      if (rules.required_certifications) {
        rules.required_certifications.forEach((cert, i) => {
          mockRequirements.push({
            id: `REQ-CERT-${i}`,
            documentName: cert,
            description: `Required certification to export ${modalProduct} to ${modalCountry}.`,
            isRequired: true,
            category: 'Certification',
            authority: 'Official Ministry / Approved Body',
            processingTime: '2-4 weeks',
            estimatedCost: 'Varies'
          });
        });
      }

      if (rules.key_requirements) {
        rules.key_requirements.forEach((req, i) => {
          mockRequirements.push({
            id: `REQ-KEY-${i}`,
            documentName: req,
            description: `Important import regulation for entering ${modalCountry}.`,
            isRequired: true,
            category: 'Import Rules',
            authority: 'Customs Authority',
            processingTime: 'N/A',
            estimatedCost: 'N/A'
          });
        });
      }

      // Group requirements by category
      const grouped = mockRequirements.reduce((acc, req) => {
        if (!acc[req.category]) acc[req.category] = [];
        acc[req.category].push(req);
        return acc;
      }, {});

      let countryCode = '🌍';
      const regionLower = modalCountry.toLowerCase();
      if (regionLower.includes('us') || regionLower.includes('america')) countryCode = 'US';
      else if (regionLower.includes('german')) countryCode = 'DE';
      else if (regionLower.includes('franc')) countryCode = 'FR';
      else if (regionLower.includes('japan')) countryCode = 'JP';
      else if (regionLower.includes('india')) countryCode = 'IN';
      else if (regionLower.includes('arab') || regionLower.includes('uae')) countryCode = 'AE';
      else if (regionLower.includes('kingdom') || regionLower.includes('uk')) countryCode = 'GB';

      setComplianceData({
        country: modalCountry,
        countryCode: countryCode,
        totalRequirements: mockRequirements.length,
        requirements: mockRequirements,
        grouped
      });

      setIsModalOpen(false);

    } catch (err) {
      clearInterval(interval);
      alert(err.message || 'Error occurred while checking compliance.');
    } finally {
      setCheckingCompliance(false);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const filteredCountries = countries.filter(c => 
    c.country.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.countryCode && c.countryCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-[calc(100vh-120px)]">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#0F172A]">Trade Compliance Workspace</h2>
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors cursor-pointer"
            >
              <option value="Coffee">Decaffeinated Coffee</option>
              <option value="Jaggery">Cane Sugar and Jaggery</option>
            </select>
          </div>
          <p className="text-sm text-[#64748B] mt-1">Verify regulatory requirements, tariffs, and necessary documentation.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <ShieldCheck size={16} />
          Run Compliance Check
        </button>
      </div>

      <div className="flex gap-6 h-full overflow-hidden pb-6">
        
        {/* Country Selector Sidebar */}
        <div className="w-1/4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-w-[250px]">
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="font-bold text-[#0F172A] mb-3">Select Market</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loadingCountries ? (
              <div className="flex justify-center p-6">
                <Loader2 className="animate-spin text-[#2563EB]" size={24} />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-[#EF4444] text-sm">{error}</div>
            ) : (
              <ul className="space-y-1">
                {filteredCountries.map(c => {
                  const id = c.countryCode || c.country;
                  const isSelected = selectedCountry === id;
                  return (
                    <li key={id}>
                      <button 
                        onClick={() => handleSelectCountry(id)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                          isSelected ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#334155] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span title={c.country}>{c.countryCode === 'US' ? '🇺🇸' : c.countryCode === 'DE' ? '🇩🇪' : c.countryCode === 'FR' ? '🇫🇷' : c.countryCode === 'IN' ? '🇮🇳' : c.countryCode === 'JP' ? '🇯🇵' : '🌍'}</span>
                          {c.country}
                        </span>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>}
                      </button>
                    </li>
                  );
                })}
                {filteredCountries.length === 0 && (
                  <div className="p-4 text-center text-[#64748B] text-sm">No countries found.</div>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Compliance Details Area */}
        <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
          {loadingData ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
              <p className="text-[#64748B] font-medium">Fetching compliance requirements...</p>
            </div>
          ) : dataError ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="text-[#F59E0B] mb-4" size={48} />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Requirements Not Found</h3>
              <p className="text-[#64748B] max-w-md">{dataError}</p>
              <button onClick={() => handleSelectCountry(selectedCountry)} className="mt-6 px-4 py-2 bg-[#F1F5F9] text-[#334155] rounded-lg text-sm font-medium hover:bg-[#E2E8F0]">
                Try Again
              </button>
            </div>
          ) : !complianceData ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <ShieldCheck className="text-[#94A3B8] mb-4" size={64} />
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">Select a Market</h3>
              <p className="text-[#64748B] max-w-md">Choose a country from the sidebar to view its specific trade compliance requirements and documents.</p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-1">{complianceData.country} Requirements</h3>
                  <p className="text-sm text-[#64748B]">Showing {complianceData.totalRequirements} compliance documents and certifications</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-2">
                    <Filter size={16} /> Filter
                  </button>
                  <button onClick={handleExportPDF} className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-2">
                    <FileText size={16} /> Export PDF
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(complianceData.grouped || {}).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-4">
                      <h4 className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0] pb-2">
                        {category}
                      </h4>
                      <div className="space-y-4">
                        {items.map(req => (
                          <div key={req.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] transition-colors shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-[#0F172A] flex items-center gap-2 text-sm">
                                {req.isRequired ? (
                                  <CheckCircle2 size={18} className="text-[#10B981]" />
                                ) : (
                                  <AlertTriangle size={18} className="text-[#F59E0B]" />
                                )}
                                {req.documentName}
                              </h5>
                              {req.isRequired && (
                                <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold uppercase rounded">Required</span>
                              )}
                            </div>
                            <p className="text-sm text-[#475569] mb-3">{req.description}</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {req.authority && (
                                <div className="bg-[#F8FAFC] p-2 rounded">
                                  <span className="text-[#64748B] block mb-0.5">Authority</span>
                                  <span className="font-medium text-[#334155]">{req.authority}</span>
                                </div>
                              )}
                              {req.processingTime && (
                                <div className="bg-[#F8FAFC] p-2 rounded">
                                  <span className="text-[#64748B] block mb-0.5">Processing Time</span>
                                  <span className="font-medium text-[#334155]">{req.processingTime}</span>
                                </div>
                              )}
                              {req.estimatedCost && (
                                <div className="bg-[#F8FAFC] p-2 rounded">
                                  <span className="text-[#64748B] block mb-0.5">Est. Cost</span>
                                  <span className="font-medium text-[#334155]">{req.estimatedCost}</span>
                                </div>
                              )}
                            </div>
                            
                            {req.referenceUrl && (
                              <a href={req.referenceUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs font-medium text-[#2563EB] hover:underline">
                                View Official Reference →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Run Compliance Check Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <ShieldCheck className="text-[#2563EB]" /> Run Compliance Check
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
                disabled={checkingCompliance}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={runComplianceCheck} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Export Product</label>
                <select 
                  value={modalProduct}
                  onChange={(e) => setModalProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2563EB]"
                  disabled={checkingCompliance}
                >
                  <option value="Coffee">Decaffeinated Coffee</option>
                  <option value="Jaggery">Cane Sugar and Jaggery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Destination Country</label>
                <select 
                  value={modalCountry}
                  onChange={(e) => setModalCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2563EB]"
                  disabled={checkingCompliance}
                >
                  <option value="United States">United States</option>
                  <option value="Germany">Germany</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  disabled={checkingCompliance}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  disabled={checkingCompliance}
                >
                  {checkingCompliance ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Run Check'
                  )}
                </button>
              </div>
            </form>

            {checkingCompliance && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-20">
                <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                <p className="text-[#0F172A] font-bold text-lg mb-2">Analyzing Import Regulations</p>
                <p className="text-[#2563EB] text-sm font-medium animate-pulse">{checkingSteps[checkingStep]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
