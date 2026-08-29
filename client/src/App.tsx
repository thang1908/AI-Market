import React from 'react';
import { AppProvider, useAppState } from './state/useAppState';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SavedModal } from './features/saved/SavedModal';
import { AIPage } from './features/ai/AIPage';
import { MarketPage } from './features/market/MarketPage';
import { SocialPage } from './features/social/SocialPage';
import { AIGuide } from './features/ai/AIGuide';
import { ContactSaleModal } from './features/market/ContactSaleModal';
import { AIEvaluationModal } from './features/market/AIEvaluationModal';
import { AIComparisonModal } from './features/market/AIComparisonModal';

const MainLayout: React.FC = () => {
  const { activeTab, isChatTabActive } = useAppState();

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global App Header */}
      <Header />

      {/* 2. Main Tab Contents (State preserved seamlessly) */}
      <main className={`flex-1 ${isChatTabActive && activeTab === 'ai' ? 'pt-0' : 'pt-4'}`}>
        {activeTab === 'ai' && <AIPage />}
        {activeTab === 'market' && <MarketPage />}
        {activeTab === 'social' && <SocialPage />}
      </main>

      {/* 3. AI Guide Panel Modal */}
      <AIGuide />

      {/* 4. Saved Properties Modal */}
      <SavedModal />

      {/* 5. Contact Sale Modal */}
      <ContactSaleModal />

      {/* 6. AI Single Property Evaluation Modal */}
      <AIEvaluationModal />

      {/* 7. AI Multi Property Comparison Modal */}
      <AIComparisonModal />

      {/* 8. Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
