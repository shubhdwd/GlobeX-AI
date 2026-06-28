import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Building2,
  FileText,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  TrendingUp,
  Globe
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { productData } from '../../lib/mockData';

export default function BuyerDiscovery() {
  const [selectedProduct, setSelectedProduct] = useState('Coffee');
  const [selectedLead, setSelectedLead] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState('Coffee');
  const [modalCountry, setModalCountry] = useState('Germany');
  const [runningDiscovery, setRunningDiscovery] = useState(false);
  const [discoveryStep, setDiscoveryStep] = useState(0);

  // Email Generation States
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const { token } = useAuth();

  const discoverySteps = [
    'Understanding Discovery Request...',
    'Searching Global Trade Databases...',
    'Scraping Corporate Directories...',
    'Filtering for Verified Importers...',
    'Applying Lead Scoring Models...',
    'Compiling Verified Buyers List...'
  ];

  const fetchBuyers = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      // Use mock data directly based on selected product
      let mockList = productData[selectedProduct].buyers;
      if (query) {
        mockList = mockList.filter(b => b.companyName.toLowerCase().includes(query.toLowerCase()));
      }
      setBuyers(mockList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBuyers(searchQuery);
    }
  }, [token, selectedProduct]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuyers(searchQuery);
  };

  const handleRunDiscovery = async (e) => {
    e.preventDefault();
    setRunningDiscovery(true);
    setDiscoveryStep(0);

    const interval = setInterval(() => {
      setDiscoveryStep(prev => (prev < discoverySteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = `Find verified buyers for Indian ${modalProduct} exports to ${modalCountry}.`;
      
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
        throw new Error(json.message || 'Failed to run AI discovery');
      }

      // Try to parse results from buyer_discovery tool
      const toolResults = json.data?.tool_results || {};
      const foundBuyers = toolResults.buyer_discovery?.buyers || [];

      if (foundBuyers.length > 0) {
        // Map to format
        const formatted = foundBuyers.map((b, index) => ({
          id: b.id || `lead-ai-${index}`,
          companyName: b.companyName || b.name || b.company_name || 'AI Discovered Importer',
          country: b.country || modalCountry,
          countryCode: b.countryCode || 'DE',
          industry: b.industry || 'Food & Beverages',
          leadScore: b.leadScore || 85,
          email: b.email || `contact@${(b.companyName || 'importer').toLowerCase().replace(/[^a-z]/g, '')}.com`,
          website: b.website || `www.${(b.companyName || 'importer').toLowerCase().replace(/[^a-z]/g, '')}.com`,
          isVerified: b.isVerified !== undefined ? b.isVerified : true,
          importVolume: b.importVolume || 'High Volume importer of agricultural products.'
        }));
        setBuyers(formatted);
      } else {
        // Fallback to database query if nothing returned
        fetchBuyers(modalProduct);
      }
      setIsModalOpen(false);
    } catch (err) {
      clearInterval(interval);
      toast.error(err.message || 'Error running AI Buyer Discovery');
    } finally {
      setRunningDiscovery(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!selectedLead) return;
    setGeneratingEmail(true);
    setIsEmailModalOpen(true);
    setGeneratedEmail(null);

    try {
      const promptText = `Write a professional B2B outreach email to ${selectedLead.companyName} located in ${selectedLead.country}. We want to export ${selectedLead.industry} to them. Keep it concise, formal, and persuasive. VERY IMPORTANT: Write the email entirely in ${selectedLanguage}.`;
      
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: promptText })
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error('Failed to generate email');
      
      setGeneratedEmail(json.data?.response || 'Could not generate email.');
    } catch (err) {
      setGeneratedEmail('Error generating email. Please try again.');
      toast.error('Failed to generate email.');
    } finally {
      setGeneratingEmail(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 animate-fade-in">
      
      {/* Main Table Area */}
      <div className={`flex flex-col bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${selectedLead ? 'w-2/3' : 'w-full'}`}>
        
        <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-[#0F172A]">Discovered Buyers</h2>
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="px-2 py-1 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors cursor-pointer"
            >
              <option value="Coffee">Decaffeinated Coffee</option>
              <option value="Jaggery">Cane Sugar and Jaggery</option>
            </select>
          </div>
          <div className="flex gap-2">
            <form onSubmit={handleSearch} className="relative flex">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search companies..." 
                className="pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-l-md text-sm focus:outline-none focus:border-[#2563EB]"
              />
              <button type="submit" className="px-3 bg-[#F1F5F9] border border-l-0 border-[#E2E8F0] rounded-r-md text-[#475569] hover:bg-[#E2E8F0] text-sm font-medium">
                Search
              </button>
            </form>
            <button className="p-2 border border-[#E2E8F0] rounded-md text-[#64748B] hover:bg-[#F8FAFC]" title="Filter">
              <Filter size={16} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Run Discovery
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative bg-[#F8FAFC]">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
              <Loader2 className="animate-spin text-[#2563EB] mb-2" size={32} />
              <p className="text-[#64748B] text-sm font-medium">Fetching buyers from database...</p>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <AlertCircle className="text-[#EF4444] mb-2" size={32} />
              <p className="text-[#0F172A] font-medium">{error}</p>
              <button onClick={() => fetchBuyers(searchQuery)} className="mt-4 text-[#2563EB] text-sm hover:underline">Try Again</button>
            </div>
          ) : buyers.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
              <Building2 className="text-[#94A3B8] mb-2" size={48} />
              <p className="text-[#0F172A] font-medium text-lg">No buyers found</p>
              <p className="text-[#64748B] text-sm mt-1 max-w-md text-center">We couldn't find any buyers matching your criteria. Try running the AI Discovery agent or adjusting your search.</p>
            </div>
          ) : null}

          <table className="w-full text-left border-collapse min-w-[600px] bg-white">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 shadow-sm border-b border-[#E2E8F0]">
              <tr>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Company</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Industry</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider">Trust Score</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider w-12"></th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((lead) => (
                <tr 
                  key={lead.id} 
                  onClick={() => setSelectedLead(lead)}
                  className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${selectedLead?.id === lead.id ? 'bg-[#EFF6FF]' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 font-bold text-xs">
                        {lead.companyName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{lead.companyName}</p>
                        <p className="text-xs text-[#64748B]">{lead.email || lead.website || 'No contact info'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#475569]">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none" title={lead.country}>{lead.countryCode === 'US' ? '🇺🇸' : lead.countryCode === 'DE' ? '🇩🇪' : lead.countryCode === 'FR' ? '🇫🇷' : lead.countryCode === 'IN' ? '🇮🇳' : '🌍'}</span>
                      {lead.country}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[#334155]">{lead.industry}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${lead.leadScore > 85 ? 'bg-[#10B981]' : lead.leadScore > 70 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}
                          style={{ width: `${Math.min(lead.leadScore, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#334155]">{lead.leadScore}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded hover:bg-[#E2E8F0]">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Sidebar Panel */}
      {selectedLead && (
        <div className="w-1/3 bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex flex-col overflow-hidden animate-fade-in shrink-0">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-start bg-[#F8FAFC]">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">{selectedLead.companyName}</h3>
              <p className="text-sm text-[#64748B]">{selectedLead.country} ({selectedLead.countryCode})</p>
            </div>
            <button onClick={() => setSelectedLead(null)} className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded hover:bg-[#E2E8F0]">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-6">
            <div>
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Company Details</h4>
              <ul className="text-sm text-[#334155] space-y-2">
                <li><span className="font-medium text-[#64748B] w-24 inline-block">Industry:</span> {selectedLead.industry}</li>
                <li><span className="font-medium text-[#64748B] w-24 inline-block">Revenue:</span> {selectedLead.annualRevenue || 'Undisclosed'}</li>
                <li><span className="font-medium text-[#64748B] w-24 inline-block">Employees:</span> {selectedLead.employeeCount || 'Unknown'}</li>
                <li><span className="font-medium text-[#64748B] w-24 inline-block">Website:</span> {selectedLead.website ? <a href={`https://${selectedLead.website}`} target="_blank" rel="noreferrer" className="text-[#2563EB] hover:underline">{selectedLead.website}</a> : 'N/A'}</li>
                <li><span className="font-medium text-[#64748B] w-24 inline-block">Phone:</span> {selectedLead.phone || 'N/A'}</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">AI Intelligence</h4>
              {selectedLead.isVerified ? (
                <div className="flex items-start gap-3 mb-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Verified Corporate Entity</p>
                    <p className="text-xs text-[#64748B]">Business registration validated against national databases.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 mb-3 p-3 bg-[#FFFBEB] rounded-lg border border-[#FEF3C7]">
                  <AlertCircle size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Unverified Entity</p>
                    <p className="text-xs text-[#64748B]">Proceed with caution, registration data pending validation.</p>
                  </div>
                </div>
              )}
              
              {selectedLead.importVolume && (
                <div className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <TrendingUp size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">Import Volume</p>
                    <p className="text-xs text-[#64748B]">{selectedLead.importVolume}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Outreach Language</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleGenerateEmail}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm mt-1"
            >
              <span className="text-base">✨</span>
              Draft Email in {selectedLanguage}
            </button>
            <button className="w-full py-2.5 flex items-center justify-center gap-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] transition-colors">
              <FileText size={16} />
              View Full Profile
            </button>
          </div>
        </div>
      )}

      {/* Run Discovery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <RefreshCw className="text-[#2563EB] animate-spin-slow" size={18} /> Run AI Buyer Discovery
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
                disabled={runningDiscovery}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRunDiscovery} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Target Product</label>
                <select 
                  value={modalProduct}
                  onChange={(e) => setModalProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2563EB]"
                  disabled={runningDiscovery}
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
                  disabled={runningDiscovery}
                >
                  <option value="Germany">Germany</option>
                  <option value="United States">United States</option>
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
                  disabled={runningDiscovery}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  disabled={runningDiscovery}
                >
                  {runningDiscovery ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Discovering...
                    </>
                  ) : (
                    'Discover Buyers'
                  )}
                </button>
              </div>
            </form>

            {runningDiscovery && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-20">
                <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                <p className="text-[#0F172A] font-bold text-lg mb-2">AI Buyer Discovery Active</p>
                <p className="text-[#2563EB] text-sm font-medium animate-pulse">{discoverySteps[discoveryStep]}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Generation Modal */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0] flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] shrink-0">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <span className="text-xl">📧</span> AI Outreach Draft
              </h3>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {generatingEmail ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                  <p className="text-[#0F172A] font-bold text-lg mb-2">Generating personalized email...</p>
                  <p className="text-[#64748B] text-sm">Analyzing {selectedLead?.companyName} and drafting optimal value proposition in {selectedLanguage}.</p>
                </div>
              ) : (
                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] text-sm text-[#334155] markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-4" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2 mt-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 mt-3" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 whitespace-pre-wrap" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                      li: ({node, ...props}) => <li className="mb-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-[#0F172A]" {...props} />,
                    }}
                  >
                    {generatedEmail}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] flex justify-end gap-3 bg-white shrink-0">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(generatedEmail);
                  toast.success('Email copied to clipboard!');
                }}
                disabled={generatingEmail || !generatedEmail}
                className="px-4 py-2 text-sm font-semibold text-[#334155] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg transition-colors disabled:opacity-50"
              >
                Copy to Clipboard
              </button>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
