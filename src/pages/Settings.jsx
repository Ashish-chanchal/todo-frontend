import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Key, Copy, Check, Trash2, ArrowLeft, Plus, CreditCard, ShieldAlert, Terminal } from 'lucide-react';

function Settings({ onBack }) {
  const { token, user } = useAuth();
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Subscription state
  const [subTier, setSubTier] = useState('free');
  const [subStatus, setSubStatus] = useState('none');
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingMessage, setBillingMessage] = useState('');

  const fetchKeys = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/api-keys`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setKeys(data.keys);
      }
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    }
  };

  const fetchBillingStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/billing/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubTier(data.subscription.tier);
        setSubStatus(data.subscription.status);
      }
    } catch (err) {
      console.error('Failed to fetch billing status:', err);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchBillingStatus();
  }, [token]);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setLoading(true);
    setError('');
    setGeneratedKey(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/api-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newKeyName })
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedKey(data);
        setNewKeyName('');
        fetchKeys();
      } else {
        setError(data.msg || 'Failed to create key');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (id) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access.')) {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/api-keys/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchKeys();
        if (generatedKey && generatedKey.id === id) {
          setGeneratedKey(null);
        }
      }
    } catch (err) {
      console.error('Failed to revoke key:', err);
    }
  };

  const copyToClipboard = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey.rawKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mcpUrl = `${import.meta.env.VITE_MCP_SERVER_URL}/mcp`;

  const mcpConfig = generatedKey ? {
    mcpServers: {
      todoai: {
        url: mcpUrl,
        headers: {
          'x-api-key': generatedKey.rawKey
        }
      }
    }
  } : null;

  const copyConfig = () => {
    if (!mcpConfig) return;
    navigator.clipboard.writeText(JSON.stringify(mcpConfig, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  // Helper to dynamically load the Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay checkout flow
  const handleUpgrade = async (targetTier) => {
    setBillingLoading(true);
    setBillingMessage('');
    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setBillingMessage('❌ Failed to load Razorpay SDK. Check your network.');
        setBillingLoading(false);
        return;
      }

      // 2. Fetch Razorpay Public Key ID
      const keyRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/billing/razorpay/key`);
      if (!keyRes.ok) {
        const keyData = await keyRes.json();
        throw new Error(keyData.msg || 'Failed to fetch Razorpay public key');
      }
      const { keyId } = await keyRes.json();

      // 3. Create Razorpay order
      const orderRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/billing/razorpay/order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tier: targetTier })
      });
      
      if (!orderRes.ok) {
        const orderData = await orderRes.json();
        throw new Error(orderData.msg || 'Failed to create payment order');
      }
      const orderData = await orderRes.json();

      // 4. Open Razorpay checkout widget
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TodoAI Workspace',
        description: `Upgrade workspace to ${targetTier.toUpperCase()} subscription`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setBillingLoading(true);
            setBillingMessage('⏳ Verifying payment signature...');
            const verifyRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/billing/razorpay/verify`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                tier: targetTier
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setSubTier(verifyData.subscription.tier);
              setSubStatus(verifyData.subscription.status);
              setBillingMessage(`✨ ${verifyData.msg}`);
            } else {
              setBillingMessage(`❌ Upgrading failed: ${verifyData.msg}`);
            }
          } catch (verifyErr) {
            setBillingMessage('❌ Payment verification connection failed.');
          } finally {
            setBillingLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#5c68ff'
        },
        modal: {
          ondismiss: () => {
            setBillingLoading(false);
            setBillingMessage('⚠️ Checkout cancelled by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setBillingMessage(`❌ Checkout initialization failed: ${err.message}`);
      setBillingLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#88889c] hover:text-[#ededef] mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>

        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Settings</h1>

        <div className="space-y-6">
          {/* User Profile Info */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-sm font-semibold mb-4 text-[#ededef] uppercase tracking-wider">Account Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6b6b80] block">Name</span>
                <span className="text-[#ededef] font-semibold mt-0.5 block">{user?.name}</span>
              </div>
              <div>
                <span className="text-[#6b6b80] block">Email Address</span>
                <span className="text-[#ededef] font-semibold mt-0.5 block">{user?.email}</span>
              </div>
              <div>
                <span className="text-[#6b6b80] block">Account Role</span>
                <span className="text-indigo-400 capitalize font-semibold mt-0.5 block">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Billing & Plans Gating */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4.5 h-4.5 text-[#5c68ff]" />
              <h2 className="text-sm font-semibold text-[#ededef] uppercase tracking-wider">Plan & Subscription Billing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-b border-white/[0.03] pb-6 mb-6 text-xs">
              <div>
                <span className="text-[#6b6b80] block">Current Plan Tier</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold uppercase tracking-wider mt-1.5">
                  {subTier} Tier
                </span>
                <span className="text-[10px] text-[#88889c] block mt-2">
                  Status: {subStatus === 'active' ? 'Active subscription (Paid)' : 'Free tier limitations'}
                </span>
              </div>

              <div>
                <span className="text-[#6b6b80] block">Workspace Rates Gating</span>
                <p className="text-[11px] text-[#88889c] mt-1.5 leading-relaxed">
                  Hourly limit: **{subTier === 'business' ? '5000' : subTier === 'pro' ? '1000' : '100'} requests**. <br />
                  Task backlog threshold: **{subTier === 'free' ? '50 tasks maximum' : 'Unlimited backlog active'}**.
                </p>
              </div>
            </div>

            {/* Plan selector simulator */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-[#555566] tracking-widest uppercase">Simulate Plan Checkout</span>
              <div className="flex flex-wrap gap-3">
                {subTier !== 'free' && (
                  <button
                    onClick={() => handleUpgrade('free')}
                    disabled={billingLoading}
                    className="bg-zinc-800 hover:bg-zinc-700 text-[#ededef] text-xs font-semibold rounded-xl px-4 py-2 transition-all disabled:opacity-50"
                  >
                    Downgrade to Free
                  </button>
                )}
                {subTier !== 'pro' && (
                  <button
                    onClick={() => handleUpgrade('pro')}
                    disabled={true}
                    className="bg-zinc-800/40 text-zinc-500 text-xs font-semibold rounded-xl px-4 py-2 cursor-not-allowed"
                  >
                    Upgrade Disabled
                  </button>
                )}
                {subTier !== 'business' && (
                  <button
                    onClick={() => handleUpgrade('business')}
                    disabled={true}
                    className="bg-zinc-800/40 text-zinc-500 text-xs font-semibold rounded-xl px-4 py-2 cursor-not-allowed"
                  >
                    Upgrade Disabled
                  </button>
                )}
              </div>
              {billingMessage && (
                <p className="text-xs text-indigo-400 font-semibold mt-2 bg-indigo-500/5 border border-indigo-500/10 p-2 rounded-xl">
                  {billingMessage}
                </p>
              )}
            </div>
          </div>

          {/* API Keys Panel */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-4.5 h-4.5 text-indigo-400" />
              <h2 className="text-sm font-semibold text-[#ededef] uppercase tracking-wider">API Keys (for MCP Integration)</h2>
            </div>
            <p className="text-xs text-[#88889c] mb-6 leading-relaxed">
              Generate secure API keys to integrate external AI assistants (like Claude Desktop or Cursor IDE) to manage and resolve tasks directly.
            </p>

            {/* Generated Key Alert */}
            {generatedKey && (
              <div className="mb-6 bg-[#1f1f2a] border border-[#5c68ff]/20 rounded-xl p-4 animate-slide-up space-y-4">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block mb-1">KEY CREATED SUCCESSFULLY</span>
                  <p className="text-[11px] text-[#88889c] mb-3">
                    Please copy this key now. For security reasons, you will not be able to view it again.
                  </p>
                  <div className="flex items-center gap-2 bg-[#08080a] border border-white/[0.05] rounded-xl p-2.5">
                    <code className="text-xs text-[#ededef] font-mono break-all flex-1">
                      {generatedKey.rawKey}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* MCP Config */}
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block mb-1">MCP CONFIGURATION</span>
                  <p className="text-[11px] text-[#88889c] mb-3">
                    Add this to your <code className="text-[#ededef]">claude_desktop_config.json</code> or MCP client settings.
                  </p>
                  <div className="relative bg-[#08080a] border border-white/[0.05] rounded-xl p-3">
                    <pre className="text-[11px] text-[#ededef] font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {JSON.stringify(mcpConfig, null, 2)}
                    </pre>
                    <button
                      onClick={copyConfig}
                      className="absolute top-2 right-2 p-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white transition-colors"
                      title="Copy config"
                    >
                      {copiedConfig ? <Check className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400 font-semibold">
                {error}
              </div>
            )}

            {/* Create API Key Form */}
            <form onSubmit={handleGenerateKey} className="flex gap-3 mb-8">
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key Name (e.g. Claude Desktop)"
                className="flex-1 bg-[#08080a] border border-white/[0.05] rounded-xl px-3.5 py-2 text-sm text-[#ededef] placeholder:text-[#444455] focus:outline-none focus:border-[#5c68ff] transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white hover:bg-[#e4e4e7] text-black rounded-xl px-4 py-2 font-semibold text-xs flex items-center gap-2 transition-all duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Generate Key
              </button>
            </form>

            {/* API Keys Table */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-[#555566] tracking-widest uppercase">Active Keys</h3>
              {keys.length === 0 ? (
                <p className="text-xs text-[#88889c] italic">No active API keys found.</p>
              ) : (
                <div className="divide-y divide-white/[0.03]">
                  {keys.map((keyDoc) => (
                    <div key={keyDoc._id} className="flex items-center justify-between py-3">
                      <div>
                        <span className="font-semibold text-xs text-[#ededef] block">{keyDoc.name}</span>
                        <div className="flex gap-2 text-[10px] text-[#6b6b80] mt-1 font-mono">
                          <span>Prefix: {keyDoc.keyPrefix}...</span>
                          <span>•</span>
                          <span>Last Used: {keyDoc.lastUsedAt ? new Date(keyDoc.lastUsedAt).toLocaleDateString() : 'Never'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeKey(keyDoc._id)}
                        className="p-1.5 text-[#555566] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Settings;
