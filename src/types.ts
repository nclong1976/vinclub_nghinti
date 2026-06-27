import { LucideIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export interface GridItem {
  id: string;
  title: string;
  icon?: LucideIcon;
  imageUrl?: string;
}

export interface NavItem {
  id: string;
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface Project {
  id: string;
  title: string;
  imageUrl: string;
  interestRate: string;
  duration: string;
  minAmount: string;
  scale: string;
  progress: number;
  category: string;
  durationDays: number;
  minInvestAmount: number;
  interestRateValue: number;
  status?: 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';
  targetCapital?: number;
  raisedCapital?: number;
}

export interface AuditLogEntry {
  id: string;
  time: string;
  adminName: string;
  action: string;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  status?: 'ACTIVE' | 'CLOSED';
  winMode?: boolean;
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
}

export interface Order {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  status: 'Khớp lệnh' | 'Chờ khớp' | 'Đã hủy';
  date: string;
}

export interface CasinoGame {
  id: string;
  title: string;
  imageUrl: string;
  status?: 'ACTIVE' | 'CLOSED';
  payoutRatio?: '1:1' | '1:1.2' | '1:1.5';
  schedule?: string[];
}

export interface ChartDataPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'privilege' | 'event' | 'system' | 'news' | 'promotion';
  date: string;
  createdAt: number;
  isRead?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  gateway: string;
  createdAt: Timestamp;
  expiredAt?: Timestamp;
  processedBy?: string;
  processedAt?: Timestamp;
  note?: string;
}


