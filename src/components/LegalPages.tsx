import React from 'react';
import { Shield, Mail, MessageSquare, FileText, Lock } from 'lucide-react';

const PageLayout = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
  <div>
    <div className="prose prose-invert max-w-none">
      {children}
    </div>
  </div>
);

export const SupportPage = () => (
  <PageLayout title="Support Center" icon={MessageSquare}>
    <h3 className="text-3xl font-bold mb-6 text-text-primary">How can we help?</h3>
    <p className="text-text-secondary text-lg mb-8">Our support team is available to help you with any technical issues or questions about your Blurra experience.</p>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="p-8 rounded-3xl bg-card-bg border border-border-dim">
        <h4 className="text-xl font-bold mb-3 text-text-primary">Technical Support</h4>
        <p className="text-text-secondary mb-6 leading-relaxed">Issues with the extension or blurring logic?</p>
        <a href="mailto:support@blurra.com" className="inline-block text-black font-bold border-b border-black/20 pb-0.5 hover:border-black transition-all">support@blurra.com</a>
      </div>
      <div className="p-8 rounded-3xl bg-card-bg border border-border-dim">
        <h4 className="text-xl font-bold mb-3 text-text-primary">Billing Inquiries</h4>
        <p className="text-text-secondary mb-6 leading-relaxed">Questions about your Pro subscription?</p>
        <a href="mailto:billing@blurra.com" className="inline-block text-black font-bold border-b border-black/20 pb-0.5 hover:border-black transition-all">billing@blurra.com</a>
      </div>
    </div>
  </PageLayout>
);

export const ContactPage = () => (
  <PageLayout title="Contact Us" icon={Mail}>
    <p className="text-text-secondary text-lg mb-12">We’d love to hear from you. Feature requests, partnerships, or just a simple hello.</p>
    <form className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black tracking-widest text-text-secondary/30 uppercase block">Name</label>
          <input type="text" className="w-full bg-card-bg rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all text-text-primary border border-border-dim" placeholder="Steve..." />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black tracking-widest text-text-secondary/30 uppercase block">Email</label>
          <input type="email" className="w-full bg-card-bg rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-accent-purple/50 transition-all text-text-primary border border-border-dim" placeholder="steve@apple.com" />
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-[10px] font-black tracking-widest text-text-secondary/30 uppercase block">Message</label>
        <textarea rows={4} className="w-full bg-card-bg rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 focus:ring-black/50 transition-all text-text-primary border border-border-dim" placeholder="What's on your mind?"></textarea>
      </div>
      <button type="button" className="bg-black text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-black/80 hover:scale-105 transition-all shadow-xl shadow-black/10">Send Message</button>
    </form>
  </PageLayout>
);

export const TermsPage = () => (
  <PageLayout title="Terms of Service" icon={FileText}>
    <div className="space-y-8">
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">1. Acceptance of Terms</h3>
        <p className="text-text-secondary leading-relaxed">By using Blurra, you agree to be bound by these terms. We keep it simple.</p>
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">2. License</h3>
        <p className="text-text-secondary leading-relaxed">We grant you a personal, non-exclusive license to use the Blurra extension for personal or professional use.</p>
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">3. Pro Subscription</h3>
        <p className="text-text-secondary leading-relaxed">Pro features are provided as a subscription. One license per human. Simple as that.</p>
      </section>
    </div>
  </PageLayout>
);

export const PrivacyPage = () => (
  <PageLayout title="Privacy Policy" icon={Lock}>
    <div className="space-y-8">
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">1. Data Collection</h3>
        <p className="text-text-secondary leading-relaxed">Blurra is designed with privacy as the core. We do not collect your browsing history. We do not track your clicks.</p>
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">2. Local Processing</h3>
        <p className="text-text-secondary leading-relaxed">Everything happens on your device. Your data stays in your browser. Always.</p>
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">3. Storage</h3>
        <p className="text-text-secondary leading-relaxed">We use Firebase to securely manage your account and subscription. That is the extent of it.</p>
      </section>
    </div>
  </PageLayout>
);

export const RefundPage = () => (
  <PageLayout title="Refund Policy" icon={Shield}>
    <div className="space-y-8">
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">5-Day No-Questions-Asked</h3>
        <p className="text-text-secondary leading-relaxed">If Blurra doesn't change your workflow in the first 5 days, we'll give you your money back. No interrogation, no awkward surveys. Just a full refund.</p>
      </section>
      <section>
        <h3 className="text-2xl font-bold mb-4 text-text-primary">How to Request</h3>
        <p className="text-text-secondary leading-relaxed">Email blurrabilling@gmail.com with your license key. We usually process refunds within 24 hours.</p>
      </section>
    </div>
  </PageLayout>
);

