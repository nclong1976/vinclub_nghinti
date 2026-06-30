import React, { useState } from 'react';
import { useUser } from './UserContext';
import { Eye, EyeOff, CheckCircle, ChevronRight } from 'lucide-react';
import vinpearlIcon from '../assets/images/logo-vinpearl-1.png';

export default function AuthScreen() {
  const { login, register } = useUser();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form States
  const [regEmailOrPhone, setRegEmailOrPhone] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regReferral, setRegReferral] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // High fidelity Logo Component
  const VinLogos = () => (
    <div className="flex items-center justify-center mt-6 mb-8 select-none">
      {/* Left side: VINPEARL */}
      <div className="flex flex-col items-center justify-center w-14 h-14">
        <img 
          src={vinpearlIcon} 
          alt="VINPEARL Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Vertical line divider */}
      <div className="h-12 w-[1px] bg-[#1a2d6c]/20 mx-4"></div>

      {/* Right side: VINCLUB */}
      <div className="flex flex-col items-center justify-center w-32">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXuMhpBwyfDQQdAxquYpUvV5Qwt-Pdao-vS3KYHl5yg&s" 
          alt="VINCLUB Logo" 
          className="w-full h-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );

  const VietnamFlagSVG = () => (
    <div className="relative w-5 h-5 bg-[#da251d] rounded-full flex items-center justify-center mr-1.5 shadow-sm">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#ffff00]" fill="currentColor">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    </div>
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmailOrPhone.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(loginEmailOrPhone.trim(), loginPassword);
      if (res.success) {
        setSuccessMsg('Đăng nhập thành công!');
      } else {
        setErrorMsg(res.message || 'Đăng nhập không thành công.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regEmailOrPhone.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại.');
      return;
    }
    if (!regLastName.trim()) {
      setErrorMsg('Vui lòng nhập họ.');
      return;
    }
    if (!regFirstName.trim()) {
      setErrorMsg('Vui lòng nhập tên đệm và tên.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải dài ít nhất 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Nhập lại mật khẩu không trùng khớp.');
      return;
    }
    if (!regReferral.trim()) {
      setErrorMsg('Mã giới thiệu là bắt buộc để đăng ký.');
      return;
    }
    if (regReferral.trim().toUpperCase() !== 'V-ECO') {
      setErrorMsg('Mã giới thiệu không đúng. Vui lòng sử dụng mã "V-ECO".');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(
        regEmailOrPhone.trim(),
        regPassword,
        regLastName.trim(),
        regFirstName.trim(),
        regReferral.trim()
      );
      if (res.success) {
        setSuccessMsg('Đăng ký tài khoản thành công!');
      } else {
        setErrorMsg(res.message || 'Đăng ký không thành công.');
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = () => {
    setLoginEmailOrPhone('testvin');
    setLoginPassword('121212');
    setErrorMsg(null);
  };

  return (
    <div id="auth-screen-container" className="flex-1 flex flex-col bg-white h-full relative overflow-y-auto font-['Inter',sans-serif]">
      {/* Top Header: VIE selector */}
      <div className="absolute top-6 right-4 flex items-center z-10">
        <button className="flex items-center hover:opacity-80 transition-opacity">
          <VietnamFlagSVG />
          <span className="text-[#333333] text-[14px]">VIE</span>
          <ChevronRight className="w-4 h-4 text-[#333333] ml-0.5" />
        </button>
      </div>

      <div className="px-6 pt-16 pb-8 flex-1 flex flex-col max-w-md mx-auto w-full">
        <div>
          <VinLogos />

          {/* Tab Selector */}
          <div className="flex border-b border-[#e5e5e5] mb-8 relative">
            <button
              id="tab-login-btn"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-3 text-center text-[15px] transition-all relative ${
                activeTab === 'login'
                  ? 'text-[#333333] font-bold'
                  : 'text-[#888888] font-normal hover:text-[#555555]'
              }`}
            >
              Đăng nhập
              {activeTab === 'login' && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#dfa135]"></div>
              )}
            </button>
            <button
              id="tab-register-btn"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-3 text-center text-[15px] transition-all relative ${
                activeTab === 'register'
                  ? 'text-[#333333] font-bold'
                  : 'text-[#888888] font-normal hover:text-[#555555]'
              }`}
            >
              Đăng ký
              {activeTab === 'register' && (
                <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#dfa135]"></div>
              )}
            </button>
          </div>

          {/* Success / Error Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-[13px] font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-[13px] font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login view */}
          {activeTab === 'login' ? (
            <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Email/Số điện thoại*"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  className="w-full px-3.5 py-3.5 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
                <span className="text-[13px] text-[#666666] italic block mt-2 mb-4 select-none">
                  (Ví dụ: yourname@email.com / +84904123456)
                </span>
              </div>

              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-3.5 pr-10 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember and Forget passwords */}
              <div className="flex items-center justify-between text-[13px] pt-2 select-none">
                <label className="flex items-center gap-2 cursor-pointer text-[#333333]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-[#e5e5e5] text-[#dfa135] focus:ring-[#dfa135] w-4 h-4 cursor-pointer accent-[#dfa135]"
                  />
                  <span>Ghi nhớ tài khoản</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Chức năng đang được cập nhật!"); }} className="text-[#555555] hover:text-[#333333] transition-colors underline">
                  Quên mật khẩu
                </a>
              </div>

              {/* Action Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-6 bg-[#dfa135] hover:bg-[#d0912a] disabled:bg-[#e5e5e5] disabled:text-[#999999] disabled:cursor-not-allowed text-[#1a1a1a] text-[14px] font-bold rounded transition-colors duration-200"
              >
                {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
              </button>

              {/* Terms disclaimer */}
              <div className="text-[13px] text-[#333333] text-center pt-4">
                Bằng việc đăng nhập, tôi đồng ý với Vinpearl về <br />
                <a href="#terms" className="font-bold text-[#2d6bb2] hover:underline">Điều kiện điều khoản</a> và <a href="#privacy" className="font-bold text-[#2d6bb2] hover:underline">Chính sách bảo mật</a>
              </div>

              {/* Bottom Switch Tab Option */}
              <div className="text-center text-[14px] text-[#333333] mt-6">
                Chưa có tài khoản?{' '}
                <button
                  id="toggle-to-register"
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#2d6bb2] hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </div>

            </form>
          ) : (
            /* Register view */
            <form id="register-form" onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Email/Số điện thoại*"
                  value={regEmailOrPhone}
                  onChange={(e) => setRegEmailOrPhone(e.target.value)}
                  className="w-full px-3.5 py-3.5 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
                <span className="text-[13px] text-[#666666] italic block mt-2 select-none">
                  (Ví dụ: yourname@email.com / +84904123456)
                </span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Họ"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3.5 py-3.5 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Tên đệm và tên"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="w-full px-3.5 py-3.5 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
              </div>

              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3.5 py-3.5 pr-10 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                >
                  {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-3.5 pr-10 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666] transition-colors"
                >
                  {showRegConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Mã giới thiệu (nếu có)"
                  value={regReferral}
                  onChange={(e) => setRegReferral(e.target.value)}
                  className="w-full px-3.5 py-3.5 border border-[#e5e5e5] rounded text-[#333333] text-[14px] bg-white outline-none focus:border-[#dfa135] transition-colors placeholder:text-[#999999]"
                />
              </div>

              {/* Action Button */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-6 bg-[#dfa135] hover:bg-[#d0912a] disabled:bg-[#e5e5e5] disabled:text-[#999999] disabled:cursor-not-allowed text-[#1a1a1a] text-[14px] font-bold rounded transition-colors duration-200"
              >
                {isLoading ? 'ĐANG ĐĂNG KÝ...' : 'ĐĂNG KÝ'}
              </button>

              {/* Terms disclaimer */}
              <div className="text-[13px] text-[#333333] text-center pt-4">
                Bằng việc đăng ký, tôi đồng ý với Vinpearl về <br />
                <a href="#terms" className="font-bold text-[#2d6bb2] hover:underline">Điều kiện điều khoản</a> và <a href="#privacy" className="font-bold text-[#2d6bb2] hover:underline">Chính sách bảo mật</a>
              </div>

              {/* Bottom Switch Tab Option */}
              <div className="text-center text-[14px] text-[#333333] mt-6">
                Đã có tài khoản?{' '}
                <button
                  id="toggle-to-login"
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="font-bold text-[#2d6bb2] hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

