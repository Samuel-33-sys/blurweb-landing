import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Chrome, Download, Shield, Laptop, Monitor } from 'lucide-react';

export const DownloadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const browsers = [
    { name: 'Chrome / Brave', icon: <Chrome className="w-6 h-6" />, link: 'https://chromewebstore.google.com/detail/blurweb-privacy-shield/placeholder', status: 'Available' },
    { name: 'Edge', icon: <Monitor className="w-6 h-6 text-blue-500" />, link: 'https://chromewebstore.google.com/detail/blurweb-privacy-shield/placeholder', status: 'Available' },
    { name: 'Opera', icon: <Monitor className="w-6 h-6 text-red-600" />, link: 'https://chromewebstore.google.com/detail/blurweb-privacy-shield/placeholder', status: 'Available' },
    { name: 'Vivaldi', icon: <Monitor className="w-6 h-6 text-red-500" />, link: 'https://chromewebstore.google.com/detail/blurweb-privacy-shield/placeholder', status: 'Available' },
    { name: 'Firefox', icon: <Monitor className="w-6 h-6 text-orange-500" />, link: 'https://addons.mozilla.org/en-US/firefox/addon/blurra-privacy-shield/', status: 'Available' },
    { name: 'Safari', icon: <Monitor className="w-6 h-6 text-blue-400" />, link: 'https://apps.apple.com/app/blurra-privacy-shield/', status: 'Available' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden text-black border border-black/5"
          >
            <div className="p-8 md:p-12">
              <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-black/5 rounded-full transition-colors text-black/20 hover:text-black">
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transition-transform hover:rotate-6 cursor-pointer">
                  <Shield className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight mb-2">Get the Shield.</h3>
                <p className="text-black/40 text-base font-medium italic mb-4">Privacy in one click. No data stored. Ever.</p>
                
                <button 
                  onClick={() => window.open('/extension-beta.zip', '_blank')}
                  className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-sm font-bold shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mb-8 group"
                >
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download extension Beta (.zip)
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-black/20">
                  <span>macOS</span>
                  <div className="w-1 h-1 bg-black/10 rounded-full" />
                  <span>Windows</span>
                  <div className="w-1 h-1 bg-black/10 rounded-full" />
                  <span>Linux</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pb-2">
                {browsers.map((browser) => (
                  <div 
                    key={browser.name}
                    className={`flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all ${
                      browser.status === 'Available' 
                        ? 'bg-black text-white border-transparent shadow-lg shadow-black/20' 
                        : 'bg-black/5 border-black/5 opacity-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${
                      browser.status === 'Available' ? 'bg-white/10 text-white' : 'bg-black/5 text-black/20'
                    }`}>
                      {browser.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold">{browser.name}</div>
                      <div className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                        browser.status === 'Available' ? 'text-white/40' : 'text-black/20'
                      }`}>{browser.status}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Supports all Chromium Browsers</p>
              </div>

              <div className="mt-10 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-black/40">
                  <Monitor className="w-5 h-5 border border-black/10 rounded p-1" />
                  <span className="text-xs font-bold tracking-wider">Syncs across all sessions</span>
                </div>
                <div className="text-xs font-black tracking-widest text-black/20 uppercase">
                  Version 2.4.0 · Updated May 2026
                </div>
              </div>
            </div>

            <div className="bg-black/5 p-6 text-center">
              <p className="text-sm font-bold text-black/40">
                Already have it? <button onClick={onClose} className="text-black hover:underline px-2">Log in to your account</button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
