import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe, Laptop, Monitor, Smartphone } from 'lucide-react';

const Hero = ({ onInstall }: { onInstall: () => void }) => {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden bg-bg-main">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="live-dot" />
              <span className="text-sm md:text-lg font-bold text-text-primary italic">
                1000+ professionals trust Blurra · Zoom · Loom · Meet · OBS · Zero data stored
              </span>
            </div>
            <h1 className="text-6xl md:text-[120px] font-bold tracking-tight leading-none mb-8 text-text-primary">
              Privacy<span className="-ml-[0.1em]">.</span><br />In one click.
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              That is the whole idea. Everything else is details. <br />
              <span className="text-text-primary italic serif opacity-80">Hover. Click. Hidden. Works everywhere you share.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                id="hero-btn"
                onClick={onInstall}
                className="bg-black text-white px-10 py-5 rounded-full text-lg font-bold transition-all hover:bg-black/90 hover:scale-105 active:scale-95 shadow-2xl shadow-black/10"
              >
                Try it free
              </button>
              <a 
                id="hero-secondary"
                href="#demo"
                className="text-lg font-bold text-text-secondary hover:text-text-primary transition-all flex items-center gap-2 group border border-border-dim px-8 py-5 rounded-full"
              >
                See it in 60 seconds <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500 items-center">
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Globe className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">WEB</span></div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Laptop className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">macOS</span></div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Monitor className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">WINDOWS</span></div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Monitor className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">LINUX</span></div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Smartphone className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">iOS</span></div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 border border-border-dim rounded-2xl"><Smartphone className="w-5 h-5 md:w-6 md:h-6 text-black"/><span className="text-[8px] md:text-[10px] font-black tracking-widest text-text-secondary">ANDROID</span></div>
              </div>
              <p className="text-[10px] font-black tracking-[0.3em] text-text-secondary/30 uppercase">Available across all your devices and browsers</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-purple/20 rounded-full blur-[120px] pointer-events-none -z-0" />
    </section>
  );
};

export default Hero;
