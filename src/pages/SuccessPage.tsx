import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const SuccessPage = () => {
  const [sessionData, setSessionData] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order_id') || params.get('checkout_id');

    if (orderId) {
      fetch(`/api/success-session?order_id=${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.email) setSessionData(data);
          else setError(data.error || "Loading failed");
        })
        .catch(() => setError("Failed to fetch session details"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("No order ID found.");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-bg-main text-text-primary flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-card-bg rounded-[3rem] p-12 text-center shadow-xl border border-border-dim"
      >
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-black/10">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-text-secondary mb-12 font-medium">Welcome to Blurra Pro. Your account is now active.</p>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-white/5 rounded-2xl w-full" />
            <div className="h-4 bg-white/5 rounded w-2/3 mx-auto" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 text-red-500 rounded-2xl font-bold mb-8 border border-red-500/20">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-bg-main p-8 rounded-3xl border border-border-dim shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary/40 block mb-4">Subscription Active</span>
              <div className="text-2xl font-bold tracking-tight text-black mb-6">
                Pro Activated
              </div>
              <p className="text-sm text-text-secondary mb-6 text-left">
                Simply open the extension and enter the email you used for payment to start blurring.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 mx-auto hover:bg-black/90 transition-all font-sans"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessPage;
