import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

// This would typically be in a constants file
const PRICING_LINKS = {
  FREE: "/signup?plan=free",
  PRO_MONTHLY: "https://buy.polar.sh/polar_cl_lCKsnJoh89xuUvLHTCESHVYjmdbovHSx6ClaT0Wfmws",
  PRO_YEARLY: "https://buy.polar.sh/polar_cl_fw0ZOojWYLoURI6vrk9lsFRYvBM3AEyV1Aowk1rIYiI",
  PRO_LIFETIME: "https://buy.polar.sh/polar_cl_u2FqTTYUo6I3iTT6SrQeDkq6cJZRrded16pM93UQdvB"
};

const YearlyModal = ({ isOpen, onClose, onUpgrade }: { isOpen: boolean, onClose: () => void, onUpgrade: (plan: keyof typeof PRICING_LINKS) => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[3rem] p-12 max-w-2xl w-full text-black shadow-2xl border border-black/10"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Pro Lifetime</h2>
              <p className="text-black/50 font-medium italic">Become a founding member. Never pay again.</p>
            </div>
            
            <div className="p-8 bg-card-bg rounded-3xl border border-border-dim mb-12">
              <div className="flex items-end gap-3 justify-center mb-6">
                <div className="text-7xl font-black tracking-tighter">$50</div>
                <div className="text-sm font-bold text-black/40 mb-3 lowercase tracking-widest italic">once. forever.</div>
              </div>
              <ul className="grid grid-cols-1 gap-4 text-sm font-medium text-black/60">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-black/20" /> Everything in Pro Yearly</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-black/20" /> Lifetime product updates</li>
              </ul>
            </div>
            
            <button 
              onClick={() => onUpgrade('PRO_LIFETIME')}
              className="w-full py-5 rounded-full font-bold bg-black text-white hover:bg-black/90 transition-all text-xl"
            >
              Get lifetime access
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Pricing = ({ onInstall, onUpgrade, user }: { onInstall: () => void, onUpgrade: (planKey: keyof typeof PRICING_LINKS) => void, user: any }) => {
  const [isYearlyModalOpen, setIsYearlyModalOpen] = useState(false);

  return (
    <section id="pricing" className="py-32 bg-bg-main text-text-primary">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Simple, affordable pricing.</h1>
          <p className="text-text-secondary text-xl font-medium mb-12">Start free. Upgrade when you need more.</p>
          
          <div className="inline-flex items-center p-1.5 bg-black rounded-full mb-8">
            <button 
              onClick={() => setIsYearlyModalOpen(false)}
              className="px-8 py-2 rounded-full text-sm font-bold bg-[#12101D] text-white transition-all shadow-lg"
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearlyModalOpen(true)}
              className="px-8 py-2 rounded-full text-sm font-bold text-text-secondary/60 hover:text-white transition-all"
            >
              Lifetime
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Card 1 - Free */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-[3rem] bg-white border border-border-dim text-black flex flex-col"
          >
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-6xl font-black tracking-tighter mb-1">$0</div>
              <div className="text-sm font-medium text-black/40">forever</div>
            </div>
            
            <div className="h-px bg-black/5 w-full mb-8" />

            <ul className="space-y-4 flex-grow mb-10">
              {[
                "5 blurs per day",
                "Manual click-to-blur",
                "Chrome & Firefox",
                "Basic Keep Blur",
                "Community support"
              ].map(f => (
                <li key={f} className="flex items-center gap-3 font-medium text-black/60">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-black/40" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onInstall()}
              className="w-full py-4 rounded-full font-bold transition-all text-center border-2 border-black text-black hover:bg-black/5"
            >
              Get started free
            </button>
          </motion.div>

          {/* Card 2 - Pro */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-[3rem] bg-white border border-border-dim text-black flex flex-col relative shadow-2xl shadow-black/5"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
              Most Popular
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2 text-black">Pro</h3>
              <div className="text-6xl font-black tracking-tighter mb-1">$4<span className="text-xl font-medium opacity-40">/month</span></div>
               
              <button 
                onClick={() => setIsYearlyModalOpen(true)}
                className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full hover:bg-black/80 transition-all"
              >
                Life-time available
              </button>
            </div>

            <div className="h-px bg-black/5 w-full mb-8" />

            <ul className="space-y-4 flex-grow mb-10">
              {[
                "Unlimited blurs",
                "Blur Area (draw zones)",
                "Keep Blur across sessions",
                "All browsers & tools",
                "Priority support",
                "Early feature access"
              ].map(f => (
                <li key={f} className="flex items-center gap-3 font-medium text-black/50">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-black" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onUpgrade('PRO_MONTHLY')}
              className="w-full py-4 rounded-full font-bold transition-all text-center bg-black text-white hover:bg-black/90"
            >
              Upgrade
            </button>
          </motion.div>

          {/* Card 3 - Pro (Yearly) */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="p-10 rounded-[3rem] bg-white border border-border-dim text-black flex flex-col relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-md">
              Best Value
            </div>

            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-2 text-black">Pro (Yearly)</h3>
              <div className="text-6xl font-black tracking-tighter mb-1">$38.4<span className="text-xl font-medium opacity-40">/year</span></div>
              <div className="text-sm font-medium text-black/40 mb-2">Yearly -20%</div>
              <div className="text-sm font-medium text-black/40">billed annually</div>
            </div>

            <div className="h-px bg-black/5 w-full mb-8" />

            <ul className="space-y-4 flex-grow mb-10">
              {[
                "Everything in Pro",
                "Lifetime updates",
                 
      
                "5-day refund guarantee",
                 
              ].map(f => (
                <li key={f} className="flex items-center gap-3 font-medium text-black/60">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-black/40" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onUpgrade('PRO_YEARLY')}
              className="w-full py-4 rounded-full font-bold transition-all text-center border-2 border-black text-black hover:bg-black/5"
            >
              Upgrade
            </button>
          </motion.div>
        </div>

        <div className="mt-24 text-center max-w-2xl mx-auto text-text-secondary font-medium">
          All plans. All browsers. Every recording tool on the planet. GDPR compliant. Zero data stored. Five-day refund — no interrogation.
        </div>
      </div>

      <YearlyModal 
        isOpen={isYearlyModalOpen} 
        onClose={() => setIsYearlyModalOpen(false)} 
        onUpgrade={onUpgrade}
      />
    </section>
  );
};

export default Pricing;
