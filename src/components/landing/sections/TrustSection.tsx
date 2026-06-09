import React from 'react';
import { motion } from 'motion/react';
import { Mail, CreditCard, FileText, Database, PlayCircle, Video, Monitor, Users, Camera, Slack } from 'lucide-react';

const TrustSection = () => {
  const brands = [
    { name: 'Gmail', icon: <Mail className="w-5 h-5" /> },
    { name: 'Stripe', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'Notion', icon: <FileText className="w-5 h-5" /> },
    { name: 'Slack', icon: <Slack className="w-5 h-5" /> },
    { name: 'Airtable', icon: <Database className="w-5 h-5" /> },
    { name: 'Loom', icon: <PlayCircle className="w-5 h-5" /> },
    { name: 'Zoom', icon: <Video className="w-5 h-5" /> },
    { name: 'OBS', icon: <Monitor className="w-5 h-5" /> },
    { name: 'Teams', icon: <Users className="w-5 h-5" /> },
    { name: 'Meet', icon: <Camera className="w-5 h-5" /> }
  ];

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-white/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Blur once. Share anything.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 text-sm font-bold uppercase tracking-[0.3em] mb-12"
          >
            Used On:
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 h-full flex items-center justify-center transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10">
                <div className="flex items-center gap-3 relative z-10 transition-all duration-300 group-hover:scale-105">
                  <div className="text-white/40 group-hover:text-white transition-colors">
                    {brand.icon}
                  </div>
                  <span className="text-base md:text-lg font-bold tracking-tight text-white/40 group-hover:text-white transition-colors">
                    {brand.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
