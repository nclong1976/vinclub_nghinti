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
import { Settings2, X, Check, Loader2 } from 'lucide-react';
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
  const { isLoggedIn, getAdjustedStocks, role, termsAccepted, updateUserField, displayName } = useUser();
  const [agreementLoading, setAgreementLoading] = useState(false);

  // Call hook to track user presence (online/offline) in RTDB
  usePresence();

  // Interactive modal states
  const [profileSubView, setProfileSubView] = useState<string | null>(null);

  const handleAcceptTerms = async () => {
    setAgreementLoading(true);
    try {
      await updateUserField('termsAccepted', true);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xác nhận điều khoản. Vui lòng thử lại.");
    } finally {
      setAgreementLoading(false);
    }
  };

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
  
  // Show membership agreement modal for non-admins if terms not accepted yet
  if (!isAdminRole && termsAccepted === false) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-0 sm:p-4 font-sans select-none">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;700&display=swap');
          .font-aptos {
            font-family: 'Aptos Narrow', 'Archivo Narrow', 'Arial Narrow', sans-serif !important;
          }
        `}} />
        <div className="w-full max-w-md bg-[#0a0a0a] min-h-screen sm:min-h-[85vh] sm:max-h-[90vh] sm:rounded-3xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col border border-zinc-800/80 p-5 overflow-hidden">
          <div className="text-center pt-3 pb-2 shrink-0">
            <span className="text-[10px] font-black text-[#c29b57] tracking-[0.25em] uppercase block mb-1">XÁC THỰC THÀNH VIÊN</span>
            <h2 className="text-sm font-bold text-zinc-100 tracking-wider font-aptos uppercase">THỎA THUẬN QUYỀN LỢI & BẢO MẬT</h2>
          </div>

          {/* Document Content Container */}
          <div className="flex-1 overflow-y-auto my-3 p-4 bg-white rounded-2xl border border-zinc-200 shadow-inner text-zinc-800 text-[10.5px] leading-relaxed space-y-4 font-serif relative">
            <div className="text-center space-y-0.5 mb-4 select-none">
              <h4 className="font-extrabold uppercase tracking-wide text-[10px] text-zinc-900 font-aptos">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
              <p className="font-bold text-[9px] text-zinc-700 font-aptos">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-20 h-[1px] bg-zinc-300 mx-auto mt-1"></div>
            </div>

            <div className="text-center mb-3">
              <h3 className="font-extrabold text-[12px] text-zinc-900 tracking-wide font-aptos uppercase">THỎA THUẬN THÀNH VIÊN VÀ QUY CHẾ HOẠT ĐỘNG</h3>
              <p className="text-[8px] text-zinc-500 italic font-aptos">Hệ sinh thái đặc quyền đầu tư tài chính VinClub</p>
            </div>

            <div className="space-y-2.5 text-justify font-sans text-[10px] text-zinc-850">
              <p>Chào mừng ông/bà <strong className="text-zinc-950 font-bold uppercase">{displayName}</strong> tham gia Cộng đồng hội viên cao cấp VinClub.</p>
              
              <p className="font-bold text-zinc-900 uppercase text-[9.5px]">Điều 1: Bảo mật và An toàn thông tin</p>
              <p>Thành viên có trách nhiệm bảo mật tuyệt đối thông tin tài khoản, mật khẩu giao dịch và mã PIN rút tiền cá nhân. Hệ thống VinClub và đại diện Ban quản trị cam kết không yêu cầu cung cấp mật khẩu dưới bất kỳ hình thức nào.</p>

              <p className="font-bold text-zinc-900 uppercase text-[9.5px]">Điều 2: Nguyên tắc Đầu tư và Lợi nhuận</p>
              <p>Mọi khoản đầu tư tài chính, giao dịch chứng khoán, và tiền ký gửi vào hệ sinh thái của VinClub đều được giám sát và bảo lãnh lợi nhuận theo đúng cam kết hợp đồng. Lãi suất được tính toán tự động dựa trên cấp bậc hội viên và thanh toán định kỳ trực tiếp vào tài khoản hội viên.</p>

              <p className="font-bold text-zinc-900 uppercase text-[9.5px]">Điều 3: Rút tiền và Phí giao dịch</p>
              <p>Thành viên được quyền thực hiện yêu cầu rút tiền về tài khoản ngân hàng chính chủ đã liên kết. Yêu cầu rút tiền sẽ được bộ phận Tài vụ kiểm tra và phê duyệt tự động. Thành viên cam kết không thực hiện các hành vi gian lận hoặc trục lợi hệ thống.</p>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 font-aptos relative mt-6 select-none">
              <div className="text-left space-y-1">
                <p className="font-bold text-[9px] text-zinc-700">ĐẠI DIỆN VINCLUB</p>
                <div className="h-10 relative flex items-center">
                  <span className="text-zinc-400 font-serif italic text-xs block pl-2 select-none">Vingroup Admin</span>
                  {/* Absolute seal overlapping */}
                  <div className="absolute left-[-5px] top-[-30px] pointer-events-none select-none mix-blend-multiply">
                    <svg viewBox="0 0 120 120" className="w-24 h-24 text-red-600 opacity-85 rotate-[-8deg] drop-shadow-sm" fill="currentColor">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="3" />
                      <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path id="seal-text-path-auth" fill="none" d="M 20 60 A 40 40 0 1 1 100 60" />
                      <text fill="currentColor" fontSize="8" fontWeight="bold" letterSpacing="0.8">
                        <textPath href="#seal-text-path-auth" startOffset="50%" textAnchor="middle">
                          TẬP ĐOÀN VINCLUB * VIỆT NAM
                        </textPath>
                      </text>
                      <path id="seal-bottom-path-auth" fill="none" d="M 100 60 A 40 40 0 0 1 20 60" />
                      <text fill="currentColor" fontSize="7" fontWeight="bold" letterSpacing="0.5">
                        <textPath href="#seal-bottom-path-auth" startOffset="50%" textAnchor="middle">
                          * BAN QUẢN TRỊ HỘI VIÊN *
                        </textPath>
                      </text>
                      <polygon points="60,42 63,51 72,51 65,57 67,66 60,61 53,66 55,57 48,51 57,51" fill="currentColor" />
                      <text x="60" y="80" fill="currentColor" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        ĐÃ KIỂM DUYỆT
                      </text>
                    </svg>
                  </div>
                </div>
                <p className="text-[7.5px] text-zinc-500 uppercase font-medium">PHÓ TỔNG GIÁM ĐỐC LÂM HUY</p>
              </div>

              <div className="text-right space-y-1">
                <p className="font-bold text-[9px] text-zinc-700">HỘI VIÊN XÁC NHẬN</p>
                <div className="h-10 flex items-center justify-end">
                  <span className="text-emerald-700 font-bold text-[8.5px] border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider select-none animate-pulse">
                    ĐÃ CHẤP THUẬN KÝ
                  </span>
                </div>
                <p className="text-[8px] text-zinc-650 font-bold uppercase">{displayName}</p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 shrink-0">
            <button
              onClick={handleAcceptTerms}
              disabled={agreementLoading}
              className="w-full bg-gradient-to-r from-[#c29b57] to-[#ebd5ad] hover:opacity-95 text-black py-3.5 rounded-2xl font-extrabold text-xs cursor-pointer shadow-lg shadow-[#c29b57]/10 flex items-center justify-center gap-1.5 transition-all select-none uppercase tracking-wider disabled:opacity-50"
            >
              {agreementLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Đang khởi tạo tài khoản...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-black" strokeWidth={3} />
                  Tôi đồng ý với các điều khoản của VinClub
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

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

