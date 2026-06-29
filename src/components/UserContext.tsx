import React, { createContext, useContext, useState, useEffect } from 'react';

import { doc, setDoc, onSnapshot, getDoc, updateDoc, collection, query, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { Stock, PortfolioItem, Order, Project, AuditLogEntry, CasinoGame } from '../types';

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdraw' | 'invest' | 'profit' | 'bonus';
  amount: number;
  date: string;
  status: 'Thành công' | 'Đang xử lý' | 'Thất bại';
  signatureType?: 'draw' | 'type' | 'saved';
  signatureContent?: string;
  contractProjectTitle?: string;
  note?: string;
  proofImage?: string;
  timestamp?: string;
};

export type BankInfo = {
  bankName: string;
  bankAccount: string;
  cardHolder: string;
};

export type ProfitRecord = {
  id: string;
  amount: number;
  description: string;
  date: string;
};

export type BonusRecord = {
  id: string;
  amount: number;
  description: string;
  date: string;
};

export type DepositRecord = {
  id: string;
  amount: number;
  date: string;
  status: string;
  txId?: string;
  note?: string;
  proofImage?: string;
};

export type KeepNote = {
  id: string;
  title: string;
  content: string;
  color?: string;
  isPinned?: boolean;
  tags?: string[];
  updatedAt: string;
};

