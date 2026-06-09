import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "It changed my entire workflow.",
      author: "Content Creator, 40k subscribers",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      quote: "The extension you didn't know you needed.",
      author: "NYT Bestselling Author, Business Coach",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      quote: "Saves us from an embarrassing data exposure risk we had no solution for.",
      author: "Agency Owner",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
      quote: "A simple idea that solves a real, daily problem.",
      author: "SaaS Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
    }
  ];

  return (
    <section id="stories" className="py-32 bg-bg-main overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-12 snap-x hide-scrollbar">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              className="min-w-[320px] md:min-w-[420px] bg-white p-12 rounded-[3.5rem] shadow-xl snap-center border border-border-dim"
            >
              <div className="mb-10 relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-black/5 ring-8 ring-black/5">
                  <img 
                    src={t.avatar} 
                    alt={t.author} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5 rounded-lg shadow-sm">
                  <Quote className="w-3 h-3" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-10 leading-tight italic text-text-primary">"{t.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="h-px bg-black/10 flex-grow" />
                <p className="text-text-secondary/40 font-black tracking-[0.2em] text-[10px] uppercase whitespace-nowrap">{t.author}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
