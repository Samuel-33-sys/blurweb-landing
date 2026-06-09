import React from 'react';
import { motion } from 'motion/react';
import { Shield, Monitor } from 'lucide-react';

const Navbar = ({ user, onInstall, onOpenPage }: { user: any, onInstall: () => void, onOpenPage: (page: string) => void }) => {
  const getInitials = (user: any) => {
    if (user.displayName) {
      return user.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-black/5 px-6 py-4 rounded-[2rem] shadow-2xl shadow-black/5 pointer-events-auto">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
            <Shield className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Blurra</span>
        </div>

        <div className="hidden md:flex items-center gap-12 text-sm font-bold text-text-secondary/60 transition-all uppercase tracking-widest text-[10px]">
          <button onClick={() => onOpenPage('privacy')} className="hover:text-text-primary transition-colors">Privacy</button>
          <a href="#demo" className="hover:text-text-primary transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          <button onClick={() => onOpenPage('stories')} className="hover:text-text-primary transition-colors">Stories</button>
        </div>

        <div className="flex items-center gap-8">
          {user ? (
            <button 
              onClick={() => window.open('/extension-beta.zip', '_blank')}
              className="flex items-center gap-4 group"
            >
              <span className="text-sm font-bold text-text-primary border-b-2 border-black/10 group-hover:border-black transition-all px-1 pb-1 hidden sm:block uppercase tracking-tight">
                Get extension beta
              </span>
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-sm font-black shadow-lg group-hover:scale-105 transition-all">
                {getInitials(user)}
              </div>
            </button>
          ) : (
            <>
              <button 
                onClick={() => window.open('/extension-beta.zip', '_blank')}
                className="text-sm font-bold text-text-primary border-b-2 border-black/10 hover:border-black transition-all px-1 pb-1 font-sans uppercase tracking-tight"
              >
                Get extension beta
              </button>
              <button 
                onClick={onInstall}
                className="bg-black text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl hover:bg-black/90 active:scale-95 transition-all"
              >
                Try it free
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
