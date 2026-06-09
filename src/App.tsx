import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './lib/firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AuthModal, UserDashboard } from './components/Auth.js';
import { DownloadModal } from './components/DownloadModal.js';
import { 
  SupportPage, 
  ContactPage, 
  TermsPage, 
  PrivacyPage, 
  RefundPage, 
  FeaturesPage, 
  SetupPage, 
  ChangelogPage, 
  BlogPage, 
  AffiliatesPage,
  StoriesPage
} from './components/LegalPages.js';

// Lazy Loaded Sections for Performance & Scaling
const LandingPage = lazy(() => import('./components/landing/LandingPage.js').then(m => ({ default: m.LandingPage })));
const Footer = lazy(() => import('./components/landing/sections/Footer.js'));
const SuccessPage = lazy(() => import('./pages/SuccessPage.js'));

// Constants
const PRICING_LINKS = {
  FREE: "/signup?plan=free",
  PRO_MONTHLY: "https://buy.polar.sh/polar_cl_lCKsnJoh89xuUvLHTCESHVYjmdbovHSx6ClaT0Wfmws",
  PRO_YEARLY: "https://buy.polar.sh/polar_cl_fw0ZOojWYLoURI6vrk9lsFRYvBM3AEyV1Aowk1rIYiI",
  PRO_LIFETIME: "https://buy.polar.sh/polar_cl_u2FqTTYUo6I3iTT6SrQeDkq6cJZRrded16pM93UQdvB"
};

const App = () => {
  const [user] = useAuthState(auth);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signup');

  const onInstall = () => {
    setIsDownloadModalOpen(true);
  };

  const onUpgrade = (planKey: keyof typeof PRICING_LINKS) => {
    const link = PRICING_LINKS[planKey];
    if (link) {
      window.open(link, '_blank');
    }
  };

  const PageModal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => (
    <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-12 border border-black/5 scrollbar-hide">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-black/5 rounded-full transition-colors text-black/20 hover:text-black">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
  );

  const renderActivePage = () => {
    switch (activePage) {
      case 'features': return <FeaturesPage />;
      case 'changelog': return <ChangelogPage />;
      case 'setup': return <SetupPage />;
      case 'stories': return <StoriesPage />;
      case 'blog': return <BlogPage />;
      case 'affiliates': return <AffiliatesPage />;
      case 'contact': return <ContactPage />;
      case 'support': return <SupportPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      case 'refund': return <RefundPage />;
      default: return null;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-bg-main selection:bg-black selection:text-white">
        <Suspense fallback={
          <div className="h-screen flex items-center justify-center bg-bg-main">
            <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<LandingPage user={user} onInstall={onInstall} onUpgrade={onUpgrade} onOpenPage={setActivePage} />} />
            <Route path="/dashboard" element={<UserDashboard onUpgrade={onUpgrade} onInstall={onInstall} />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
          <Footer onOpenPage={setActivePage} />
        </Suspense>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />

        <DownloadModal 
          isOpen={isDownloadModalOpen} 
          onClose={() => setIsDownloadModalOpen(false)} 
        />

        <PageModal isOpen={!!activePage} onClose={() => setActivePage(null)}>
          {renderActivePage()}
        </PageModal>
      </div>
    </Router>
  );
};

export default App;