type UserContextType = {
  displayName: string;
  setDisplayName: (val: string) => void;
  avatarImage: string | null;
  setAvatarImage: (val: string | null) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  birthYear: string;
  setBirthYear: (val: string) => void;
  cccd: string;
  setCccd: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  balance: number;
  setBalance: (val: number | ((prev: number) => number)) => void;
  bankInfo: BankInfo | null;
  setBankInfo: (val: BankInfo | null) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  profits: ProfitRecord[];
  addProfit: (amount: number, description: string) => void;
  bonuses: BonusRecord[];
  addBonus: (amount: number, description: string) => void;
  depositsList: DepositRecord[];
  addDepositRecord: (amount: number, note?: string, proofImage?: string) => void;
  passwordChangeLog: { oldPass: string; newPass: string; date: string }[];
  changePassword: (oldP: string, newP: string) => boolean;
  withdrawalPasswordChangeLog: { oldPass: string; newPass: string; date: string }[];
  changeWithdrawalPassword: (oldP: string, newP: string) => boolean;
  isLoggedIn: boolean;
  userId: string | null;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (emailOrPhone: string, password: string, lastName: string, firstName: string, referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  systemInstructions: string;
  updateSystemInstructions: (text: string) => Promise<void>;
  getAdjustedStocks: (stocks: Stock[]) => Stock[];
  forceActiveStockRules: boolean;
  setForceActiveStockRules: (val: boolean) => void;
  interestRate: number;
  stockTriggers: any[];
  updateSystemDirectives: (rate: number, triggers: any[]) => Promise<void>;
  isIdentityVerified: boolean;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  kycRejectReason?: string;
  setIsIdentityVerified: (val: boolean) => void;
  updateUserField: (field: string, value: any) => Promise<void>;
  role: 'user' | 'admin' | 'super_admin' | 'finance_admin' | 'support_admin';
  cmsNews: any[];
  cmsBanners: string[];
  cmsVinfast: any[];
  articlesList: any[];
  updateCmsNews: (news: any[]) => Promise<void>;
  updateCmsBanners: (banners: string[]) => Promise<void>;
  updateCmsVinfast: (cars: any[]) => Promise<void>;
  adminProjects: Project[];
  auditLog: AuditLogEntry[];
  updateProjectStatus: (projectId: string, newStatus: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED') => Promise<void>;
  updateProjectDetails: (projectId: string, updates: Partial<Project>) => Promise<void>;
  updateAllProjectsStatus: (newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>;
  standardProjects: Project[];
  updateStandardProjectDetails: (projectId: string, updates: Partial<Project>) => Promise<void>;
  updateAllStandardProjectsStatus: (newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>;
  standardStocks: Stock[];
  casinoGames: CasinoGame[];
  updateStockDetails: (symbol: string, updates: Partial<Stock>) => Promise<void>;
  updateCasinoGameDetails: (id: string, updates: Partial<CasinoGame>) => Promise<void>;
  updateAllStocksStatus: (newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>;
  updateAllCasinoGamesStatus: (newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>;
  updateAllVinfastStatus: (newStatus: 'ACTIVE' | 'CLOSED') => Promise<void>;
  portfolio: PortfolioItem[];
  orderHistory: Order[];
  placeOrder: (symbol: string, quantity: number, price: number, type: 'buy' | 'sell') => Promise<{ success: boolean, message?: string }>;
  keepNotes: KeepNote[];
  updateKeepNotes: (notes: KeepNote[]) => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  displayName: 'ADMINSG23L',
  setDisplayName: () => { },
  avatarImage: null,
  setAvatarImage: () => { },
  phoneNumber: '',
  setPhoneNumber: () => { },
  birthYear: '',
  setBirthYear: () => { },
  cccd: '',
  setCccd: () => { },
  address: '',
  setAddress: () => { },
  balance: 0,
  setBalance: () => { },
  bankInfo: null,
  setBankInfo: () => { },
  transactions: [],
  addTransaction: () => { },
  profits: [],
  addProfit: () => { },
  bonuses: [],
  addBonus: () => { },
  depositsList: [],
  addDepositRecord: () => { },
  passwordChangeLog: [],
  changePassword: () => false,
  withdrawalPasswordChangeLog: [],
  changeWithdrawalPassword: () => false,
  isLoggedIn: false,
  userId: null,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => { },
  systemInstructions: '',
  updateSystemInstructions: async () => { },
  getAdjustedStocks: (stocks: Stock[]) => stocks,
  forceActiveStockRules: false,
  setForceActiveStockRules: () => { },
  interestRate: 0.006,
  stockTriggers: [],
  updateSystemDirectives: async () => { },
  isIdentityVerified: false,
  setIsIdentityVerified: () => { },
  updateUserField: async () => { },
  role: 'user',
  cmsNews: [],
  cmsBanners: [],
  cmsVinfast: [],
  articlesList: [],
  updateCmsNews: async () => { },
  updateCmsBanners: async () => { },
  updateCmsVinfast: async () => { },
  adminProjects: [],
  auditLog: [],
  updateProjectStatus: async () => { },
  updateProjectDetails: async () => { },
  updateAllProjectsStatus: async () => { },
  standardProjects: [],
  updateStandardProjectDetails: async () => { },
  updateAllStandardProjectsStatus: async () => { },
  standardStocks: [],
  casinoGames: [],
  updateStockDetails: async () => { },
  updateCasinoGameDetails: async () => { },
  updateAllStocksStatus: async () => { },
  updateAllCasinoGamesStatus: async () => { },
  updateAllVinfastStatus: async () => { },
  portfolio: [],
  orderHistory: [],
  placeOrder: async () => ({ success: false, message: 'Not implemented' }),
  keepNotes: [],
  updateKeepNotes: async () => { },
});

// ==================== SYSTEM INSTRUCTION PARSERS ====================
export interface StockInstruction {
  stockNameOrSymbol: string;
  timeStr: string;
  dateStr: string;
  changeType: 'tăng' | 'giảm';
  percent: number;
  durationMin: number;
}

export const parseInterestRate = (text: string): number | null => {
  if (!text) return null;
  // Matches "lãi suất 0.6%" or "lãi xuất 0,6%"
  const match = text.match(/lãi\s*(?:xuất|suất)\s*(\d+(?:[.,]\d+)?)\s*%/i);
  if (match) {
    const rateStr = match[1].replace(',', '.');
    return parseFloat(rateStr) / 100;
  }
  return null;
};

export const parseStockInstructions = (text: string): StockInstruction[] => {
  if (!text) return [];
  const lines = text.split('\n');
  const rules: StockInstruction[] = [];

  // Pattern to match "Chứng khoán VINHOMES 15h00 ngày 25/06/2026 tăng 2,4% trong thời gian 15 phút"
  const regex = /chứng\s*khoán\s+([a-z0-9\s]+?)\s+(\d{1,2}h\d{2}|\d{1,2}:\d{2})\s+ngày\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+(tăng|giảm)\s+(\d+(?:[.,]\d+)?)\s*%\s+trong\s+thời\s+gian\s+(\d+)\s+phút/i;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const stockNameOrSymbol = match[1].trim();
      const timeStr = match[2].trim();
      const dateStr = match[3].trim();
      const changeType = match[4].toLowerCase() as 'tăng' | 'giảm';
      const percent = parseFloat(match[5].replace(',', '.'));
      const durationMin = parseInt(match[6], 10);

      rules.push({
        stockNameOrSymbol,
        timeStr,
        dateStr,
        changeType,
        percent,
        durationMin
      });
    }
  }
  return rules;
};

export const parseInstructionDate = (dateStr: string, timeStr: string): Date => {
  const dateParts = dateStr.split('/');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  const timeClean = timeStr.replace('h', ':');
  const timeParts = timeClean.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  return new Date(year, month, day, hours, minutes, 0, 0);
};

export const getInterestDatesDue = (lastPaidStr: string, now: Date): Date[] => {
  const dates: Date[] = [];
  const start = new Date(lastPaidStr);
  start.setHours(12, 0, 0, 0); // avoid timezone issues

  const current = new Date(start);
  current.setDate(current.getDate() + 1);

  let loopCount = 0;
  while (current <= now && loopCount < 100) {
    loopCount++;
    const eightAM = new Date(current.getFullYear(), current.getMonth(), current.getDate(), 8, 0, 0, 0);
    if (now >= eightAM) {
      dates.push(eightAM);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user-current-id') || null);
  const [displayName, setDisplayNameState] = useState('ADMINSG23L');
  const [avatarImage, setAvatarImageState] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumberState] = useState('');
  const [birthYear, setBirthYearState] = useState('');
  const [cccd, setCccdState] = useState('');
  const [address, setAddressState] = useState('');
  const [balance, setBalanceState] = useState(0);
  const [bankInfo, setBankInfoState] = useState<BankInfo | null>(null);
  const [transactions, setTransactionsState] = useState<Transaction[]>([]);
  const [profits, setProfitsState] = useState<ProfitRecord[]>([]);
  const [bonuses, setBonusesState] = useState<BonusRecord[]>([]);
  const [depositsList, setDepositsListState] = useState<DepositRecord[]>([]);
  const [passwordChangeLog, setPasswordChangeLog] = useState<{ oldPass: string; newPass: string; date: string }[]>([]);
  const [withdrawalPasswordChangeLog, setWithdrawalPasswordChangeLog] = useState<{ oldPass: string; newPass: string; date: string }[]>([]);
  const [isIdentityVerifiedState, setIsIdentityVerifiedState] = useState(false);
  const [kycStatusState, setKycStatusState] = useState<'pending' | 'verified' | 'rejected' | undefined>(undefined);
  const [kycRejectReasonState, setKycRejectReasonState] = useState<string | undefined>(undefined);
  const [hasReceivedWelcomeVoucher, setHasReceivedWelcomeVoucherState] = useState<boolean>(false);
  const [role, setRoleState] = useState<'user' | 'admin' | 'super_admin' | 'finance_admin' | 'support_admin'>('user');

  // System Instructions State
  const [systemInstructions, setSystemInstructionsState] = useState<string>('');
  const [lastInterestPaidDate, setLastInterestPaidDate] = useState<string | null>(null);
  const [forceActiveStockRules, setForceActiveStockRules] = useState<boolean>(false);

  // CMS State
  const [cmsNews, setCmsNewsState] = useState<any[]>([]);
  const [cmsBanners, setCmsBannersState] = useState<string[]>([]);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [cmsVinfast, setCmsVinfastState] = useState<any[]>(() => [
    { title: 'VF 3', kw: '32', profit: '0.8', minCapital: '15.000.000', progress: 72 },
    { title: 'VF 7', kw: '260', profit: '1.2', minCapital: '50.000.000', progress: 48 },
    { title: 'VF 8', kw: '300', profit: '1.5', minCapital: '100.000.000', progress: 65 },
    { title: 'VF 9', kw: '300', profit: '1.8', minCapital: '200.000.000', progress: 83 },
  ]);
  const [portfolio, setPortfolioState] = useState<PortfolioItem[]>([]);
  const [standardProjects, setStandardProjects] = useState<Project[]>([]);
  const [standardStocks, setStandardStocks] = useState<Stock[]>([]);
  const [casinoGames, setCasinoGames] = useState<CasinoGame[]>([]);
  const [orderHistory, setOrderHistoryState] = useState<Order[]>([]);
  const [keepNotes, setKeepNotesState] = useState<KeepNote[]>([]);
  const [adminProjects, setAdminProjectsState] = useState<Project[]>(() => [
    {
      id: '1',
      title: 'Quỹ Phát Triển Thể Dục Thể Thao (Sân Vận Động Trống Đồng)',
      imageUrl: 'https://cdnphoto.dantri.com.vn/2CK2b6vmZ5PsU3RmD6m4QbH50u0=/zoom/1200_630/2025/12/20/svd-trong-dong-cropped-1766216461218.jpg',
      interestRate: '1.5%',
      duration: '6 ngày',
      minAmount: '5.0 Tỷ',
      scale: '40 tỷ USD',
      progress: 96,
      category: 'Vinpearl',
      durationDays: 6,
      minInvestAmount: 5000000000,
      interestRateValue: 0.015,
      status: 'ACTIVE',
      targetCapital: 40000000000000,
      raisedCapital: 38400000000000
    },
    {
      id: '2',
      title: 'Đại đô thị phức hợp Hạ Long Xanh (Quảng Ninh)',
      imageUrl: 'https://vinhomehalongxanh.com.vn/wp-content/uploads/2026/02/Vinhomes-Ha-Long-Xanh-scaled.jpg',
      interestRate: '1.8%',
      duration: '7 ngày',
      minAmount: '1.5 Tỷ',
      scale: '18 tỷ USD',
      progress: 98,
      category: 'Vinhomes',
      durationDays: 7,
      minInvestAmount: 1500000000,
      interestRateValue: 0.018,
      status: 'ACTIVE',
      targetCapital: 18000000000000,
      raisedCapital: 17640000000000
    }
  ]);
  const [auditLog, setAuditLogState] = useState<AuditLogEntry[]>([]);

  const [interestRate, setInterestRateState] = useState<number>(() => {
    const saved = localStorage.getItem('global-interest-rate');
    return saved ? Number(saved) : 0.006;
  });
  const [stockTriggers, setStockTriggersState] = useState<any[]>(() => {
    const saved = localStorage.getItem('global-stock-triggers');
    try {
      return saved ? JSON.parse(saved) : [
        { symbol: "VINHOMES", target_time: "2026-06-25T15:00:00", rate: 0.024, duration_mins: 15 }
      ];
    } catch {
      return [{ symbol: "VINHOMES", target_time: "2026-06-25T15:00:00", rate: 0.024, duration_mins: 15 }];
    }
  });

  // Default values
  const [currentPassword, setCurrentPassword] = useState('123456');
  const [currentWithdrawalPassword, setCurrentWithdrawalPassword] = useState('112233');

  const isLoggedIn = !!userId;

  // Real-time Firestore synchronizer
  useEffect(() => {
    const activeId = userId || 'profile';
    const docRef = doc(db, 'users', activeId);

    // 1. Initial local load as fallback while Firestore loads
    const savedName = localStorage.getItem(`user-display-name-${activeId}`);
    if (savedName) setDisplayNameState(savedName);
    else if (activeId === 'profile') setDisplayNameState('ADMINSG23L');

    const savedAvatar = localStorage.getItem(`user-avatar-image-${activeId}`);
    if (savedAvatar) setAvatarImageState(savedAvatar);
    else setAvatarImageState(null);

    const savedPhone = localStorage.getItem(`user-phone-number-${activeId}`);
    if (savedPhone) setPhoneNumberState(savedPhone);
    else if (activeId === 'profile') setPhoneNumberState('0912345678');
    else setPhoneNumberState('');

    const savedBirth = localStorage.getItem(`user-birth-year-${activeId}`);
    if (savedBirth) setBirthYearState(savedBirth);
    else if (activeId === 'profile') setBirthYearState('1980');
    else setBirthYearState('');

    const savedCccd = localStorage.getItem(`user-cccd-${activeId}`);
    if (savedCccd) setCccdState(savedCccd);
    else if (activeId === 'profile') setCccdState('001080123456');
    else setCccdState('');

    const savedAddress = localStorage.getItem(`user-address-${activeId}`);
    if (savedAddress) setAddressState(savedAddress);
    else if (activeId === 'profile') setAddressState('Vinhomes Ocean Park, Gia Lâm, Hà Nội');
    else setAddressState('');

    const savedBalance = localStorage.getItem(`user-balance-${activeId}`);
    if (savedBalance) setBalanceState(Number(savedBalance));
    else if (activeId === 'profile') setBalanceState(0);
    else setBalanceState(0);

    const savedBank = localStorage.getItem(`user-bank-info-${activeId}`);
    if (savedBank) setBankInfoState(JSON.parse(savedBank));
    else setBankInfoState(null);

    const savedTxs = localStorage.getItem(`user-transactions-${activeId}`);
    if (savedTxs) setTransactionsState(JSON.parse(savedTxs));
    else setTransactionsState([]);

    const savedProfits = localStorage.getItem(`user-profits-${activeId}`);
    if (savedProfits) setProfitsState(JSON.parse(savedProfits));
    else setProfitsState([]);

    const savedBonuses = localStorage.getItem(`user-bonuses-${activeId}`);
    if (savedBonuses) setBonusesState(JSON.parse(savedBonuses));
    else setBonusesState([]);

    const savedDeposits = localStorage.getItem(`user-deposits-list-${activeId}`);
    if (savedDeposits) setDepositsListState(JSON.parse(savedDeposits));
    else setDepositsListState([]);

    const savedPass = localStorage.getItem(`user-password-${activeId}`);
    if (savedPass) setCurrentPassword(savedPass);
    else if (activeId === 'profile') setCurrentPassword('123456');

    const savedWPass = localStorage.getItem(`user-withdrawal-password-${activeId}`);
    if (savedWPass) setCurrentWithdrawalPassword(savedWPass);
    else if (activeId === 'profile') setCurrentWithdrawalPassword('112233');

    const savedIsVerified = localStorage.getItem(`user-is-verified-${activeId}`);
    if (savedIsVerified) setIsIdentityVerifiedState(savedIsVerified === 'true');
    else setIsIdentityVerifiedState(false);

    const savedRole = localStorage.getItem(`user-role-${activeId}`);
    if (savedRole) {
      setRoleState(savedRole as any);
    } else {
      let initialRole = 'user';
      if (activeId === 'leodayroi') {
        initialRole = 'super_admin';
      } else if (activeId === 'admin@gmail.com') {
        initialRole = 'admin';
      }
      setRoleState(initialRole as any);
    }

    // 2. Real-time sub to Firestore
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isLocked && activeId !== 'admin') {
          alert('Tài khoản của bạn đã bị khóa do vi phạm chính sách. Vui lòng liên hệ hỗ trợ.');
          logout();
          return;
        }
        if (data.displayName !== undefined) {
          setDisplayNameState(data.displayName);
          localStorage.setItem(`user-display-name-${activeId}`, data.displayName);
        }
        if (data.role !== undefined) {
          setRoleState(data.role);
          localStorage.setItem(`user-role-${activeId}`, data.role);
        }
        if (data.avatarImage !== undefined) {
          setAvatarImageState(data.avatarImage);
          if (data.avatarImage) localStorage.setItem(`user-avatar-image-${activeId}`, data.avatarImage);
          else localStorage.removeItem(`user-avatar-image-${activeId}`);
        }
        if (data.phoneNumber !== undefined) {
          setPhoneNumberState(data.phoneNumber);
          localStorage.setItem(`user-phone-number-${activeId}`, data.phoneNumber);
        }
        if (data.birthYear !== undefined) {
          setBirthYearState(data.birthYear);
          localStorage.setItem(`user-birth-year-${activeId}`, data.birthYear);
        }
        if (data.cccd !== undefined) {
          setCccdState(data.cccd);
          localStorage.setItem(`user-cccd-${activeId}`, data.cccd);
        }
        if (data.address !== undefined) {
          setAddressState(data.address);
          localStorage.setItem(`user-address-${activeId}`, data.address);
        }
        if (data.balance !== undefined) {
          setBalanceState(data.balance);
          localStorage.setItem(`user-balance-${activeId}`, String(data.balance));
        }
        if (data.lastInterestPaidDate !== undefined) {
          setLastInterestPaidDate(data.lastInterestPaidDate || null);
        }
        if (data.bankInfo !== undefined) {
          setBankInfoState(data.bankInfo);
          if (data.bankInfo) localStorage.setItem(`user-bank-info-${activeId}`, JSON.stringify(data.bankInfo));
          else localStorage.removeItem(`user-bank-info-${activeId}`);
        }
        if (data.transactions !== undefined) {
          setTransactionsState(data.transactions);
          localStorage.setItem(`user-transactions-${activeId}`, JSON.stringify(data.transactions));
        }
        if (data.profits !== undefined) {
          setProfitsState(data.profits);
          localStorage.setItem(`user-profits-${activeId}`, JSON.stringify(data.profits));
        }
        if (data.bonuses !== undefined) {
          setBonusesState(data.bonuses);
          localStorage.setItem(`user-bonuses-${activeId}`, JSON.stringify(data.bonuses));
        }
        if (data.depositsList !== undefined) {
          setDepositsListState(data.depositsList);
          localStorage.setItem(`user-deposits-list-${activeId}`, JSON.stringify(data.depositsList));
        }
        if (data.currentPassword !== undefined) {
          setCurrentPassword(data.currentPassword);
          localStorage.setItem(`user-password-${activeId}`, data.currentPassword);
        }
        if (data.currentWithdrawalPassword !== undefined) {
          setCurrentWithdrawalPassword(data.currentWithdrawalPassword);
          localStorage.setItem(`user-withdrawal-password-${activeId}`, data.currentWithdrawalPassword);
        }
        if (data.passwordChangeLog !== undefined) setPasswordChangeLog(data.passwordChangeLog);
        if (data.withdrawalPasswordChangeLog !== undefined) setWithdrawalPasswordChangeLog(data.withdrawalPasswordChangeLog);
        if (data.isIdentityVerified !== undefined) {
          setIsIdentityVerifiedState(data.isIdentityVerified);
          localStorage.setItem(`user-is-verified-${activeId}`, String(data.isIdentityVerified));
        }
        if (data.kycStatus !== undefined) setKycStatusState(data.kycStatus);
        if (data.kycRejectReason !== undefined) setKycRejectReasonState(data.kycRejectReason);
        if (data.hasReceivedWelcomeVoucher !== undefined) setHasReceivedWelcomeVoucherState(data.hasReceivedWelcomeVoucher);
        if (data.portfolio !== undefined) setPortfolioState(data.portfolio);
        if (data.orderHistory !== undefined) setOrderHistoryState(data.orderHistory);
        if (data.keepNotes !== undefined) setKeepNotesState(data.keepNotes);
      } else {
        // Seed initial values to Firestore
        let seedRole = 'user';
        if (activeId === 'leodayroi') {
          seedRole = 'super_admin';
        } else if (activeId === 'admin@gmail.com') {
          seedRole = 'admin';
        }
        const initialProfile = {
          displayName: activeId === 'profile' ? 'ADMINSG23L' : activeId,
          role: seedRole,
          avatarImage: null,
          phoneNumber: activeId === 'profile' ? '0912345678' : '',
          birthYear: activeId === 'profile' ? '1980' : '',
          cccd: activeId === 'profile' ? '001080123456' : '',
          address: activeId === 'profile' ? 'Vinhomes Ocean Park, Gia Lâm, Hà Nội' : '',
          balance: activeId === 'profile' ? 0 : 0,
          lastInterestPaidDate: null,
          bankInfo: null,
          transactions: [],
          profits: [],
          bonuses: [],
          depositsList: [],
          currentPassword: '123456',
          currentWithdrawalPassword: '112233',
          passwordChangeLog: [],
          withdrawalPasswordChangeLog: [],
          isIdentityVerified: false,
          hasReceivedWelcomeVoucher: false,
          keepNotes: []
        };
        setDoc(docRef, initialProfile).catch(err => {
          const errInfo = {
            error: err instanceof Error ? err.message : String(err),
            authInfo: { userId: activeId },
            operationType: 'write',
            path: `users/${activeId}`
          };
          console.error("Error seeding initial Firestore user profile:", JSON.stringify(errInfo));
        });
      }
    }, (error) => {
      const errInfo = {
        error: error instanceof Error ? error.message : String(error),
        authInfo: { userId: activeId },
        operationType: 'get',
        path: `users/${activeId}`
      };
      console.error('Firestore Error: ', JSON.stringify(errInfo));
    });

    return () => unsubscribe();
  }, [userId]);

  // Real-time listener for System Instructions
  useEffect(() => {
    const systemDocRef = doc(db, 'system', 'instructions');
    const unsubscribeSystem = onSnapshot(systemDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.text !== undefined) {
          setSystemInstructionsState(data.text);
        }
      } else {
        // Seed initial default system instructions
        const defaultText = `1. Lãi xuất 0,6% (tức là khi người dùng có tiền trong hệ thống thì cứ 8h sáng hằng ngày sẽ được hệ thống cộng 0,6 % tổng số tiền mà người dùng đang có . 100,000,000 + 600,000 = 100,600,000 ngày kế tiếp : 100,600,000 + 603,600 = 101,203,600. Hãy tính theo cách này để tính lãi xuất 0,6%).\n2. Chứng khoán VINHOMES 15h00 ngày 25/06/2026 tăng 2,4% trong thời gian 15 phút .`;
        setDoc(systemDocRef, { text: defaultText }).catch(console.error);
        setSystemInstructionsState(defaultText);
      }
    });

    return () => unsubscribeSystem();
  }, []);

  // Real-time listener for CMS
  useEffect(() => {
    const cmsDocRef = doc(db, 'settings', 'cms_data');
    const unsubscribe = onSnapshot(cmsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.news) setCmsNewsState(data.news);
        if (data.banners) setCmsBannersState(data.banners);
        if (data.vinfast) setCmsVinfastState(data.vinfast);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for articles collection
  useEffect(() => {
    const unsubscribeArticles = onSnapshot(collection(db, 'articles'), (snapshot) => {
      const list = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      list.sort((a: any, b: any) => {
        const dateA = a.createdAt || 0;
        const dateB = b.createdAt || 0;
        return dateB - dateA;
      });
      setArticlesList(list);
    }, (error) => {
      console.error("Error listening to articles:", error);
    });
    return () => unsubscribeArticles();
  }, []);

  // Real-time listener for system_directives/global_rules
  useEffect(() => {
    const directivesDocRef = doc(db, 'system_directives', 'global_rules');
    const unsubscribeDirectives = onSnapshot(directivesDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.interest_rate !== undefined) {
          setInterestRateState(Number(data.interest_rate));
          localStorage.setItem('global-interest-rate', String(data.interest_rate));
        }
        if (data.stock_triggers !== undefined) {
          setStockTriggersState(data.stock_triggers || []);
          localStorage.setItem('global-stock-triggers', JSON.stringify(data.stock_triggers || []));
        }
      } else {
        // Seed default directives
        const defaultDirectives = {
          interest_rate: 0.006,
          stock_triggers: [
            {
              symbol: "VINHOMES",
              target_time: "2026-06-25T15:00:00",
              rate: 0.024,
              duration_mins: 15
            }
          ]
        };
        setDoc(directivesDocRef, defaultDirectives).catch((e) => {
          console.warn("Offline warning seeding directives, fallback to local cache:", e);
        });
        setInterestRateState(0.006);
        setStockTriggersState(defaultDirectives.stock_triggers);
      }
    }, (error) => {
      console.warn("Firestore listener interrupted (Offline mode fallback):", error.message || String(error));
    });

    return () => unsubscribeDirectives();
  }, []);

  // System dynamic interest checker and compounder
  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    const hasActiveInvestments = (txs: Transaction[]) => {
      const now = new Date();
      return txs.some(t => {
        if (t.type !== 'invest' || t.status !== 'Thành công') return false;
        
        let durationDays = 15;
        if (t.contractProjectTitle?.includes('VF')) {
          durationDays = 2;
        } else if (t.contractProjectTitle?.includes('Harbour')) {
          durationDays = 5;
        } else if (t.contractProjectTitle?.includes('Island')) {
          durationDays = 10;
        } else if (t.contractProjectTitle?.includes('Giga-Factory')) {
          durationDays = 15;
        } else if (t.contractProjectTitle?.includes('Eco-Retreat')) {
          durationDays = 7;
        } else if (t.contractProjectTitle?.includes('Smart City')) {
          durationDays = 12;
        }
        
        const txTime = t.timestamp ? new Date(t.timestamp) : new Date();
        const diffTime = now.getTime() - txTime.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays < durationDays;
      });
    };

    const getActiveInvestmentsTotal = (txs: Transaction[]) => {
      const now = new Date();
      return txs
        .filter(t => {
          if (t.type !== 'invest' || t.status !== 'Thành công') return false;
          let durationDays = 15;
          if (t.contractProjectTitle?.includes('VF')) {
            durationDays = 2;
          } else if (t.contractProjectTitle?.includes('Harbour')) {
            durationDays = 5;
          } else if (t.contractProjectTitle?.includes('Island')) {
            durationDays = 10;
          } else if (t.contractProjectTitle?.includes('Giga-Factory')) {
            durationDays = 15;
          } else if (t.contractProjectTitle?.includes('Eco-Retreat')) {
            durationDays = 7;
          } else if (t.contractProjectTitle?.includes('Smart City')) {
            durationDays = 12;
          }
          const txTime = t.timestamp ? new Date(t.timestamp) : new Date();
          const diffTime = now.getTime() - txTime.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays < durationDays;
        })
        .reduce((sum, t) => sum + t.amount, 0);
    };

    // Calculate totalDeposit to determine tier
    const totalDeposit = transactions
      .filter(t => t.type === 'deposit' && t.status === 'Thành công')
      .reduce((sum, t) => sum + t.amount, 0);

    let userTier = 'Member';
    if (totalDeposit >= 10000000000) {
      userTier = 'VVIP';
    } else if (totalDeposit >= 5000000000) {
      userTier = 'VIP';
    } else if (totalDeposit >= 1000000000) {
      userTier = 'Gold';
    }

    const checkAndApplyInterest = async () => {
      const activeId = userId;
      const now = new Date();
      let lastPaidStr = lastInterestPaidDate;

      if (!lastPaidStr) {
        // If never paid, set to yesterday so it triggers today
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        lastPaidStr = yesterday.toISOString().split('T')[0];

        try {
          await setDoc(doc(db, 'users', activeId), { lastInterestPaidDate: lastPaidStr }, { merge: true });
        } catch (e) {
          console.error("Error setting initial lastInterestPaidDate:", e);
        }
        return;
      }

      const datesDue = getInterestDatesDue(lastPaidStr, now);
      if (datesDue.length === 0) return;

      let tempBalance = balance;
      const newTxs: Transaction[] = [];
      const newInterestHistory: any[] = [];

      datesDue.sort((a, b) => a.getTime() - b.getTime());

      for (const dueDate of datesDue) {
        // Determine rate & base calculation amount dynamically in loop
        let currentRate = 0.006;
        let currentBase = tempBalance;

        if (userTier === 'Gold' || userTier === 'VIP' || userTier === 'VVIP') {
          currentRate = 0.01;
          const activeInvestmentsTotal = getActiveInvestmentsTotal(transactions);
          currentBase = tempBalance + activeInvestmentsTotal;
        } else {
          if (hasActiveInvestments(transactions)) {
            continue; // Member doesn't get interest on balance if there is an active investment
          }
        }

        const interestAmount = Math.round(currentBase * currentRate);
        if (interestAmount <= 0) continue;

        const balanceBefore = tempBalance;
        tempBalance += interestAmount;
        const balanceAfter = tempBalance;

        const dateStr = dueDate.toISOString();

        newTxs.push({
          id: `interest-${dueDate.getTime()}-${Math.random()}`,
          type: 'profit',
          amount: interestAmount,
          date: dateStr,
          status: 'Thành công',
          contractProjectTitle: `Lãi suất tự động hệ thống ${(currentRate * 100).toFixed(1)}%`
        });

        newInterestHistory.push({
          id: `int-hist-${dueDate.getTime()}-${Math.random()}`,
          amount: interestAmount,
          rate: currentRate,
          balanceBefore,
          balanceAfter,
          date: dateStr
        });
      }

      if (newTxs.length > 0) {
        const nextLastPaidStr = now.toISOString().split('T')[0];
        try {
          const docRef = doc(db, 'users', activeId);
          const snap = await getDoc(docRef);
          const currentTxs = snap.exists() ? (snap.data().transactions || []) : [];
          const currentHistory = snap.exists() ? (snap.data().interest_history || []) : [];

          await setDoc(docRef, {
            balance: tempBalance,
            transactions: [...currentTxs, ...newTxs],
            interest_history: [...currentHistory, ...newInterestHistory],
            lastInterestPaidDate: nextLastPaidStr
          }, { merge: true });

          console.log(`Successfully compounded ${newTxs.length} daily system interest payments.`);
        } catch (e) {
          console.error("Error committing daily interest payments:", e);
        }
      }
    };

    checkAndApplyInterest();

    const interval = setInterval(checkAndApplyInterest, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, userId, interestRate, systemInstructions, balance, lastInterestPaidDate]);

  const handleSetName = async (val: string) => {
    const activeId = userId || 'profile';
    setDisplayNameState(val);
    localStorage.setItem(`user-display-name-${activeId}`, val);
    try {
      await setDoc(doc(db, 'users', activeId), { displayName: val }, { merge: true });
    } catch (e) {
      console.error("Error setting name in Firestore:", e);
    }
  };

  const handleSetPhoneNumber = async (val: string) => {
    const activeId = userId || 'profile';
    setPhoneNumberState(val);
    localStorage.setItem(`user-phone-number-${activeId}`, val);
    try {
      await setDoc(doc(db, 'users', activeId), { phoneNumber: val }, { merge: true });
    } catch (e) {
      console.error("Error setting phone number in Firestore:", e);
    }
  };

  const handleSetBirthYear = async (val: string) => {
    const activeId = userId || 'profile';
    setBirthYearState(val);
    localStorage.setItem(`user-birth-year-${activeId}`, val);
    try {
      await setDoc(doc(db, 'users', activeId), { birthYear: val }, { merge: true });
    } catch (e) {
      console.error("Error setting birth year in Firestore:", e);
    }
  };

  const handleSetCccd = async (val: string) => {
    const activeId = userId || 'profile';
    setCccdState(val);
    localStorage.setItem(`user-cccd-${activeId}`, val);
    try {
      await setDoc(doc(db, 'users', activeId), { cccd: val }, { merge: true });
    } catch (e) {
      console.error("Error setting cccd in Firestore:", e);
    }
  };

  const handleSetAddress = async (val: string) => {
    const activeId = userId || 'profile';
    setAddressState(val);
    localStorage.setItem(`user-address-${activeId}`, val);
    try {
      await setDoc(doc(db, 'users', activeId), { address: val }, { merge: true });
    } catch (e) {
      console.error("Error setting address in Firestore:", e);
    }
  };

  const updateCmsNews = async (news: any[]) => {
    await setDoc(doc(db, 'settings', 'cms_data'), { news }, { merge: true });
    setCmsNewsState(news);
  };
  const updateCmsBanners = async (banners: string[]) => {
    await setDoc(doc(db, 'settings', 'cms_data'), { banners }, { merge: true });
    setCmsBannersState(banners);
  };
  const updateCmsVinfast = async (cars: any[]) => {
    await setDoc(doc(db, 'settings', 'cms_data'), { vinfast: cars }, { merge: true });
    setCmsVinfastState(cars);
  };

  const handleSetAvatar = async (val: string | null) => {
    const activeId = userId || 'profile';
    setAvatarImageState(val);
    if (val) {
      try {
        localStorage.setItem(`user-avatar-image-${activeId}`, val);
      } catch (e) {
        console.error('Storage error', e);
      }
    } else {
      localStorage.removeItem(`user-avatar-image-${activeId}`);
    }
    try {
      await setDoc(doc(db, 'users', activeId), { avatarImage: val }, { merge: true });
    } catch (e) {
      console.error("Error setting avatar in Firestore:", e);
    }
  };

  const handleSetIsIdentityVerified = async (val: boolean) => {
    const activeId = userId || 'profile';
    setIsIdentityVerifiedState(val);
    localStorage.setItem(`user-is-verified-${activeId}`, String(val));
    
    let updates: any = { isIdentityVerified: val };
    if (val && !hasReceivedWelcomeVoucher) {
      setHasReceivedWelcomeVoucherState(true);
      updates.hasReceivedWelcomeVoucher = true;
      updates.balance = balance + 50000;
      setBalanceState(balance + 50000);

      const newTx: Transaction = {
        id: 'welcome-voucher-' + Date.now(),
        type: 'bonus',
        amount: 50000,
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'Thành công',
        note: 'Nhận Welcome Voucher sau khi xác thực tài khoản thành công',
        timestamp: new Date().toISOString()
      };
      
      const updatedTxs = [newTx, ...transactions];
      setTransactionsState(updatedTxs);
      updates.transactions = updatedTxs;
    }

    try {
      await setDoc(doc(db, 'users', activeId), updates, { merge: true });
    } catch (e) {
      console.error("Error setting isIdentityVerified in Firestore:", e);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED') => {
    const updatedProjects = adminProjects.map(p => p.id === projectId ? { ...p, status: newStatus } : p);
    const newLog: AuditLogEntry = {
      id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
      time: new Date().toLocaleString('vi-VN'),
      adminName: displayName,
      action: `Cập nhật dự án ${updatedProjects.find(p => p.id === projectId)?.title} sang ${newStatus}`
    };
    const updatedLog = [newLog, ...auditLog];

    setAdminProjectsState(updatedProjects);
    setAuditLogState(updatedLog);

    try {
      await setDoc(doc(db, 'system', 'project_control'), {
        projects: updatedProjects,
        auditLog: updatedLog
      }, { merge: true });
    } catch (e) {
      console.error("Error updating project status:", e);
    }
  };

  const updateProjectDetails = async (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = adminProjects.map(p => {
      if (p.id === projectId) {
        const merged = { ...p, ...updates };

        // Auto convert fields if value changed
        if (updates.interestRateValue !== undefined) {
          merged.interestRate = `${(updates.interestRateValue * 100).toFixed(1)}%`;
        }
        if (updates.minInvestAmount !== undefined) {
          const num = updates.minInvestAmount;
          if (num >= 1000000000) {
            merged.minAmount = `${(num / 1000000000).toFixed(1)} Tỷ`;
          } else {
            merged.minAmount = `${(num / 1000000).toFixed(0)} Triệu`;
          }
        }
        if (updates.durationDays !== undefined) {
          merged.duration = `${updates.durationDays} ngày`;
        }
        return merged;
      }
      return p;
    });

    const projectTitle = adminProjects.find(p => p.id === projectId)?.title || '';
    const changeLogs: string[] = [];
    if (updates.status !== undefined) changeLogs.push(`trạng thái -> ${updates.status}`);
    if (updates.interestRateValue !== undefined) changeLogs.push(`lãi suất -> ${(updates.interestRateValue * 100).toFixed(1)}%`);
    if (updates.minInvestAmount !== undefined) changeLogs.push(`tối thiểu -> ${updates.minInvestAmount.toLocaleString('vi-VN')} VNĐ`);
    if (updates.title !== undefined) changeLogs.push(`tên -> ${updates.title}`);

    const newLog: AuditLogEntry = {
      id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
      time: new Date().toLocaleString('vi-VN'),
      adminName: displayName,
      action: `Sửa dự án "${projectTitle}": ${changeLogs.join(', ')}`
    };
    const updatedLog = [newLog, ...auditLog];

    setAdminProjectsState(updatedProjects);
    setAuditLogState(updatedLog);

    try {
      await setDoc(doc(db, 'system', 'project_control'), {
        projects: updatedProjects,
        auditLog: updatedLog
      }, { merge: true });
    } catch (e) {
      console.error("Error updating project details:", e);
    }
  };

  const updateAllProjectsStatus = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    const updatedProjects = adminProjects.map(p => ({ ...p, status: newStatus }));
    const newLog: AuditLogEntry = {
      id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
      time: new Date().toLocaleString('vi-VN'),
      adminName: displayName,
      action: `${newStatus === 'ACTIVE' ? 'Mở cửa' : 'Đóng cửa'} TẤT CẢ các dự án đầu tư`
    };
    const updatedLog = [newLog, ...auditLog];

    setAdminProjectsState(updatedProjects);
    setAuditLogState(updatedLog);

    try {
      await setDoc(doc(db, 'system', 'project_control'), {
        projects: updatedProjects,
        auditLog: updatedLog
      }, { merge: true });
    } catch (e) {
      console.error("Error updating all projects status:", e);
    }
  };

  // Real-time listener for standard projects
  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const projectsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            status: data.status || 'ACTIVE',
            ...data
          } as Project;
        });
        projectsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setStandardProjects(projectsData);
      } else {
        import('../data').then(({ projects: localProjects }) => {
          setStandardProjects(localProjects.map(p => ({ ...p, status: 'ACTIVE' })));
        });
      }
    }, (err) => {
      console.error("Error listening to standard projects:", err);
    });
    return () => unsubscribe();
  }, []);

  const updateStandardProjectDetails = async (projectId: string, updates: Partial<Project>) => {
    const projectToUpdate = standardProjects.find(p => p.id === projectId);
    if (!projectToUpdate) return;

    const merged = { ...projectToUpdate, ...updates } as any;

    // Auto convert formatting strings
    if (updates.interestRateValue !== undefined) {
      merged.interestRate = `${(updates.interestRateValue * 100).toFixed(2)} %`;
    }
    if (updates.minInvestAmount !== undefined) {
      const num = updates.minInvestAmount;
      if (num >= 1000000000) {
        merged.minAmount = `${(num / 1000000000).toFixed(1)} Tỷ VNĐ`;
      } else if (num >= 1000000) {
        merged.minAmount = `${(num / 1000000).toFixed(0)}.000.000 VNĐ`;
      } else {
        merged.minAmount = `${num.toLocaleString('vi-VN')} VNĐ`;
      }
    }
    if (updates.durationDays !== undefined) {
      merged.duration = `${updates.durationDays * 1440} phút`;
    }

    const docRef = doc(db, "projects", projectId);
    try {
      await setDoc(docRef, merged, { merge: true });

      const changeLogs: string[] = [];
      if (updates.status !== undefined) changeLogs.push(`trạng thái -> ${updates.status}`);
      if (updates.interestRateValue !== undefined) changeLogs.push(`lãi suất -> ${(updates.interestRateValue * 100).toFixed(2)}%`);
      if (updates.minInvestAmount !== undefined) changeLogs.push(`tối thiểu -> ${updates.minInvestAmount.toLocaleString('vi-VN')} VNĐ`);
      if (updates.title !== undefined) changeLogs.push(`tên -> ${updates.title}`);
      if (updates.progress !== undefined) changeLogs.push(`tiến độ -> ${updates.progress}%`);

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Sửa dự án Vinhomes "${projectToUpdate.title}": ${changeLogs.join(', ')}`
      };

      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);

      await setDoc(doc(db, 'system', 'project_control'), {
        auditLog: updatedLog
      }, { merge: true });
    } catch (e) {
      console.error("Error updating standard project:", e);
      throw e;
    }
  };

  const updateAllStandardProjectsStatus = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    try {
      const batch = writeBatch(db);
      standardProjects.forEach(p => {
        batch.update(doc(db, "projects", p.id), { status: newStatus });
      });
      await batch.commit();

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Bật/Tắt đồng loạt tất cả dự án Vinhomes sang: ${newStatus}`
      };

      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), {
        auditLog: updatedLog
      }, { merge: true });
    } catch (e) {
      console.error("Error toggling all standard projects status:", e);
    }
  };

  // Real-time listener for standard stocks
  useEffect(() => {
    const q = query(collection(db, "stocks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const stocksData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            symbol: doc.id,
            status: data.status || 'ACTIVE',
            ...data
          } as Stock;
        });
        setStandardStocks(stocksData);
      } else {
        import('../data').then(({ stocks: localStocks }) => {
          setStandardStocks(localStocks.map(s => ({ ...s, status: 'ACTIVE' })));
        });
      }
    }, (err) => {
      console.error("Error listening to stocks:", err);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for casino games
  useEffect(() => {
    const q = query(collection(db, "casinoGames"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const gamesData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            status: data.status || 'ACTIVE',
            ...data
          } as CasinoGame;
        });
        gamesData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setCasinoGames(gamesData);
      } else {
        import('../data').then(({ casinoGames: localGames }) => {
          setCasinoGames(localGames.map(g => ({ ...g, status: 'ACTIVE' })));
        });
      }
    }, (err) => {
      console.error("Error listening to casinoGames:", err);
    });
    return () => unsubscribe();
  }, []);

  const updateStockDetails = async (symbol: string, updates: Partial<Stock>) => {
    const docRef = doc(db, "stocks", symbol);
    try {
      await setDoc(docRef, updates, { merge: true });

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Sửa cổ phiếu ${symbol}: ${JSON.stringify(updates)}`
      };
      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), { auditLog: updatedLog }, { merge: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateCasinoGameDetails = async (id: string, updates: Partial<CasinoGame>) => {
    const docRef = doc(db, "casinoGames", id);
    try {
      await setDoc(docRef, updates, { merge: true });

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Sửa game Casino ID ${id}: ${JSON.stringify(updates)}`
      };
      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), { auditLog: updatedLog }, { merge: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateAllStocksStatus = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    try {
      const batch = writeBatch(db);
      standardStocks.forEach(s => {
        batch.update(doc(db, "stocks", s.symbol), { status: newStatus });
      });
      await batch.commit();

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Bật/Tắt đồng loạt tất cả Cổ phiếu sang: ${newStatus}`
      };
      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), { auditLog: updatedLog }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const updateAllCasinoGamesStatus = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    try {
      const batch = writeBatch(db);
      casinoGames.forEach(g => {
        batch.update(doc(db, "casinoGames", g.id), { status: newStatus });
      });
      await batch.commit();

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Bật/Tắt đồng loạt tất cả game Casino sang: ${newStatus}`
      };
      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), { auditLog: updatedLog }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const updateAllVinfastStatus = async (newStatus: 'ACTIVE' | 'CLOSED') => {
    try {
      const updatedCars = cmsVinfast.map(car => ({ ...car, status: newStatus }));
      await setDoc(doc(db, 'settings', 'cms_data'), { vinfast: updatedCars }, { merge: true });
      setCmsVinfastState(updatedCars);

      const newLog: AuditLogEntry = {
        id: 'LG' + Math.floor(Math.random() * 900000 + 100000),
        time: new Date().toLocaleString('vi-VN'),
        adminName: displayName,
        action: `Bật/Tắt đồng loạt tất cả xe VinFast sang: ${newStatus}`
      };
      const updatedLog = [newLog, ...auditLog];
      setAuditLogState(updatedLog);
      await setDoc(doc(db, 'system', 'project_control'), { auditLog: updatedLog }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time listener for Project Control
  useEffect(() => {
    const projectDocRef = doc(db, 'system', 'project_control');
    const unsubscribe = onSnapshot(projectDocRef, (docSnap) => {
      const freshProjects: Project[] = [
        {
          id: '1',
          title: 'Quỹ Phát Triển Thể Dục Thể Thao (Sân Vận Động Trống Đồng)',
          imageUrl: 'https://cdnphoto.dantri.com.vn/2CK2b6vmZ5PsU3RmD6m4QbH50u0=/zoom/1200_630/2025/12/20/svd-trong-dong-cropped-1766216461218.jpg',
          interestRate: '1.5%',
          duration: '6 ngày',
          minAmount: '5.0 Tỷ',
          scale: '40 tỷ USD',
          progress: 96,
          category: 'Vinpearl',
          durationDays: 6,
          minInvestAmount: 5000000000,
          interestRateValue: 0.015,
          status: 'ACTIVE',
          targetCapital: 40000000000000,
          raisedCapital: 38400000000000
        },
        {
          id: '2',
          title: 'Đại đô thị phức hợp Hạ Long Xanh (Quảng Ninh)',
          imageUrl: 'https://vinhomehalongxanh.com.vn/wp-content/uploads/2026/02/Vinhomes-Ha-Long-Xanh-scaled.jpg',
          interestRate: '1.8%',
          duration: '7 ngày',
          minAmount: '1.5 Tỷ',
          scale: '18 tỷ USD',
          progress: 98,
          category: 'Vinhomes',
          durationDays: 7,
          minInvestAmount: 1500000000,
          interestRateValue: 0.018,
          status: 'ACTIVE',
          targetCapital: 18000000000000,
          raisedCapital: 17640000000000
        }
      ];

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.projects) {
          if (data.projects.length !== 2 || data.projects[0]?.title !== 'Quỹ Phát Triển Thể Dục Thể Thao (Sân Vận Động Trống Đồng)' || data.projects[0]?.imageUrl !== 'https://cdnphoto.dantri.com.vn/2CK2b6vmZ5PsU3RmD6m4QbH50u0=/zoom/1200_630/2025/12/20/svd-trong-dong-cropped-1766216461218.jpg') {
            setDoc(projectDocRef, { projects: freshProjects }, { merge: true });
            setAdminProjectsState(freshProjects);
          } else {
            setAdminProjectsState(data.projects);
          }
        } else {
          setDoc(projectDocRef, { projects: freshProjects }, { merge: true });
          setAdminProjectsState(freshProjects);
        }
        if (data.auditLog) setAuditLogState(data.auditLog);
      } else {
        setDoc(projectDocRef, { projects: freshProjects, auditLog: [] });
        setAdminProjectsState(freshProjects);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateUserField = async (field: string, value: any) => {
    const activeId = userId || 'profile';
    try {
      await updateDoc(doc(db, 'users', activeId), { [field]: value });
    } catch (e) {
      console.error(`Error updating field ${field} in Firestore:`, e);
      throw e;
    }
  };

  const placeOrder = async (symbol: string, quantity: number, price: number, type: 'buy' | 'sell') => {
    const activeId = userId || 'profile';
    const totalCost = quantity * price;

    let newBalance = balance;
    let newPortfolio = [...portfolio];

    if (type === 'buy') {
      if (balance < totalCost) return { success: false, message: 'Số dư không đủ.' };
      newBalance = balance - totalCost;
      const existing = newPortfolio.find(p => p.symbol === symbol);
      if (existing) newPortfolio = newPortfolio.map(p => p.symbol === symbol ? { ...p, quantity: p.quantity + quantity } : p);
      else newPortfolio = [...newPortfolio, { symbol, quantity }];
    } else {
      const existing = newPortfolio.find(p => p.symbol === symbol);
      if (!existing || existing.quantity < quantity) return { success: false, message: 'Số lượng cổ phiếu không đủ.' };
      newBalance = balance + totalCost;
      const newQty = existing.quantity - quantity;
      if (newQty === 0) newPortfolio = newPortfolio.filter(p => p.symbol !== symbol);
      else newPortfolio = newPortfolio.map(p => p.symbol === symbol ? { ...p, quantity: newQty } : p);
    }

    const newOrder: Order = {
      id: 'OD' + Math.floor(Math.random() * 900000 + 100000),
      symbol,
      type,
      quantity,
      price,
      status: 'Khớp lệnh',
      date: new Date().toLocaleString('vi-VN'),
    };

    const newOrderHistory = [newOrder, ...orderHistory];

    setBalanceState(newBalance);
    setPortfolioState(newPortfolio);
    setOrderHistoryState(newOrderHistory);

    try {
      await setDoc(doc(db, 'users', activeId), {
        balance: newBalance,
        portfolio: newPortfolio,
        orderHistory: newOrderHistory
      }, { merge: true });
      return { success: true };
    } catch (e) {
      console.error("Error saving order:", e);
      return { success: false, message: 'Lỗi lưu giao dịch.' };
    }
  };

  const setBalance = (val: number | ((prev: number) => number)) => {
    const activeId = userId || 'profile';
    setBalanceState((prev) => {
      const nextVal = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem(`user-balance-${activeId}`, String(nextVal));
      setDoc(doc(db, 'users', activeId), { balance: nextVal }, { merge: true }).catch(console.error);
      return nextVal;
    });
  };

  const setBankInfo = async (val: BankInfo | null) => {
    const activeId = userId || 'profile';
    setBankInfoState(val);
    if (val) {
      localStorage.setItem(`user-bank-info-${activeId}`, JSON.stringify(val));
    } else {
      localStorage.removeItem(`user-bank-info-${activeId}`);
    }
    try {
      await setDoc(doc(db, 'users', activeId), { bankInfo: val }, { merge: true });
    } catch (e) {
      console.error("Error setting bank info in Firestore:", e);
    }
  };

  const updateKeepNotes = async (notes: KeepNote[]) => {
    const activeId = userId || 'profile';
    setKeepNotesState(notes);
    try {
      await setDoc(doc(db, 'users', activeId), { keepNotes: notes }, { merge: true });
    } catch (e) {
      console.error("Error setting keep notes in Firestore:", e);
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'date'>) => {
    const activeId = userId || 'profile';
    const newTx: Transaction = {
      ...tx,
      id: 'TX' + Math.floor(Math.random() * 900000 + 100000),
      date: new Date().toLocaleString('vi-VN'),
    };
    setTransactionsState((prev) => {
      const updated = [newTx, ...prev];
      localStorage.setItem(`user-transactions-${activeId}`, JSON.stringify(updated));
      setDoc(doc(db, 'users', activeId), { transactions: updated }, { merge: true }).catch(console.error);
      return updated;
    });
  };

  const addProfit = (amount: number, description: string) => {
    const activeId = userId || 'profile';
    const newProfit: ProfitRecord = {
      id: 'PF' + Math.floor(Math.random() * 900000 + 100000),
      amount,
      description,
      date: new Date().toLocaleString('vi-VN'),
    };

    let updatedProfits: ProfitRecord[] = [];
    setProfitsState((prev) => {
      updatedProfits = [newProfit, ...prev];
      localStorage.setItem(`user-profits-${activeId}`, JSON.stringify(updatedProfits));
      return updatedProfits;
    });

    setBalanceState((prev) => {
      const nextBalance = prev + amount;
      localStorage.setItem(`user-balance-${activeId}`, String(nextBalance));

      const newTx: Transaction = {
        type: 'profit',
        amount,
        status: 'Thành công',
        id: 'TX' + Math.floor(Math.random() * 900000 + 100000),
        date: new Date().toLocaleString('vi-VN'),
      };

      setTransactionsState((prevTxs) => {
        const updatedTxs = [newTx, ...prevTxs];
        localStorage.setItem(`user-transactions-${activeId}`, JSON.stringify(updatedTxs));

        // Write combined changes to Firestore cleanly to prevent write races
        setDoc(doc(db, 'users', activeId), {
          profits: updatedProfits,
          balance: nextBalance,
          transactions: updatedTxs
        }, { merge: true }).catch(console.error);

        return updatedTxs;
      });

      return nextBalance;
    });
  };

  const addBonus = (amount: number, description: string) => {
    const activeId = userId || 'profile';
    const newBonus: BonusRecord = {
      id: 'BN' + Math.floor(Math.random() * 900000 + 100000),
      amount,
      description,
      date: new Date().toLocaleString('vi-VN'),
    };

    let updatedBonuses: BonusRecord[] = [];
    setBonusesState((prev) => {
      updatedBonuses = [newBonus, ...prev];
      localStorage.setItem(`user-bonuses-${activeId}`, JSON.stringify(updatedBonuses));
      return updatedBonuses;
    });

    setBalanceState((prev) => {
      const nextBalance = prev + amount;
      localStorage.setItem(`user-balance-${activeId}`, String(nextBalance));

      const newTx: Transaction = {
        type: 'bonus',
        amount,
        status: 'Thành công',
        id: 'TX' + Math.floor(Math.random() * 900000 + 100000),
        date: new Date().toLocaleString('vi-VN'),
      };

      setTransactionsState((prevTxs) => {
        const updatedTxs = [newTx, ...prevTxs];
        localStorage.setItem(`user-transactions-${activeId}`, JSON.stringify(updatedTxs));

        // Write combined changes to Firestore cleanly
        setDoc(doc(db, 'users', activeId), {
          bonuses: updatedBonuses,
          balance: nextBalance,
          transactions: updatedTxs
        }, { merge: true }).catch(console.error);

        return updatedTxs;
      });

      return nextBalance;
    });
  };

  const addDepositRecord = (amount: number, note?: string, proofImage?: string) => {
    const activeId = userId || 'profile';
    const txId = 'TX' + Math.floor(Math.random() * 900000 + 100000);
    const newDep: DepositRecord = {
      id: 'DP' + Math.floor(Math.random() * 900000 + 100000),
      amount,
      date: new Date().toLocaleString('vi-VN'),
      status: 'Đang xử lý',
      txId,
      note: note || '',
      proofImage: proofImage || '',
    };

    let updatedDeposits: DepositRecord[] = [];
    setDepositsListState((prev) => {
      updatedDeposits = [newDep, ...prev];
      localStorage.setItem(`user-deposits-list-${activeId}`, JSON.stringify(updatedDeposits));
      return updatedDeposits;
    });

    const newTx: Transaction = {
      type: 'deposit',
      amount,
      status: 'Đang xử lý',
      id: txId,
      date: new Date().toLocaleString('vi-VN'),
      note: note || '',
      proofImage: proofImage || '',
    };

    setTransactionsState((prevTxs) => {
      const updatedTxs = [newTx, ...prevTxs];
      localStorage.setItem(`user-transactions-${activeId}`, JSON.stringify(updatedTxs));

      setDoc(doc(db, 'users', activeId), {
        depositsList: updatedDeposits,
        transactions: updatedTxs
      }, { merge: true }).catch(console.error);

      return updatedTxs;
    });
  };

  const changePassword = (oldP: string, newP: string) => {
    const activeId = userId || 'profile';
    if (oldP === currentPassword) {
      setCurrentPassword(newP);
      localStorage.setItem(`user-password-${activeId}`, newP);

      const newLog = { oldPass: oldP, newPass: newP, date: new Date().toLocaleString('vi-VN') };
      setPasswordChangeLog((prev) => {
        const updated = [newLog, ...prev];
        setDoc(doc(db, 'users', activeId), {
          currentPassword: newP,
          passwordChangeLog: updated
        }, { merge: true }).catch(console.error);
        return updated;
      });
      return true;
    }
    return false;
  };

  const changeWithdrawalPassword = (oldP: string, newP: string) => {
    const activeId = userId || 'profile';
    if (oldP === currentWithdrawalPassword) {
      setCurrentWithdrawalPassword(newP);
      localStorage.setItem(`user-withdrawal-password-${activeId}`, newP);

      const newLog = { oldPass: oldP, newPass: newP, date: new Date().toLocaleString('vi-VN') };
      setWithdrawalPasswordChangeLog((prev) => {
        const updated = [newLog, ...prev];
        setDoc(doc(db, 'users', activeId), {
          currentWithdrawalPassword: newP,
          withdrawalPasswordChangeLog: updated
        }, { merge: true }).catch(console.error);
        return updated;
      });
      return true;
    }
    return false;
  };

  const login = async (emailOrPhone: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const activeId = emailOrPhone;



    if (activeId === 'leodayroi' && password === '121212') {
      localStorage.setItem(`user-display-name-leodayroi`, "Super Admin Leo");
      localStorage.setItem(`user-phone-number-leodayroi`, "leodayroi");
      localStorage.setItem(`user-birth-year-leodayroi`, "15/05/1988");
      localStorage.setItem(`user-cccd-leodayroi`, "001080123456");
      localStorage.setItem(`user-address-leodayroi`, "Vinhomes Riverside, Long Biên, Hà Nội");
      localStorage.setItem(`user-password-leodayroi`, "121212");
      if (!localStorage.getItem(`user-balance-leodayroi`)) {
        localStorage.setItem(`user-balance-leodayroi`, "0");
      }
      localStorage.setItem(`user-withdrawal-password-leodayroi`, "112233");

      try {
        const docRef = doc(db, 'users', 'leodayroi');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName: "Super Admin Leo",
            currentPassword: "121212",
            phoneNumber: "leodayroi",
            birthYear: "15/05/1988",
            cccd: "001080123456",
            address: "Vinhomes Riverside, Long Biên, Hà Nội",
            balance: 0,
            bankInfo: null,
            transactions: [],
            currentWithdrawalPassword: "112233",
            role: 'super_admin'
          });
        }
      } catch (e: any) {
        console.error("Error auto-creating leodayroi:", e);
      }
      setUserId('leodayroi');
      localStorage.setItem('user-current-id', 'leodayroi');
      return { success: true };
    }

    if (activeId === 'admin@gmail.com' && password === '456789') {
      localStorage.setItem(`user-display-name-admin@gmail.com`, "Admin VinClub");
      localStorage.setItem(`user-phone-number-admin@gmail.com`, "admin@gmail.com");
      localStorage.setItem(`user-birth-year-admin@gmail.com`, "01/01/1990");
      localStorage.setItem(`user-cccd-admin@gmail.com`, "001080123457");
      localStorage.setItem(`user-address-admin@gmail.com`, "Vinhomes Riverside, Long Biên, Hà Nội");
      localStorage.setItem(`user-password-admin@gmail.com`, "456789");
      if (!localStorage.getItem(`user-balance-admin@gmail.com`)) {
        localStorage.setItem(`user-balance-admin@gmail.com`, "0");
      }
      localStorage.setItem(`user-withdrawal-password-admin@gmail.com`, "112233");

      try {
        const docRef = doc(db, 'users', 'admin@gmail.com');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            displayName: "Admin VinClub",
            currentPassword: "456789",
            phoneNumber: "admin@gmail.com",
            birthYear: "01/01/1990",
            cccd: "001080123457",
            address: "Vinhomes Riverside, Long Biên, Hà Nội",
            balance: 0,
            bankInfo: null,
            transactions: [],
            currentWithdrawalPassword: "112233",
            role: 'admin'
          });
        }
      } catch (e: any) {
        console.error("Error auto-creating admin@gmail.com:", e);
      }
      setUserId('admin@gmail.com');
      localStorage.setItem('user-current-id', 'admin@gmail.com');
      return { success: true };
    }

    if (activeId === 'testvin' && password === '121212') {
      // Pre-populate localStorage to ensure immediate offline-first success
      localStorage.setItem(`user-display-name-testvin`, "Hội viên Thử nghiệm");
      localStorage.setItem(`user-phone-number-testvin`, "testvin");
      localStorage.setItem(`user-birth-year-testvin`, "20/12/1995");
      localStorage.setItem(`user-cccd-testvin`, "031090123456");
      localStorage.setItem(`user-address-testvin`, "Vinhomes Ocean Park, Gia Lâm, Hà Nội");
      localStorage.setItem(`user-password-testvin`, "121212");
      if (!localStorage.getItem(`user-balance-testvin`)) {
        localStorage.setItem(`user-balance-testvin`, "0");
      }
      localStorage.setItem(`user-withdrawal-password-testvin`, "112233");

      try {
        const docRef = doc(db, 'users', 'testvin');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          // Auto create test user
          await setDoc(docRef, {
            displayName: "Hội viên Thử nghiệm",
            currentPassword: "121212",
            phoneNumber: "testvin",
            birthYear: "20/12/1995",
            cccd: "031090123456",
            address: "Vinhomes Ocean Park, Gia Lâm, Hà Nội",
            balance: 0,
            bankInfo: null,
            transactions: [],
            currentWithdrawalPassword: "112233",
          });
        }
      } catch (e: any) {
        const isOffline = e?.message?.includes('offline') || !navigator.onLine;
        if (isOffline) {
          console.warn("Client offline while auto-creating testvin: Proceeding with offline-first localStorage cache.");
        } else {
          console.error("Error auto-creating testvin:", e);
        }
      }
      setUserId('testvin');
      localStorage.setItem('user-current-id', 'testvin');
      return { success: true };
    }

    try {
      const docRef = doc(db, 'users', activeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.currentPassword === password) {
          setUserId(activeId);
          localStorage.setItem('user-current-id', activeId);
          return { success: true };
        } else {
          return { success: false, message: 'Mật khẩu không chính xác.' };
        }
      } else {
        // Local cache fallback check for custom accounts registered offline
        const localSavedPass = localStorage.getItem(`user-password-${activeId}`);
        if (localSavedPass && localSavedPass === password) {
          setUserId(activeId);
          localStorage.setItem('user-current-id', activeId);
          return { success: true };
        }
        return { success: false, message: 'Tài khoản chưa được đăng ký. Vui lòng đăng ký.' };
      }
    } catch (e: any) {
      const isOffline = e?.message?.includes('offline') || !navigator.onLine;
      if (isOffline) {
        console.warn("Client offline during login: Proceeding with offline-first localStorage cache.");
      } else {
        console.error("Login error:", e);
      }

      // Offline mode local cache authentication fallback
      const localSavedPass = localStorage.getItem(`user-password-${activeId}`);
      if (localSavedPass) {
        if (localSavedPass === password) {
          setUserId(activeId);
          localStorage.setItem('user-current-id', activeId);
          return { success: true };
        } else {
          return { success: false, message: 'Mật khẩu không chính xác (Chế độ Ngoại tuyến).' };
        }
      }

      return { success: false, message: 'Lỗi kết nối database: ' + (e.message || String(e)) };
    }
  };

  const register = async (emailOrPhone: string, password: string, lastName: string, firstName: string, referralCode?: string): Promise<{ success: boolean; message?: string }> => {
    const activeId = emailOrPhone;
    try {
      const docRef = doc(db, 'users', activeId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: false, message: 'Tài khoản này đã tồn tại.' };
      } else {
        const displayName = `${lastName} ${firstName}`.trim() || activeId;
        const initialProfile = {
          displayName,
          avatarImage: null,
          phoneNumber: emailOrPhone,
          birthYear: '',
          cccd: '',
          address: '',
          balance: 0,
          bankInfo: null,
          transactions: [],
          profits: [],
          bonuses: [],
          depositsList: [],
          currentPassword: password,
          currentWithdrawalPassword: '112233',
          passwordChangeLog: [],
          withdrawalPasswordChangeLog: [],
          referralCode: referralCode || ''
        };
        await setDoc(docRef, initialProfile);

        // Populate local storage values
        localStorage.setItem(`user-display-name-${activeId}`, displayName);
        localStorage.setItem(`user-phone-number-${activeId}`, emailOrPhone);
        localStorage.setItem(`user-birth-year-${activeId}`, '');
        localStorage.setItem(`user-cccd-${activeId}`, '');
        localStorage.setItem(`user-address-${activeId}`, '');
        localStorage.setItem(`user-password-${activeId}`, password);
        localStorage.setItem(`user-balance-${activeId}`, '0');
        localStorage.setItem(`user-withdrawal-password-${activeId}`, '112233');
        localStorage.setItem(`user-transactions-${activeId}`, '[]');
        localStorage.setItem(`user-profits-${activeId}`, '[]');
        localStorage.setItem(`user-bonuses-${activeId}`, '[]');
        localStorage.setItem(`user-deposits-list-${activeId}`, '[]');

        setDisplayNameState(displayName);
        setAvatarImageState(null);
        setPhoneNumberState(emailOrPhone);
        setBirthYearState('');
        setCccdState('');
        setAddressState('');
        setBalanceState(0);
        setBankInfoState(null);
        setTransactionsState([]);
        setProfitsState([]);
        setBonusesState([]);
        setDepositsListState([]);
        setCurrentPassword(password);
        setCurrentWithdrawalPassword('112233');

        setUserId(activeId);
        localStorage.setItem('user-current-id', activeId);
        return { success: true };
      }
    } catch (e: any) {
      const isOffline = e?.message?.includes('offline') || !navigator.onLine;
      if (isOffline) {
        console.warn("Client offline during registration: Proceeding with offline-first localStorage cache.");
      } else {
        console.error("Registration error:", e);
      }

      // Offline registration logic
      const localSavedPass = localStorage.getItem(`user-password-${activeId}`);
      if (localSavedPass) {
        return { success: false, message: 'Tài khoản này đã tồn tại.' };
      }

      // Offline mode registration fallback in localStorage
      const displayName = `${lastName} ${firstName}`.trim() || activeId;
      localStorage.setItem(`user-display-name-${activeId}`, displayName);
      localStorage.setItem(`user-phone-number-${activeId}`, emailOrPhone);
      localStorage.setItem(`user-birth-year-${activeId}`, '');
      localStorage.setItem(`user-cccd-${activeId}`, '');
      localStorage.setItem(`user-address-${activeId}`, '');
      localStorage.setItem(`user-password-${activeId}`, password);
      localStorage.setItem(`user-balance-${activeId}`, '0');
      localStorage.setItem(`user-withdrawal-password-${activeId}`, '112233');
      localStorage.setItem(`user-transactions-${activeId}`, '[]');
      localStorage.setItem(`user-profits-${activeId}`, '[]');
      localStorage.setItem(`user-bonuses-${activeId}`, '[]');
      localStorage.setItem(`user-deposits-list-${activeId}`, '[]');

      setDisplayNameState(displayName);
      setAvatarImageState(null);
      setPhoneNumberState(emailOrPhone);
      setBirthYearState('');
      setCccdState('');
      setAddressState('');
      setBalanceState(0);
      setBankInfoState(null);
      setTransactionsState([]);
      setProfitsState([]);
      setBonusesState([]);
      setDepositsListState([]);
      setCurrentPassword(password);
      setCurrentWithdrawalPassword('112233');

      setUserId(activeId);
      localStorage.setItem('user-current-id', activeId);
      return { success: true };
    }
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('user-current-id');
    setDisplayNameState('ADMINSG23L');
    setAvatarImageState(null);
    setPhoneNumberState('');
    setBirthYearState('');
    setCccdState('');
    setAddressState('');
    setBalanceState(0);
    setBankInfoState(null);
    setTransactionsState([]);
    setProfitsState([]);
    setBonusesState([]);
    setDepositsListState([]);
  };

  const updateSystemInstructions = async (text: string) => {
    try {
      const systemDocRef = doc(db, 'system', 'instructions');
      await setDoc(systemDocRef, { text }, { merge: true });
      setSystemInstructionsState(text);
    } catch (e) {
      console.error("Error saving system instructions to Firestore:", e);
    }
  };

  const updateSystemDirectives = async (rate: number, triggers: any[]) => {
    // Save to local state and localStorage immediately (Offline-First)
    setInterestRateState(rate);
    setStockTriggersState(triggers);
    localStorage.setItem('global-interest-rate', String(rate));
    localStorage.setItem('global-stock-triggers', JSON.stringify(triggers));

    try {
      const directivesDocRef = doc(db, 'system_directives', 'global_rules');
      await setDoc(directivesDocRef, {
        interest_rate: rate,
        stock_triggers: triggers
      }, { merge: true });
    } catch (e: any) {
      console.warn("Firestore write error during offline/network state (will auto-sync when online):", e.message || String(e));
    }
  };

  const getAdjustedStocks = (baseStocks: Stock[]): Stock[] => {
    const now = new Date();

    // First, map over base stocks and adjust using the structured stockTriggers array
    return baseStocks.map(stock => {
      // Find matching rule from stockTriggers config
      const matchingTrigger = stockTriggers.find(trigger => {
        const triggerSymbol = trigger.symbol ? trigger.symbol.toUpperCase() : '';
        return (
          stock.symbol.toUpperCase() === triggerSymbol ||
          stock.name.toUpperCase().includes(triggerSymbol)
        );
      });

      if (matchingTrigger) {
        const isActive = matchingTrigger.active !== false;
        if (isActive) {
          const type = matchingTrigger.type || 'pump';
          const percentage = matchingTrigger.percentage !== undefined ? matchingTrigger.percentage : (matchingTrigger.rate !== undefined ? matchingTrigger.rate : 0.024);

          // If there is a target time, only trigger if within active time window
          const targetTimeStr = matchingTrigger.target_time || '';
          let isTimeActive = true;
          if (targetTimeStr) {
            const startDate = new Date(targetTimeStr);
            const durationMins = matchingTrigger.duration_mins || 15;
            const endDate = new Date(startDate.getTime() + durationMins * 60 * 1000);
            isTimeActive = now >= startDate && now <= endDate;
          }

          if (isTimeActive || forceActiveStockRules) {
            if (type === 'pump') {
              const multiplier = 1 + percentage;
              const newPrice = Math.round(stock.price * multiplier);
              const addedChange = Math.round(stock.price * percentage);
              const newChange = stock.change + addedChange;
              const denominator = (newPrice - newChange) || 1;
              const newPercent = Number((newChange / denominator * 100).toFixed(2));
              return {
                ...stock,
                price: newPrice,
                change: newChange,
                changePercent: newPercent,
              };
            } else if (type === 'dump') {
              const multiplier = 1 - percentage;
              const newPrice = Math.round(stock.price * multiplier);
              const subtractedChange = Math.round(stock.price * percentage);
              const newChange = stock.change - subtractedChange;
              const denominator = (newPrice - newChange) || 1;
              const newPercent = Number((newChange / denominator * 100).toFixed(2));
              return {
                ...stock,
                price: newPrice,
                change: newChange,
                changePercent: newPercent,
              };
            } else if (type === 'freeze') {
              return {
                ...stock,
                change: 0,
                changePercent: 0,
              };
            }
          }
        }
      }

      // Fallback: check legacy text systemInstructions parsing
      if (systemInstructions) {
        const rules = parseStockInstructions(systemInstructions);
        const matchingRule = rules.find(rule => {
          const searchStr = rule.stockNameOrSymbol.toUpperCase();
          return (
            stock.symbol.toUpperCase() === searchStr ||
            stock.name.toUpperCase().includes(searchStr)
          );
        });

        if (matchingRule) {
          const startDate = parseInstructionDate(matchingRule.dateStr, matchingRule.timeStr);
          const endDate = new Date(startDate.getTime() + matchingRule.durationMin * 60 * 1000);

          const isTimeActive = now >= startDate && now <= endDate;
          const isRuleActive = isTimeActive || forceActiveStockRules;

          if (isRuleActive) {
            const multiplier = matchingRule.changeType === 'tăng'
              ? (1 + matchingRule.percent / 100)
              : (1 - matchingRule.percent / 100);

            const newPrice = Math.round(stock.price * multiplier);
            const addedChange = matchingRule.changeType === 'tăng'
              ? Math.round(stock.price * (matchingRule.percent / 100))
              : -Math.round(stock.price * (matchingRule.percent / 100));

            const baseChange = stock.change;
            const newChange = baseChange + addedChange;
            const denominator = (newPrice - newChange) || 1;
            const newPercent = Number((newChange / denominator * 100).toFixed(2));

            return {
              ...stock,
              price: newPrice,
              change: newChange,
              changePercent: newPercent,
            };
          }
        }
      }

      return stock;
    });
  };

  return (
    <UserContext.Provider value={{
      displayName,
      setDisplayName: handleSetName,
      avatarImage,
      setAvatarImage: handleSetAvatar,
      phoneNumber,
      setPhoneNumber: handleSetPhoneNumber,
      birthYear,
      setBirthYear: handleSetBirthYear,
      cccd,
      setCccd: handleSetCccd,
      address,
      setAddress: handleSetAddress,
      balance,
      setBalance,
      bankInfo,
      setBankInfo,
      transactions,
      addTransaction,
      profits,
      addProfit,
      bonuses,
      addBonus,
      depositsList,
      addDepositRecord,
      passwordChangeLog,
      changePassword,
      withdrawalPasswordChangeLog,
      changeWithdrawalPassword,
      isLoggedIn,
      userId,
      login,
      register,
      logout,
      systemInstructions,
      updateSystemInstructions,
      getAdjustedStocks,
      forceActiveStockRules,
      setForceActiveStockRules,
      interestRate,
      stockTriggers,
      updateSystemDirectives,
      isIdentityVerified: isIdentityVerifiedState,
      kycStatus: kycStatusState,
      kycRejectReason: kycRejectReasonState,
      setIsIdentityVerified: handleSetIsIdentityVerified,
      updateUserField: handleUpdateUserField,
      role,
      cmsNews,
      cmsBanners,
      cmsVinfast,
      articlesList,
      updateCmsNews,
      updateCmsBanners,
      updateCmsVinfast,
      adminProjects,
      standardProjects,
      standardStocks,
      casinoGames,
      auditLog,
      updateProjectStatus,
      updateProjectDetails,
      updateAllProjectsStatus,
      updateStandardProjectDetails,
      updateAllStandardProjectsStatus,
      updateStockDetails,
      updateCasinoGameDetails,
      updateAllStocksStatus,
      updateAllCasinoGamesStatus,
      updateAllVinfastStatus,
      portfolio,
      orderHistory,
      placeOrder,
      keepNotes,
      updateKeepNotes,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
