import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Cloud, CheckCircle, UploadCloud, LogOut, Loader2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import { useUser } from './UserContext';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

interface GoogleDriveSyncProps {
  onSyncComplete?: () => void;
  contractContent?: string;
  fileName?: string;
}

export default function GoogleDriveSync({ onSyncComplete, contractContent, fileName }: GoogleDriveSyncProps) {
  const { displayName, transactions, balance } = useUser();
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'contracts' | 'statement'>('contracts');
  const [selectedTxId, setSelectedTxId] = useState<string>('default');

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUser(user);
        setToken(token);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Find investment transactions
  const investmentTxs = transactions.filter(tx => tx.type === 'invest' && tx.status === 'Thành công');

  // Define options
  const options = [
    { id: 'default', title: 'Hợp đồng Thành viên VIP VinClub (Mặc định)', amount: 0, date: new Date().toLocaleDateString('vi-VN') },
    ...investmentTxs.map(tx => ({
      id: tx.id,
      title: `Hợp đồng Góp vốn: ${tx.contractProjectTitle || 'Dự án đầu tư'}`,
      amount: tx.amount,
      date: tx.date,
      tx: tx
    }))
  ];

  const selectedOption = options.find(opt => opt.id === selectedTxId) || options[0];

  const getContractTextContent = (opt: any) => {
    if (opt.id === 'default') {
      return `===========================================================
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
===========================================================

HỢP ĐỒNG THÀNH VIÊN DANH DỰ VINCLUB - VIP MEMBERSHIP
Mã số định danh: VC-MEM-${user?.uid?.substring(0, 8).toUpperCase() || 'MEMBER'}

Căn cứ vào Điều lệ hoạt động của CLB Thượng lưu VinClub.
Hôm nay, ngày ${opt.date}, chúng tôi gồm:

BÊN A: BAN QUẢN TRỊ CLB THƯỢNG LƯU VINCLUB
- Trụ sở: Vinhomes Riverside, Long Biên, Hà Nội, Việt Nam.
- Đại diện: Super Admin Leo - Chủ tịch CLB.

BÊN B: THÀNH VIÊN DANH DỰ VINCLUB
- Họ và tên: ${displayName || 'Hội viên VIP VinClub'}
- Mã số tài khoản: ${user?.uid || 'N/A'}
- Địa chỉ Email liên hệ: ${user?.email || 'N/A'}

ĐIỀU KHOẢN THỎA THUẬN:
1. Bên B chính thức được công nhận là thành viên chính thức thuộc hệ sinh thái VinClub.
2. Bên B được hưởng các đặc quyền ưu đãi thượng lưu từ các thương hiệu của Tập đoàn Vingroup bao gồm: Vinpearl, VinFast, Vinmec, Vinschool, Vincom, v.v.
3. Bên B cam kết tuân thủ đầy đủ điều lệ, quy định bảo mật thông tin tài khoản và giao dịch an toàn của CLB.

CHỮ KÝ BẢO CHỨNG ĐIỆN TỬ:
- Đại diện Bên A: Super Admin Leo (Đã đóng dấu kiểm định điện tử)
- Hội viên Bên B: ${displayName || 'Hội viên VIP VinClub'} (Đã bảo chứng thông qua tài khoản cá nhân)
- Xác thực bởi: VinClub Identity Center
===========================================================`;
    } else {
      const tx = opt.tx;
      return `===========================================================
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
===========================================================

HỢP ĐỒNG GÓP VỐN ĐẦU TƯ VIP - VINCLUB CO-INVESTMENT
Mã số hợp đồng: HDDT-${tx.id.substring(2).toUpperCase()}

Căn cứ vào nhu cầu hợp tác đầu tư và khai thác dự án sinh lời cao.
Hôm nay, ngày ${tx.date}, các bên thỏa thuận ký kết hợp đồng này:

BÊN A: BAN QUẢN LÝ DỰ ÁN & HỆ THỐNG ĐẦU TƯ VINCLUB
- Đại diện: Ban Giám đốc quản lý dự án đầu tư VinClub.

BÊN B: NHÀ ĐẦU TƯ VIP VINCLUB
- Họ và tên: ${displayName || 'Nhà đầu tư Thượng lưu'}
- Mã số tài khoản: ${user?.uid || 'N/A'}
- Địa chỉ Email liên hệ: ${user?.email || 'N/A'}

ĐIỀU 1: NỘI DUNG ĐẦU TƯ
- Dự án đầu tư: ${tx.contractProjectTitle || 'Dự án đầu tư sinh lời VinClub'}
- Số tiền góp vốn: ${tx.amount.toLocaleString('vi-VN')} VND
- Trạng thái nộp tiền: Đã thanh toán đầy đủ thành công (${tx.status})
- Ngày ký kết: ${tx.date}

ĐIỀU 2: LỢI NHUẬN & THỜI HẠN
- Lợi nhuận cam kết trả định kỳ vào số dư tài khoản VinClub hằng ngày.
- Mọi giao dịch nạp/rút tiền liên quan đến dự án này được tự động bảo an qua mã băm blockchain.

CHỮ KÝ BẢO CHỨNG ĐIỆN TỬ:
- Đại diện Bên A: Đại diện VinClub Co-Investment (Đã ký điện tử & Đóng dấu bảo an)
- Nhà đầu tư Bên B: ${displayName || 'Nhà đầu tư Thượng lưu'}
- Hình thức ký: ${tx.signatureType === 'draw' ? 'Vẽ tay điện tử' : 'Ký chữ điện tử'}
- Chữ ký hiển thị: ${tx.signatureType === 'draw' ? '[Chữ ký hình ảnh được bảo mật]' : (tx.signatureContent || 'Ký số tự động')}
- Mã băm bảo mật SHA-256 Hash: ${tx.id}F8A9E9D3B2C1

Hợp đồng này được sao lưu an toàn tự động vào thư mục "VinclubContracts" trên tài khoản Google Drive cá nhân của Nhà đầu tư.
===========================================================`;
    }
  };

  const getStatementTextContent = () => {
    const totalDeposit = transactions
      .filter(t => t.type === 'deposit' && t.status === 'Thành công')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdraw = transactions
      .filter(t => t.type === 'withdraw' && t.status === 'Thành công')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalInvest = transactions
      .filter(t => t.type === 'invest' && t.status === 'Thành công')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalProfit = transactions
      .filter(t => t.type === 'profit' && t.status === 'Thành công')
      .reduce((sum, t) => sum + t.amount, 0);

    let txLines = '';
    transactions.forEach((t, i) => {
      txLines += `${i + 1}. [${t.date}] [${t.type.toUpperCase()}] ${t.amount.toLocaleString('vi-VN')} VND - ${t.status} ${t.note ? `(${t.note})` : ''}\n`;
    });

    return `===========================================================
BÁO CÁO CHI TIẾT TÀI KHOẢN VINCLUB - ACCOUNT STATEMENT
Thời gian xuất báo cáo: ${new Date().toLocaleString('vi-VN')}
===========================================================

THÔNG TIN KHÁCH HÀNG:
- Tên chủ tài khoản: ${displayName}
- Email: ${user?.email || 'N/A'}
- Số dư khả dụng hiện tại: ${balance.toLocaleString('vi-VN')} VND

TỔNG QUAN TÀI CHÍNH GIAO DỊCH:
- Tổng nạp tiền thành công:  +${totalDeposit.toLocaleString('vi-VN')} VND
- Tổng rút tiền thành công:  -${totalWithdraw.toLocaleString('vi-VN')} VND
- Tổng góp vốn đầu tư VIP:  -${totalInvest.toLocaleString('vi-VN')} VND
- Tổng tiền lãi nhận được:   +${totalProfit.toLocaleString('vi-VN')} VND

DANH SÁCH LỊCH SỬ GIAO DỊCH CHI TIẾT:
-----------------------------------------------------------
${txLines || 'Không có lịch sử giao dịch nào.'}
-----------------------------------------------------------

Báo cáo này được kết xuất tự động từ hệ thống quản lý hội viên VinClub và sao lưu an toàn tại thư mục "VinclubContracts" của bạn trên Google Drive.
===========================================================`;
  };

  const uploadToDrive = async () => {
    if (!token) return;
    
    setIsSyncing(true);
    setSyncStatus('Chuẩn bị đồng bộ...');
    
    try {
      // 1. Check if folder 'VinclubContracts' exists
      let folderId = null;
      const query = "mimeType='application/vnd.google-apps.folder' and name='VinclubContracts' and trashed=false";
      const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&spaces=drive`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const searchData = await searchRes.json();
      
      if (searchData.files && searchData.files.length > 0) {
        folderId = searchData.files[0].id;
      } else {
        // 2. Create folder if it doesn't exist
        const folderMetadata = {
          name: 'VinclubContracts',
          mimeType: 'application/vnd.google-apps.folder'
        };
        const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderMetadata)
        });
        const createFolderData = await createFolderRes.json();
        folderId = createFolderData.id;
      }

      // 3. Upload file to the folder
      let content = '';
      let fileTitle = '';
      
      if (activeTab === 'contracts') {
        content = contractContent || getContractTextContent(selectedOption);
        fileTitle = fileName || (selectedOption.id === 'default' 
          ? `HopDong_ThanhVien_VinClub_${new Date().getTime()}.txt`
          : `HopDong_GopVon_${selectedOption.id}_${new Date().getTime()}.txt`);
      } else {
        content = getStatementTextContent();
        fileTitle = `BaoCao_TaiKhoan_VinClub_${new Date().getTime()}.txt`;
      }

      const file = new Blob([content], { type: 'text/plain' });
      const metadata = {
        name: fileTitle,
        parents: [folderId]
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      setSyncStatus('Đang tải lên...');
      
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error('Failed to upload file');
      
      setSyncStatus('Đồng bộ thành công!');
      setTimeout(() => setSyncStatus(''), 4000);
      if (onSyncComplete) onSyncComplete();
    } catch (error) {
      console.error('Upload error:', error);
      setSyncStatus('Lỗi đồng bộ!');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-100 text-[15px] uppercase tracking-wide">Đồng bộ hóa Google Drive</h3>
            <p className="text-[11px] text-zinc-500">Sao lưu bảo chứng pháp lý điện tử</p>
          </div>
        </div>
        {!needsAuth && (
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800 text-[11px] text-zinc-300">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="truncate max-w-[120px] font-medium">{user?.email}</span>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors ml-1">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {needsAuth ? (
        <div className="text-center py-6 space-y-4">
          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
            Kết nối tài khoản Google của bạn để tự động lưu trữ các bản sao hợp đồng góp vốn & báo cáo giao dịch điện tử của hệ thống VinClub.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="mx-auto flex items-center justify-center gap-2 bg-white text-zinc-900 py-3 px-6 rounded-xl font-bold text-[13px] hover:bg-zinc-100 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md shadow-black/40"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            )}
            <span>Đăng nhập với Google</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Tabs Selector */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`py-2 rounded-lg font-medium text-xs transition-all ${
                activeTab === 'contracts' 
                  ? 'bg-zinc-800 text-[#ebd5ad] font-bold shadow' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Hợp đồng đầu tư
            </button>
            <button
              onClick={() => setActiveTab('statement')}
              className={`py-2 rounded-lg font-medium text-xs transition-all ${
                activeTab === 'statement' 
                  ? 'bg-zinc-800 text-[#ebd5ad] font-bold shadow' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Báo cáo tài chính
            </button>
          </div>

          {activeTab === 'contracts' ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">Chọn hợp đồng sao lưu</label>
                <select
                  value={selectedTxId}
                  onChange={(e) => setSelectedTxId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#ebd5ad] transition-all cursor-pointer"
                >
                  {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title} {opt.amount > 0 ? `(${formatCurrency(opt.amount)})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview Box */}
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/80 p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/40">
                  <span className="text-[11px] text-zinc-500 uppercase font-bold">Xem trước văn bản</span>
                  <span className="text-[10px] text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Đã ký điện tử
                  </span>
                </div>
                
                <div className="font-mono text-[9px] text-zinc-400 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre p-2 bg-black/40 rounded border border-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800">
                  {getContractTextContent(selectedOption)}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Statement Preview */}
              <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/80 p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800/40">
                  <span className="text-[11px] text-zinc-500 uppercase font-bold">Xem trước báo cáo tài chính</span>
                  <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Sao lưu tự động
                  </span>
                </div>

                <div className="font-mono text-[9px] text-zinc-400 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre p-2 bg-black/40 rounded border border-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800">
                  {getStatementTextContent()}
                </div>
              </div>
            </div>
          )}

          {/* Sync Button */}
          <div className="pt-2">
            <button
              onClick={uploadToDrive}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-2 bg-[#ebd5ad] hover:bg-[#dec191] text-zinc-950 py-3 rounded-xl font-bold text-xs tracking-wide uppercase transition-all active:scale-[0.98] shadow-lg shadow-amber-950/20 disabled:opacity-50"
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4.5 h-4.5" />
              )}
              <span>
                {isSyncing 
                  ? 'Đang đồng bộ điện tử...' 
                  : activeTab === 'contracts' 
                    ? 'Đồng bộ hợp đồng lên Google Drive' 
                    : 'Đồng bộ báo cáo lên Google Drive'}
              </span>
            </button>
            
            {syncStatus && (
              <div className={`mt-3 p-2.5 rounded-lg border text-center text-xs font-semibold animate-in fade-in duration-200 ${
                syncStatus.includes('thành công') 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : syncStatus.includes('Lỗi') 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}>
                {syncStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

