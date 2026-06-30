import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BottomNav from './components/BottomNav';
import ProjectList from './components/ProjectList';
import StockList from './components/StockList';
import StockDetail from './components/StockDetail';
import CasinoList from './components/CasinoList';
import Profile from './components/Profile';
import UserChat from './components/UserChat';
import VinfastView from './components/VinfastView';
import WelfareConsultationView from './components/WelfareConsultationView';
import HomeView from './components/HomeView';
import { Stock } from './types';
import { useImage } from './components/ImageContext';
import { Settings2, X } from 'lucide-react';
import EditableImage from './components/EditableImage';
import { seedDatabase } from './firebase';
import AuthScreen from './components/AuthScreen';
import { useUser } from './components/UserContext';
import NewsDetailView from './components/NewsDetailView';
import InvestmentReasonsView from './components/InvestmentReasonsView';
import WelfareResortView from './components/WelfareResortView';
import WelfareEducationView from './components/WelfareEducationView';
import WelfareMedicalView from './components/WelfareMedicalView';
import WelfareShoppingView from './components/WelfareShoppingView';
import WelfareVinhomesView from './components/WelfareVinhomesView';
import VinpearlProjectsView from './components/VinpearlProjectsView';
import VinpearlProjectDetailView from './components/VinpearlProjectDetailView';
import VinpearlInvestView from './components/VinpearlInvestView';
import CardRankingView from './components/CardRankingView';
import AllNewsView from './components/AllNewsView';
import AdminDashboard from './components/AdminDashboard';
import { usePresence } from './hooks/usePresence';

