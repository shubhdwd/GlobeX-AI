import React, { useState, useEffect } from 'react';
import { User, Building2, Briefcase, Phone, FileBadge, Map, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../lib/api';

export default function ProfileSetup({ onBack }) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    companyType: '',
    industry: '',
    phone: '',
    exportLicense: '',
    primaryMarket: ''
  });

  const companyTypes = user?.role === 'BUYER'
    ? ['Manufacturer', 'Trader', 'MSME', 'Distributor', 'Other']
    : ['Manufacturer', 'Trader', 'MSME', 'Exporter', 'Distributor', 'Other'];

  useEffect(() => {
    // Fetch latest profile info on mount
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const data = await authApi.getProfile();
        if (data) {
          setFormData({
            name: data.name || '',
            companyName: data.companyName || '',
            companyType: data.companyType || '',
            industry: data.industry || '',
            phone: data.phone || '',
            exportLicense: data.exportLicense || '',
            primaryMarket: data.primaryMarket || ''
          });
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // We manually construct the request here because we don't have updateProfile in authApi yet
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        let errMsg = data?.message || 'Failed to update profile';
        if (data?.errors && Array.isArray(data.errors)) {
          errMsg += ': ' + data.errors.map(err => `${err.field} (${err.message})`).join(', ');
        }
        throw new Error(errMsg);
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2563EB]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center py-10 px-4 sm:px-6">
      
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] font-medium text-[13px] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2">
          <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-6 h-6 rounded border border-[#E5E7EB]" />
          <span className="text-[13px] font-bold text-[#0F172A]">GlobeX Profile</span>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F172A] px-8 py-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#2563EB] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#7C3AED] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] p-[3px]">
              <div className="w-full h-full bg-[#1E293B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(formData.name || user?.email || 'U')[0].toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{formData.name || 'Setup your Profile'}</h1>
              <p className="text-[13px] text-[#94A3B8] mt-1">{user?.email} • {user?.role === 'SELLER' ? 'Export Partner' : 'Global Buyer'}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-8 py-8">
          
          {success && (
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#86EFAC] rounded-lg px-4 py-3 mb-6">
              <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
              <p className="text-[13px] text-[#15803D] font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-[#FFF1F2] border border-[#FECDD3] rounded-lg px-4 py-3 mb-6">
              <AlertCircle size={16} className="text-[#E11D48] shrink-0" />
              <p className="text-[13px] text-[#BE123C] font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Personal Info */}
            <div className="md:col-span-2">
              <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-4 border-b border-[#F1F5F9] pb-2">Personal Details</h3>
            </div>
            
            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="John Doe" />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            {/* Company Info */}
            <div className="md:col-span-2 mt-2">
              <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-4 border-b border-[#F1F5F9] pb-2">Company Information</h3>
            </div>

            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="Acme Corp" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Company Type</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <select name="companyType" value={formData.companyType} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3 appearance-none cursor-pointer">
                  <option value="">Select type...</option>
                  {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Industry / Category</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input type="text" name="industry" value={formData.industry} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="e.g. Textiles, Spices" />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Target/Primary Market</label>
              <div className="relative">
                <Map size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                <input type="text" name="primaryMarket" value={formData.primaryMarket} onChange={handleChange}
                  className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="e.g. Europe, North America" />
              </div>
            </div>

            {user?.role === 'SELLER' && (
              <div className="col-span-1">
                <label className="block text-[12px] font-medium text-[#334155] mb-1.5">Export License No.</label>
                <div className="relative">
                  <FileBadge size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
                  <input type="text" name="exportLicense" value={formData.exportLicense} onChange={handleChange}
                    className="input-field w-full text-[13px] py-2 pl-9 pr-3" placeholder="IEC Code or relevant ID" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <button type="submit" disabled={loading}
              className="btn-primary px-8 py-2.5 text-[13px] flex items-center gap-2">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Saving...</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
