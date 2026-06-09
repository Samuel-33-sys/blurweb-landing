import React from 'react';
import { motion } from 'motion/react';
import { Globe, Laptop, Monitor, Smartphone } from 'lucide-react';

const PlatformGallery = () => {
  const platforms = [
    { icon: <Globe className="w-8 h-8" />, name: "Web Extension", desc: "Chrome, Safari, Firefox, Edge" },
    { icon: <Laptop className="w-8 h-8" />, name: "macOS", desc: "Native desktop support" },
    { icon: <Monitor className="w-8 h-8" />, name: "Windows", desc: "Enterprise readiness" },
    { icon: <Smartphone className="w-8 h-8" />, name: "iOS & Android", desc: "Mobile browser privacy" }
  ];

  return (
    <section className="py-32 bg-card-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary">Every screen. Protected.</h2>
          <p className="text-text-secondary text-xl font-medium">Blurra works wherever you do.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platforms.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-bg-main rounded-[2.5rem] border border-border-dim hover:border-accent-purple/30 hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-6 shadow-lg shadow-black/10">
                {p.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-text-primary">{p.name}</h3>
              <p className="text-text-secondary font-medium leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformGallery;