export type ViewState = 'home' | 'projects' | 'stockList' | 'stockDetail' | 'casino' | 'profile' | 'cskh' | 'vinfast' | 'welfare_consultation' | 'news_detail' | 'investment_reasons' | 'welfare_resort' | 'welfare_education' | 'welfare_medical' | 'welfare_shopping' | 'welfare_vinhomes' | 'vinpearl_projects' | 'vinpearl_project_detail' | 'vinpearl_invest' | 'all_news' | 'cardRanking';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { isEditMode, setIsEditMode } = useImage();
  const { isLoggedIn, getAdjustedStocks, role } = useUser();

  // Call hook to track user presence (online/offline) in RTDB
  usePresence();

  // Interactive modal states
  const [profileSubView, setProfileSubView] = useState<string | null>(null);

  useEffect(() => {
    // Run seeding in background so it never blocks the user from entering the app
    seedDatabase();
  }, []);

  if (!isLoggedIn) {
    return (
      <div id="unauthenticated-app-container" className="min-h-screen bg-[#050505] text-zinc-800 font-sans flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[85vh] md:max-h-[92vh] md:rounded-2xl relative shadow-2xl flex flex-col overflow-hidden border border-zinc-800/10">
          <AuthScreen />
        </div>
      </div>
    );
  }

  // Redirect admin users to the Admin Dashboard
  const isAdminRole = role === 'admin' || role === 'super_admin' || role === 'support_admin' || role === 'finance_admin';
  if (isAdminRole) {
    return (
      <AdminDashboard />
    );
  }

  const handleNavigateToStock = (stock: Stock) => {
    setSelectedStock(stock);
    setCurrentView('stockDetail');
  };



  return (
    <EditableImage
      imageKey="app-background"
      defaultSrc=""
      className="min-h-screen bg-[#0c0000] text-white font-sans selection:bg-[#c29b57] selection:text-black"
      isBackground={true}
      overlayClassName="absolute top-4 left-4 z-[99] w-24 h-24 rounded-2xl bg-[#c29b57]/90 text-black flex flex-col items-center justify-center cursor-pointer hover:bg-[#c29b57] transition-all shadow-2xl border-2 border-[#ebd5ad] backdrop-blur-md hover:scale-105"
    >
      {/* Mobile container constraint */}
      <div className="w-full max-w-md mx-auto bg-[#0f0f0f]/90 h-screen md:h-[92vh] md:my-[4vh] md:rounded-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col border border-zinc-800/30 overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col overflow-hidden relative w-full h-full"
          >
            {currentView === 'home' ? (
              <HomeView
                onNavigate={(view, subView) => {
                  setProfileSubView(subView || null);
                  setCurrentView(view);
                }}
              />
            ) : currentView === 'projects' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#0b0b0b]">
                <ProjectList onBack={() => setCurrentView('home')} />
              </div>
            ) : currentView === 'stockList' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#121212]">
                <StockList 
                  onBack={() => setCurrentView('home')} 
                  onSelectStock={handleNavigateToStock} 
                />
              </div>
            ) : currentView === 'stockDetail' && selectedStock ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#121212]">
                <StockDetail 
                  stock={getAdjustedStocks([selectedStock])[0]} 
                  onBack={() => setCurrentView('stockList')} 
                  onHome={() => setCurrentView('home')}
                />
              </div>
            ) : currentView === 'casino' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#0b0b0b]">
                <CasinoList onBack={() => setCurrentView('home')} />
              </div>
            ) : currentView === 'profile' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#0d0d0d]">
                <Profile 
                  onBack={() => setCurrentView('home')} 
                  onHome={() => setCurrentView('home')} 
                  initialSubView={profileSubView} 
                  onNavigate={(v) => setCurrentView(v as ViewState)}
                />
              </div>
            ) : currentView === 'cskh' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <UserChat />
              </div>
            ) : currentView === 'vinfast' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#0b0b0b]">
                <VinfastView onBack={() => setCurrentView('home')} />
              </div>
            ) : currentView === 'welfare_consultation' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#050505]">
                <WelfareConsultationView onBack={() => setCurrentView('home')} onNavigate={(v) => setCurrentView(v as ViewState)} />
              </div>
            ) : currentView === 'welfare_resort' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <WelfareResortView onBack={() => setCurrentView('welfare_consultation')} />
              </div>
            ) : currentView === 'welfare_education' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <WelfareEducationView onBack={() => setCurrentView('welfare_consultation')} />
              </div>
            ) : currentView === 'welfare_medical' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <WelfareMedicalView onBack={() => setCurrentView('welfare_consultation')} />
              </div>
            ) : currentView === 'welfare_shopping' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <WelfareShoppingView onBack={() => setCurrentView('welfare_consultation')} />
              </div>
            ) : currentView === 'welfare_vinhomes' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <WelfareVinhomesView onBack={() => setCurrentView('home')} />
              </div>
            ) : currentView === 'vinpearl_projects' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <VinpearlProjectsView 
                  onBack={() => setCurrentView('home')} 
                  onSelectProject={(projectId) => {
                    setProfileSubView(projectId);
                    setCurrentView('vinpearl_project_detail');
                  }}
                  onNavigate={setCurrentView} 
                  onNavigateToDeposit={() => {
                    setProfileSubView('deposit');
                    setCurrentView('profile');
                  }}
                />
              </div>
            ) : currentView === 'vinpearl_project_detail' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <VinpearlProjectDetailView 
                  projectId={profileSubView}
                  onBack={() => setCurrentView('vinpearl_projects')} 
                  onInvest={() => setCurrentView('vinpearl_invest')} 
                  onNavigateToDeposit={() => {
                    setProfileSubView('deposit');
                    setCurrentView('profile');
                  }}
                />
              </div>
            ) : currentView === 'vinpearl_invest' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <VinpearlInvestView 
                  projectId={profileSubView} 
                  onBack={() => setCurrentView('vinpearl_project_detail')} 
                  onNavigateToDeposit={() => {
                    setProfileSubView('deposit');
                    setCurrentView('profile');
                  }}
                />
              </div>
            ) : currentView === 'news_detail' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
                <NewsDetailView onBack={() => setCurrentView('home')} newsId={profileSubView} />
              </div>
            ) : currentView === 'investment_reasons' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <InvestmentReasonsView onBack={() => setCurrentView('home')} />
              </div>
            ) : currentView === 'all_news' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <AllNewsView 
                  onBack={() => setCurrentView('home')} 
                  onNavigateNews={(id) => {
                    setProfileSubView(id);
                    setCurrentView('news_detail');
                  }}
                />
              </div>
            ) : currentView === 'cardRanking' ? (
              <div className="flex-1 overflow-hidden flex flex-col bg-[#f7f9fb]">
                <CardRankingView onBack={() => setCurrentView('home')} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {/* Conditionally render bottom navigation */}
        {['home', 'projects', 'stockList', 'casino', 'profile', 'cskh', 'welfare_consultation', 'vinfast', 'vinpearl_projects', 'cardRanking'].includes(currentView) && (
          <BottomNav currentView={currentView} onViewChange={(v) => {
            if (v === 'qr') {
              // Removed QR Modal functionality
            } else {
              setProfileSubView(null);
              setCurrentView(v as ViewState);
            }
          }} />
        )}
      </div>
    </EditableImage>
  );
}

