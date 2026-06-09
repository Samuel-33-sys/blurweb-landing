import React, { lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { FeaturesPage } from '../LegalPages';

// Lazy load sections for better performance
const Navbar = lazy(() => import('./sections/Navbar'));
const Hero = lazy(() => import('./sections/Hero'));
const TrustSection = lazy(() => import('./sections/TrustSection'));
const InteractiveDemo = lazy(() => import('./sections/InteractiveDemo'));
const Pricing = lazy(() => import('./sections/Pricing'));
const Testimonials = lazy(() => import('./sections/Testimonials'));

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-bg-main">
    <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
  </div>
);

export const LandingPage = ({ user, onInstall, onUpgrade, onOpenPage }: { user: any, onInstall: () => void, onUpgrade: (plan: any) => void, onOpenPage: (page: string) => void }) => {
  return (
    <div className="bg-bg-main relative min-h-screen selection:bg-black selection:text-white">
      <Suspense fallback={<LoadingFallback />}>
        <Navbar user={user} onInstall={onInstall} onOpenPage={onOpenPage} />
        <Hero onInstall={onInstall} />
        <TrustSection />
        <div id="demo">
          <InteractiveDemo />
        </div>
        <div id="features">
           <Testimonials />
        </div>
        <div id="pricing">
          <Pricing onInstall={onInstall} onUpgrade={onUpgrade} user={user} />
        </div>
      </Suspense>
    </div>
  );
};