export const FeaturesPage = () => (
  <PageLayout title="Features" icon={Shield}>
    <div className="space-y-12 text-text-primary">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h4 className="text-xl font-bold mb-4">Element Blur</h4>
          <p className="text-text-secondary leading-relaxed">Hide entire images, cards, or video players instantly. The cleanest way to sanitize a dashboard.</p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Area Blur</h4>
          <p className="text-text-secondary leading-relaxed">Draw a rectangular boundary anywhere on the screen. Perfect for parts of the UI that don't have clear markers.</p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Text Masking</h4>
          <p className="text-text-secondary leading-relaxed">Precision control. Highlight any sentence or name within a paragraph to apply a targeted, unreadable blur.</p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export const SetupPage = () => (
  <PageLayout title="Setup Guide" icon={FileText}>
    <div className="space-y-8">
      <div className="bg-card-bg p-8 rounded-3xl border border-border-dim">
        <h4 className="text-xl font-bold mb-4 text-text-primary">1. Download</h4>
        <p className="text-text-secondary leading-relaxed">Download the extension ZIP file from the dashboard or landing page.</p>
      </div>
      <div className="bg-card-bg p-8 rounded-3xl border border-border-dim">
        <h4 className="text-xl font-bold mb-4 text-text-primary">2. Extract</h4>
        <p className="text-text-secondary leading-relaxed">Unzip the contents to a folder on your computer.</p>
      </div>
      <div className="bg-card-bg p-8 rounded-3xl border border-border-dim">
        <h4 className="text-xl font-bold mb-4 text-text-primary">3. Enable Dev Mode</h4>
        <p className="text-text-secondary leading-relaxed">Go to chrome://extensions and toggle "Developer mode" in the top right.</p>
      </div>
      <div className="bg-card-bg p-8 rounded-3xl border border-border-dim">
        <h4 className="text-xl font-bold mb-4 text-text-primary">4. Load Unpacked</h4>
        <p className="text-text-secondary leading-relaxed">Click "Load unpacked" and select the folder you extracted.</p>
      </div>
    </div>
  </PageLayout>
);

export const ChangelogPage = () => (
  <PageLayout title="Changelog" icon={MessageSquare}>
    <div className="space-y-12">
      <div className="border-l-2 border-border-dim pl-8 relative">
        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black rounded-full shadow-lg shadow-black/20" />
        <div className="text-xs font-black tracking-widest text-text-secondary/20 mb-2 uppercase">v1.2.0 — Today</div>
        <h4 className="text-xl font-bold mb-4 text-text-primary">The Performance Update</h4>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>Enhanced Text Alignment & Mask overlays</li>
          <li>Redesigned interactive browser-side demo</li>
          <li>Optimized blur performance by 40%</li>
        </ul>
      </div>
      <div className="border-l-2 border-border-dim pl-8 relative">
        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-card-bg border border-border-dim rounded-full" />
        <div className="text-xs font-black tracking-widest text-text-secondary/20 mb-2 uppercase">v1.1.0 — 2 weeks ago</div>
        <h4 className="text-xl font-bold mb-4 text-text-primary">Team Licenses</h4>
        <ul className="list-disc list-inside text-text-secondary space-y-2">
          <li>Multi-user license management</li>
          <li>Cloud sync for custom blur areas</li>
        </ul>
      </div>
    </div>
  </PageLayout>
);

export const BlogPage = () => (
  <PageLayout title="Blog" icon={FileText}>
    <div className="space-y-12">
      <div className="group cursor-pointer">
        <div className="bg-card-bg aspect-video rounded-3xl mb-6 overflow-hidden border border-border-dim">
          <img src="https://picsum.photos/seed/tech/800/450" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
        </div>
        <h4 className="text-2xl font-bold mb-4 text-text-primary">Why privacy is more than just cookies.</h4>
        <p className="text-text-secondary leading-relaxed">Unpacking the psychology of accidental data exposure in the age of remote work.</p>
      </div>
      <div className="group cursor-pointer">
        <div className="bg-card-bg aspect-video rounded-3xl mb-6 overflow-hidden border border-border-dim">
          <img src="https://picsum.photos/seed/setup/800/450" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
        </div>
        <h4 className="text-2xl font-bold mb-4 text-text-primary">Maximum productivity during live calls.</h4>
        <p className="text-text-secondary leading-relaxed">How top-performing teams handle sensitive information sharing.</p>
      </div>
    </div>
  </PageLayout>
);

export const AffiliatesPage = () => (
  <PageLayout title="Affiliates" icon={Shield}>
    <div className="space-y-8 text-center py-12">
      <h3 className="text-4xl font-black tracking-tight text-text-primary">Earn 20% commission on every sale.</h3>
      <p className="text-text-secondary text-xl max-w-xl mx-auto">Help people reclaim their privacy and get paid for it. Simple as that.</p>
      <button className="bg-black text-white px-12 py-5 rounded-full font-bold text-lg mt-8 hover:bg-black/80 transition-all shadow-lg shadow-black/10">Apply to join</button>
    </div>
  </PageLayout>
);

export const StoriesPage = () => (
  <PageLayout title="Success Stories" icon={MessageSquare}>
    <div className="space-y-12">
      <div className="p-8 rounded-[2rem] bg-card-bg border border-border-dim">
        <p className="text-xl font-bold italic mb-6 text-text-primary">"Blurra saved me from a major compliance headache during a client demo. I accidentally hit a tab with live financial data, but Blurra had it masked before the screen share even caught up."</p>
        <p className="text-xs font-black tracking-[0.2em] text-text-secondary/30 uppercase">— James W., Fintech Consultant</p>
      </div>
      <div className="p-8 rounded-[2rem] bg-card-bg border border-border-dim">
        <p className="text-xl font-bold italic mb-6 text-text-primary">"As a creator, I used to spend hours in post-production blurring out sensitive info. Now I just do it live while recording. It's cut my editing time in half."</p>
        <p className="text-xs font-black tracking-[0.2em] text-text-secondary/30 uppercase">— Sarah L., Tech Educator</p>
      </div>
    </div>
  </PageLayout>
);
