import React from 'react';
import { Shield, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const Footer = ({ onOpenPage }: { onOpenPage: (page: string) => void }) => {
  return (
    <footer className="px-6 pb-12 bg-bg-main">
      <div className="bg-black text-white rounded-[4rem] py-24 px-6 lg:px-24 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-16 md:gap-24 mb-24">
          <div className="col-span-1 md:col-span-1 p-0">
            <div className="flex items-center gap-3 mb-10 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:rotate-6">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black tracking-tighter">Blurra</span>
            </div>
            <p className="text-white/40 text-lg font-medium leading-relaxed mb-10 max-w-xs">
              The world's most intuitive privacy shield for video and screen sharing. Built for those who share.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-white/20 hover:text-white transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="text-white/20 hover:text-white transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="#" className="text-white/20 hover:text-white transition-colors"><Github className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div className="pt-2">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-12 text-white/40">Product</h4>
            <ul className="space-y-6 text-white text-base">
              <li><button onClick={() => onOpenPage('features')} className="hover:opacity-60 transition-opacity font-bold">Features</button></li>
              <li><button onClick={() => onOpenPage('changelog')} className="hover:opacity-60 transition-opacity font-bold">Changelog</button></li>
              <li><button onClick={() => onOpenPage('setup')} className="hover:opacity-60 transition-opacity font-bold">Setup Guide</button></li>
              <li><button onClick={() => onOpenPage('stories')} className="hover:opacity-60 transition-opacity font-bold">Stories</button></li>
            </ul>
          </div>
          
          <div className="pt-2">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-12 text-white/40">Company</h4>
            <ul className="space-y-6 text-white text-base">
              <li><button onClick={() => onOpenPage('blog')} className="hover:opacity-60 transition-opacity font-bold">Blog</button></li>
              <li><button onClick={() => onOpenPage('affiliates')} className="hover:opacity-60 transition-opacity font-bold">Affiliates</button></li>
              <li><button onClick={() => onOpenPage('contact')} className="hover:opacity-60 transition-opacity font-bold">Contact</button></li>
              <li><button onClick={() => onOpenPage('support')} className="hover:opacity-60 transition-opacity font-bold italic">Support</button></li>
            </ul>
          </div>
          
          <div className="pt-2">
            <h4 className="text-xs font-black tracking-[0.2em] uppercase mb-12 text-white/40">Legal</h4>
            <ul className="space-y-6 text-white text-base">
              <li><button onClick={() => onOpenPage('privacy')} className="hover:opacity-60 transition-opacity font-bold">Privacy Policy</button></li>
              <li><button onClick={() => onOpenPage('terms')} className="hover:opacity-60 transition-opacity font-bold">Terms of Service</button></li>
              <li><button onClick={() => onOpenPage('refund')} className="hover:opacity-60 transition-opacity font-bold">Refund Policy</button></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-sm font-black tracking-widest uppercase">© 2026 Blurweb Limited. Made with ❤️ for your privacy.</p>
          <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full">
            <MessageSquare className="w-4 h-4 text-white/40" />
            <span className="text-xs font-black tracking-widest uppercase text-white/40">Status: All Systems Operational</span>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
