import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Key, CreditCard, Building, Save, Loader2, Copy, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [toast, setToast] = useState(null);

  // States for each tab
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', avatarUrl: '', role: '' });
  const [company, setCompany] = useState({ companyName: '', industry: '', gstTaxId: '', website: '', country: '', address: '', phoneNumber: '' });
  const [notifications, setNotifications] = useState({ emailNotifications: true, productUpdates: true, marketAlerts: true, buyerAlerts: true, complianceAlerts: true, weeklyReports: false });
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('globex_token')}` }
      });
      const data = await res.json();
      if (data.success) setProfile(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchCompany = async () => {
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/company', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('globex_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setCompany({
          companyName: data.data.companyName || '',
          industry: data.data.industry || '',
          gstTaxId: data.data.gstTaxId || '',
          website: data.data.website || '',
          country: data.data.country || '',
          address: data.data.address || '',
          phoneNumber: data.data.phoneNumber || ''
        });
      }
    } catch (e) { console.error(e); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/notifications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('globex_token')}` }
      });
      const data = await res.json();
      if (data.success && data.data) setNotifications(data.data);
    } catch (e) { console.error(e); }
  };

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/apikeys', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('globex_token')}` }
      });
      const data = await res.json();
      if (data.success) setApiKeys(data.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchCompany(), fetchNotifications(), fetchApiKeys()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('globex_token')}`
      };

      if (activeTab === 'profile') {
        const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/profile', { method: 'PUT', headers, body: JSON.stringify(profile) });
        if (!res.ok) throw new Error('Failed to update profile');
        await fetchProfile();
      } else if (activeTab === 'company') {
        const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/company', { method: 'PUT', headers, body: JSON.stringify(company) });
        if (!res.ok) throw new Error('Failed to update company details');
        await fetchCompany();
      } else if (activeTab === 'notifications') {
        const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/notifications', { method: 'PUT', headers, body: JSON.stringify(notifications) });
        if (!res.ok) throw new Error('Failed to update notifications');
        await fetchNotifications();
      } else if (activeTab === 'security') {
        if (security.newPassword !== security.confirmPassword) throw new Error('Passwords do not match');
        const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/security/password', { method: 'PUT', headers, body: JSON.stringify(security) });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update password');
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }

      setHasChanges(false);
      showToast('success', 'Settings updated successfully!');
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyName) return;
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/settings/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('globex_token')}`
        },
        body: JSON.stringify({ name: newKeyName })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKey(data.data.rawKey);
        setNewKeyName('');
        await fetchApiKeys();
        showToast('success', 'API Key generated');
      }
    } catch (err) {
      showToast('error', 'Failed to generate API Key');
    }
  };

  const handleRevokeApiKey = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this API key? It will immediately stop working.')) return;
    try {
      const res = await fetch(`https://globex-ai-2.onrender.com/api/v1/settings/apikeys/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('globex_token')}` }
      });
      if (res.ok) {
        await fetchApiKeys();
        showToast('success', 'API Key revoked');
      }
    } catch (err) {
      showToast('error', 'Failed to revoke API Key');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        showToast('error', 'Image size must be less than 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result });
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (setter, state) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setter({ ...state, [e.target.name]: value });
    setHasChanges(true);
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'profile', icon: User, label: 'Profile & Account' },
      { id: 'company', icon: Building, label: 'Company Details' },
      { id: 'notifications', icon: Bell, label: 'Notifications' },
      { id: 'security', icon: Shield, label: 'Security' },
      { id: 'apikeys', icon: Key, label: 'API Keys' },
      { id: 'billing', icon: CreditCard, label: 'Billing' },
    ];

    return tabs.map(tab => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button 
          key={tab.id}
          onClick={() => { setActiveTab(tab.id); setHasChanges(false); setGeneratedKey(null); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors ${
            isActive ? 'bg-[#EFF6FF] text-[#2563EB] font-bold' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <Icon size={18} /> {tab.label}
        </button>
      );
    });
  };

  const renderContent = () => {
    if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#2563EB]" /></div>;

    if (activeTab === 'profile') {
      return (
        <div className="p-8 flex flex-col gap-8 animate-fade-in">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#E2E8F0] rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-sm shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-[#64748B] uppercase">{(profile.firstName?.[0] || '') + (profile.lastName?.[0] || 'U')}</span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <label className="cursor-pointer px-4 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm font-medium text-[#334155] hover:bg-[#F1F5F9]">
                  Change Photo
                  <input type="file" accept="image/png, image/jpeg, image/gif" className="hidden" onChange={handlePhotoUpload} />
                </label>
                <button 
                  onClick={() => { setProfile({ ...profile, avatarUrl: '' }); setHasChanges(true); }}
                  className="px-4 py-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-md text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-[#64748B]">JPG, GIF or PNG. 1MB max.</p>
            </div>
          </div>
          <div className="w-full h-px bg-[#E2E8F0]"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#334155]">First Name</label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleChange(setProfile, profile)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#334155]">Last Name</label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleChange(setProfile, profile)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-[#334155]">Email Address</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange(setProfile, profile)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-[#334155]">Role</label>
              <select value={profile.role} className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm text-[#64748B] focus:outline-none" disabled>
                <option value="USER">User</option>
                <option value="ADMIN">Admin / Owner</option>
              </select>
              <p className="text-xs text-[#64748B]">To change your role, contact support.</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'company') {
      return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-[#334155]">Company Name</label>
            <input type="text" name="companyName" value={company.companyName} onChange={handleChange(setCompany, company)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Industry</label>
            <input type="text" name="industry" value={company.industry} onChange={handleChange(setCompany, company)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">GST / Tax ID</label>
            <input type="text" name="gstTaxId" value={company.gstTaxId} onChange={handleChange(setCompany, company)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-[#334155]">Website</label>
            <input type="url" name="website" value={company.website} onChange={handleChange(setCompany, company)} placeholder="https://" className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Country</label>
            <input type="text" name="country" value={company.country} onChange={handleChange(setCompany, company)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Phone Number</label>
            <input type="text" name="phoneNumber" value={company.phoneNumber} onChange={handleChange(setCompany, company)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-bold text-[#334155]">Registered Address</label>
            <textarea name="address" value={company.address} onChange={handleChange(setCompany, company)} rows={3} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
        </div>
      );
    }

    if (activeTab === 'notifications') {
      const renderSwitch = (key, label, description) => (
        <div className="flex items-center justify-between py-4 border-b border-[#E2E8F0] last:border-0">
          <div>
            <p className="text-sm font-bold text-[#334155]">{label}</p>
            <p className="text-xs text-[#64748B] mt-1">{description}</p>
          </div>
          <button 
            type="button"
            onClick={() => { setNotifications({ ...notifications, [key]: !notifications[key] }); setHasChanges(true); }}
            className={`w-11 h-6 rounded-full relative transition-colors ${notifications[key] ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${notifications[key] ? 'translate-x-6' : 'translate-x-1'}`}></div>
          </button>
        </div>
      );
      return (
        <div className="p-8 flex flex-col animate-fade-in">
          {renderSwitch('emailNotifications', 'Email Notifications', 'Receive system alerts and updates via email')}
          {renderSwitch('productUpdates', 'Product Updates', 'Get notified about new GlobeX features and modules')}
          {renderSwitch('marketAlerts', 'Market Alerts', 'Receive intelligence on market shifts for your tracked products')}
          {renderSwitch('buyerAlerts', 'Buyer Alerts', 'Get notified when new high-intent buyers match your profile')}
          {renderSwitch('complianceAlerts', 'Compliance Alerts', 'Alerts regarding regulatory changes in your target markets')}
          {renderSwitch('weeklyReports', 'Weekly Reports', 'Receive a weekly digest of your export performance')}
        </div>
      );
    }

    if (activeTab === 'security') {
      return (
        <div className="p-8 flex flex-col gap-6 animate-fade-in max-w-xl">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Current Password</label>
            <input type="password" name="currentPassword" value={security.currentPassword} onChange={handleChange(setSecurity, security)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">New Password</label>
            <input type="password" name="newPassword" value={security.newPassword} onChange={handleChange(setSecurity, security)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#334155]">Confirm New Password</label>
            <input type="password" name="confirmPassword" value={security.confirmPassword} onChange={handleChange(setSecurity, security)} className="w-full px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" />
          </div>
          <div className="mt-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
            <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 mb-2"><Shield size={16} className="text-[#2563EB]" /> Two-Factor Authentication</h4>
            <p className="text-xs text-[#64748B] mb-3">Add an extra layer of security to your account.</p>
            <button disabled className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#64748B] rounded-md text-sm font-medium cursor-not-allowed">Enable 2FA (Coming Soon)</button>
          </div>
        </div>
      );
    }

    if (activeTab === 'apikeys') {
      return (
        <div className="p-8 flex flex-col gap-8 animate-fade-in">
          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-2">Create New API Key</h4>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={newKeyName} 
                onChange={(e) => setNewKeyName(e.target.value)} 
                placeholder="e.g., Zapier Integration" 
                className="flex-1 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]" 
              />
              <button 
                onClick={handleGenerateApiKey} 
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-[#2563EB] text-white font-medium rounded-lg text-sm hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
              >
                Generate Key
              </button>
            </div>
          </div>

          {generatedKey && (
            <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg">
              <p className="text-sm font-bold text-[#065F46] flex items-center gap-2 mb-2"><CheckCircle2 size={16} /> API Key Generated</p>
              <p className="text-xs text-[#047857] mb-3">Please copy your API key now. You won't be able to see it again.</p>
              <div className="flex items-center gap-2 bg-white border border-[#A7F3D0] rounded p-2">
                <code className="text-xs flex-1 truncate">{generatedKey}</code>
                <button onClick={() => { navigator.clipboard.writeText(generatedKey); showToast('success', 'Copied to clipboard'); }} className="text-[#059669] hover:bg-[#D1FAE5] p-1 rounded">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold text-[#0F172A] mb-4">Active API Keys</h4>
            {apiKeys.length === 0 ? (
              <p className="text-sm text-[#64748B]">No active API keys found.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {apiKeys.map(key => (
                  <div key={key.id} className="flex items-center justify-between p-4 bg-white border border-[#E2E8F0] rounded-lg">
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">{key.name}</p>
                      <p className="text-xs text-[#64748B] mt-1">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleRevokeApiKey(key.id)} className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors" title="Revoke Key">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'billing') {
      return (
        <div className="p-16 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-4 border border-[#E2E8F0]">
            <CreditCard size={32} className="text-[#94A3B8]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Billing & Invoices</h3>
          <p className="text-[#64748B] max-w-sm mb-6">You are currently on the Enterprise Beta plan. Self-serve billing and invoice management is coming soon.</p>
          <button disabled className="px-6 py-2.5 bg-[#EFF6FF] text-[#2563EB] font-bold rounded-lg text-sm opacity-70 cursor-not-allowed">
            Coming Soon
          </button>
        </div>
      );
    }
  };

  const getTabTitle = () => {
    const titles = {
      profile: { title: 'Profile & Account', desc: 'Update your personal information and email address.' },
      company: { title: 'Company Details', desc: 'Manage your registered business entity information.' },
      notifications: { title: 'Notification Preferences', desc: 'Control when and how you receive alerts.' },
      security: { title: 'Security Settings', desc: 'Manage passwords and 2FA.' },
      apikeys: { title: 'API Keys', desc: 'Manage keys for programmatic access.' },
      billing: { title: 'Billing & Subscriptions', desc: 'Manage your plan and invoices.' },
    };
    return titles[activeTab];
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 relative">
      {toast && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in z-50 ${toast.type === 'success' ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]' : 'bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B]'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Platform Settings</h2>
          <p className="text-sm text-[#64748B] mt-1">Manage your account, team members, and integration preferences.</p>
        </div>
        {['profile', 'company', 'notifications', 'security'].includes(activeTab) && (
          <button 
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm ${hasChanges && !saving ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white' : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'}`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          {renderTabs()}
        </div>

        <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden min-h-[500px]">
          <div className="p-6 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="font-bold text-[#0F172A] text-lg">{getTabTitle().title}</h3>
            <p className="text-sm text-[#64748B] mt-1">{getTabTitle().desc}</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
