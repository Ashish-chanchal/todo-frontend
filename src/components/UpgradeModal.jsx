import React, { useState } from 'react';
import { X, Check, CreditCard, Sparkles, Zap, ShieldCheck } from 'lucide-react';

function UpgradeModal({ isOpen, onClose, token, user, onUpgradeSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

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

  const handleUpgrade = async (targetTier) => {
    setLoading(true);
    setMessage('');
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage('❌ Failed to load Razorpay SDK. Check your network.');
        setLoading(false);
        return;
      }

      const keyRes = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/billing/razorpay/key`);
      if (!keyRes.ok) {
        const keyData = await keyRes.json();
        throw new Error(keyData.msg || 'Failed to fetch Razorpay public key');
      }
      const { keyId } = await keyRes.json();

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

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TodoAI Workspace',
        description: `Upgrade workspace to ${targetTier.toUpperCase()} subscription`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setLoading(true);
            setMessage('⏳ Verifying payment signature...');
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
              setMessage(`✨ ${verifyData.msg}`);
              if (onUpgradeSuccess) {
                onUpgradeSuccess(verifyData.subscription);
              }
              setTimeout(() => {
                onClose();
              }, 1500);
            } else {
              setMessage(`❌ Upgrading failed: ${verifyData.msg}`);
            }
          } catch (verifyErr) {
            setMessage('❌ Payment verification connection failed.');
          } finally {
            setLoading(false);
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
            setLoading(false);
            setMessage('⚠️ Checkout cancelled.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setMessage(`❌ Checkout initialization failed: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-[#0c0c10]/90 border border-white/[0.08] rounded-2xl p-6 shadow-2xl overflow-hidden animate-slide-up">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#5c68ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#ff5c8a]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-400 font-semibold mb-3">
            <Sparkles className="w-3 h-3 animate-pulse" /> PREMIUM ACCESS REQUIRED
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Upgrade Your Plan</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
            You reached the limits of the Free tier. Unlock advanced productivity features instantly.
          </p>
        </div>

        {/* Messaging area */}
        {message && (
          <div className={`mb-4 text-xs text-center font-semibold p-2.5 rounded-xl border ${message.includes('✨') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Grid pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pro tier */}
          <div className="bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 rounded-xl p-5 relative transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-zinc-400 font-mono">WORKSPACE</span>
                <h3 className="text-base font-bold text-white mt-0.5">Pro Tier</h3>
              </div>
              <span className="text-lg font-bold text-white">Rs 500<span className="text-xs text-zinc-500 font-normal">/mo</span></span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Perfect for power users working directly with AI.</p>
            <ul className="space-y-2 mb-6 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Unlimited tasks creation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Standard MCP server tools
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Natural Language parsing
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('pro')}
              disabled={true}
              className="w-full py-2 bg-indigo-600/30 text-zinc-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" /> Upgrade Disabled
            </button>
          </div>

          {/* Business tier */}
          <div className="bg-gradient-to-b from-indigo-500/[0.05] to-transparent border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl p-5 relative transition-all duration-200">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-500 text-[9px] text-white font-mono font-bold uppercase tracking-wider">
              BEST VALUE
            </div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-indigo-400 font-semibold font-mono">AUTOMATED</span>
                <h3 className="text-base font-bold text-white mt-0.5">Business Tier</h3>
              </div>
              <span className="text-lg font-bold text-white">Rs 1500<span className="text-xs text-zinc-500 font-normal">/mo</span></span>
            </div>
            <p className="text-xs text-zinc-400 mb-4">Complete cross-tool AI orchestration and limits expansion.</p>
            <ul className="space-y-2 mb-6 text-xs text-zinc-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Standard features of Pro
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> Cross-tool Slack/Email orchestration
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-indigo-400" /> High capacity rate limits (5k/hr)
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('business')}
              disabled={true}
              className="w-full py-2 bg-indigo-600/30 text-zinc-500 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Upgrade Disabled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
