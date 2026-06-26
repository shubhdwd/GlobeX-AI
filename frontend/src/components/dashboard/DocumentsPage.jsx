import React, { useState } from 'react';
import { FileText, Download, Filter, Search, MoreVertical, Plus, FileSpreadsheet, FileIcon, FileBadge2, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([
    { id: 'DOC-2026-042', name: 'Commercial Invoice - Tech Corp EU', type: 'Invoice', date: 'Oct 24, 2026', status: 'Approved', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'DOC-2026-041', name: 'Packing List - Shipment #8402', type: 'Logistics', date: 'Oct 22, 2026', status: 'Pending', icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'DOC-2026-040', name: 'Certificate of Origin (Germany)', type: 'Compliance', date: 'Oct 15, 2026', status: 'Approved', icon: FileBadge2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'DOC-2026-039', name: 'Bill of Lading - Sea Freight', type: 'Transport', date: 'Oct 12, 2026', status: 'Draft', icon: FileIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'DOC-2026-038', name: 'Commercial Invoice - Alpha Industries', type: 'Invoice', date: 'Oct 05, 2026', status: 'Approved', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docType, setDocType] = useState('Invoice');
  const [buyerName, setBuyerName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [quantity, setQuantity] = useState('500');
  const [creating, setCreating] = useState(false);
  const [creatingStep, setCreatingStep] = useState(0);

  const { token } = useAuth();

  const creatingSteps = [
    'Parsing Document Details...',
    'Invoking Document Generator Agent...',
    'Calculating Subtotals & Taxes...',
    'Structuring Invoice Fields...',
    'Signing & Finalizing PDF...'
  ];

  const handleCreateDocument = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreatingStep(0);

    const interval = setInterval(() => {
      setCreatingStep(prev => (prev < creatingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = docType === 'Invoice'
        ? `Generate a commercial invoice for buyer ${buyerName} for ${quantity} units of ${productDesc}.`
        : `Generate a packing list for buyer ${buyerName} for ${quantity} packages of ${productDesc}.`;

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
        throw new Error(json.message || 'Failed to create document');
      }

      // Prepend the new document to the list
      const newDoc = {
        id: `DOC-2026-0${Math.floor(100 + Math.random() * 900)}`,
        name: docType === 'Invoice' ? `Commercial Invoice - ${buyerName}` : `Packing List - ${buyerName}`,
        type: docType === 'Invoice' ? 'Invoice' : 'Logistics',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'Approved',
        icon: docType === 'Invoice' ? FileText : FileSpreadsheet,
        color: docType === 'Invoice' ? 'text-blue-500' : 'text-emerald-500',
        bg: docType === 'Invoice' ? 'bg-blue-50' : 'bg-emerald-50'
      };

      setDocuments(prev => [newDoc, ...prev]);
      setIsModalOpen(false);
      setBuyerName('');
      setProductDesc('');
      setQuantity('500');

    } catch (err) {
      clearInterval(interval);
      alert(err.message || 'Error occurred while creating document.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Document Center</h2>
          <p className="text-sm text-[#64748B] mt-1">Manage invoices, compliance forms, and shipping documents.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} />
          Create Document
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search documents by name, ID, or type..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] flex items-center gap-2">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Document Name</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Type</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Date Added</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, i) => (
                <tr key={i} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.bg} ${doc.color}`}>
                        <doc.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{doc.name}</p>
                        <p className="text-xs text-[#64748B]">{doc.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#475569]">{doc.type}</td>
                  <td className="px-5 py-4 text-sm text-[#475569]">{doc.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                      doc.status === 'Approved' ? 'bg-[#ECFDF5] text-[#059669] border border-[#D1FAE5]' :
                      doc.status === 'Pending' ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]' :
                      'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-md transition-colors" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors" title="More options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-sm text-[#64748B] bg-[#F8FAFC]">
          <p>Showing 1 to {documents.length} of {documents.length} documents</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-[#F1F5F9]" disabled>Previous</button>
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white hover:bg-[#F1F5F9]" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Create Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Plus className="text-[#2563EB]" /> Generate AI Document
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
                disabled={creating}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Document Type</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm bg-white focus:outline-none focus:border-[#2563EB]"
                  disabled={creating}
                >
                  <option value="Invoice">Commercial Invoice</option>
                  <option value="Logistics">Packing List</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Buyer / Consignee Name</label>
                <input 
                  type="text" 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="e.g. Spice World Inc. or Tech Corp EU"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Product Description</label>
                <input 
                  type="text" 
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="e.g. Organic Turmeric Powder"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Quantity (units/packages)</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={creating}
                />
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Document'
                  )}
                </button>
              </div>
            </form>

            {creating && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-20">
                <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                <p className="text-[#0F172A] font-bold text-lg mb-2">AI Document Generation</p>
                <p className="text-[#2563EB] text-sm font-medium animate-pulse">{creatingSteps[creatingStep]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
