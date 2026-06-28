import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { chatApi } from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AICopilot() {
  const [selectedProduct, setSelectedProduct] = useState('Coffee');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I am your GlobeX Trade Copilot. I can help you find buyers, analyze tariffs, or generate outreach emails. What would you like to do today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg = { id: Date.now(), type: 'user', text: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    try {
      const productName = selectedProduct === 'Coffee' ? 'Decaffeinated Coffee' : 'Cane Sugar and Jaggery';
      // Append product context to the backend request so the AI knows what we are talking about
      const contextInput = `[Context: User is focusing on exporting ${productName}] ${text}`;
      const result = await chatApi.send(contextInput);
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          type: 'ai', 
          text: result.response || 'Sorry, I could not generate a response.'
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          type: 'ai', 
          text: `Error: ${error.message || 'Something went wrong.'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput('');
    await sendMessage(currentInput);
  };

  React.useEffect(() => {
    const pendingQuery = localStorage.getItem('copilotPendingQuery');
    if (pendingQuery) {
      localStorage.removeItem('copilotPendingQuery');
      sendMessage(pendingQuery);
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white border border-[#E2E8F0] rounded-xl shadow-sm animate-fade-in overflow-hidden">
      
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Trade Copilot</h2>
            <p className="text-sm text-[#64748B]">Powered by GlobeX Intelligence</p>
          </div>
        </div>
        <select 
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-colors cursor-pointer"
        >
          <option value="Coffee">Decaffeinated Coffee</option>
          <option value="Jaggery">Cane Sugar and Jaggery</option>
        </select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.type === 'user' ? 'bg-[#E2E8F0] text-[#475569]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
              {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.type === 'user' 
                ? 'bg-[#2563EB] text-white rounded-tr-sm' 
                : 'bg-[#F1F5F9] text-[#0F172A] rounded-tl-sm'
            }`}>
              {msg.type === 'ai' ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2 mt-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-[#0F172A]" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-200 border border-gray-300" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-gray-100" {...props} />,
                    th: ({node, ...props}) => <th className="px-3 py-2 font-semibold text-left text-xs text-gray-700 uppercase tracking-wider border border-gray-300" {...props} />,
                    td: ({node, ...props}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700 border border-gray-300" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    code: ({node, inline, ...props}) => inline ? <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} /> : <pre className="bg-gray-800 text-white p-2 rounded text-xs overflow-x-auto mb-2"><code {...props} /></pre>
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#EFF6FF] text-[#2563EB]">
              <Bot size={14} />
            </div>
            <div className="p-4 rounded-2xl text-sm leading-relaxed bg-[#F1F5F9] text-[#0F172A] rounded-tl-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#2563EB]" /> Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#E2E8F0] bg-white">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about tariffs, buyers, or compliance..."
            className="w-full pl-5 pr-12 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
          <button 
            type="submit"
            className="absolute right-2 p-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
        <div className="flex gap-2 mt-3 pl-2 overflow-x-auto">
          <button onClick={() => setInput("Find buyers for cotton in Germany")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-medium hover:bg-[#DBEAFE] whitespace-nowrap">
            <Sparkles size={12} /> Find buyers for cotton in Germany
          </button>
          <button onClick={() => setInput("What are the US import tariffs for spices?")} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] rounded-full text-xs font-medium hover:bg-[#DBEAFE] whitespace-nowrap">
            <Sparkles size={12} /> What are the US import tariffs for spices?
          </button>
        </div>
      </div>
      
    </div>
  );
}
