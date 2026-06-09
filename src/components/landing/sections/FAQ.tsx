import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does it see what I blur?",
      a: "No. It knows where the blur is. Not what's under it."
    },
    {
      q: "Which browsers?",
      a: "Chrome. Firefox. Edge. Safari. Opera. Brave. Vivaldi. If it loads a webpage, it works."
    },
    {
      q: "Does the blur survive a page reload?",
      a: "Enable Keep Blur before you start. Then yes — forever, for that URL."
    },
    {
      q: "What about my desktop or URL bar?",
      a: "This extension lives on the page. For everything else, you'd need a separate screen-level tool."
    },
    {
      q: "Free trial?",
      a: "Install free. Blur immediately. Upgrade when you're ready."
    },
    {
      q: "Refund?",
      a: "Five days. No questions."
    }
  ];

  return (
    <section id="faq" className="py-32 bg-bg-main text-text-primary">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-24">Details matter.</h2>
        <div className="space-y-12">
          {faqs.map((faq, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{faq.q}</h3>
                <ChevronDown className={`w-6 h-6 transition-transform duration-500 text-text-secondary ${openIndex === i ? 'rotate-180 text-accent-purple' : ''}`} />
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-text-secondary text-lg font-medium leading-relaxed pb-6">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="h-px bg-white/5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
