import {
  Gift,
  Briefcase,
  Trophy,
  Building2,
  BarChart3,
  Aperture,
  TrendingUp,
  Home,
  User,
  MessageSquare,
  Car,
} from 'lucide-react';
import { GridItem, NavItem, Project, Stock, ChartDataPoint, CasinoGame } from './types';
import casinoIcon from './assets/images/regenerated_image_1782385981323.png';
import vinfastIcon from './assets/images/regenerated_image_1782386390511.png';

// DATA CONFIGURATION
// To change an icon to an image, simply remove the `icon` property
// and add an `imageUrl` property with the URL to your image.
// Example: { id: '4', title: 'Casino', imageUrl: 'https://example.com/casino.png' }

export const gridItems: GridItem[] = [
  { id: '1', title: 'Tham vấn phúc lợi', icon: Gift },
  { id: '2', title: 'Ưu đãi phúc lợi', icon: Briefcase },
  { id: '3', title: 'Mục tiêu', icon: Trophy },
  { id: '4', title: 'Casino', imageUrl: casinoIcon },
  { id: '5', title: 'Vinpearl', imageUrl: 'https://inviva.vn/wp-content/uploads/2026/04/logo-vinpearl-vector-01.png' },
  { id: '6', title: 'Lý do nên đầu tư', icon: BarChart3 },
  { id: '7', title: 'Vòng quay may mắn', icon: Aperture },
  { id: '8', title: 'Vinfast', imageUrl: vinfastIcon },
  { id: '9', title: 'Đầu tư chứng khoán', icon: TrendingUp },
];

export const navItems: NavItem[] = [
  { id: 'home', title: 'Trang chủ', icon: Home, isActive: true },
  { id: 'profile', title: 'Cá nhân', icon: User },
  { id: 'cskh', title: 'Cskh', icon: MessageSquare },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Quỹ Phát Triển Giáo Dục Liên Cấp',
    imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRh9K9ANh6TGQNolVDZNsaJkjP7IHeP2xxkltwr5sdSpFZwjVTN',
    interestRate: '1.10 %',
    duration: '7200 phút',
    minAmount: '5.000.000 VNĐ',
    scale: '500.000.000 VNĐ',
    progress: 96,
    category: 'GIÁO DỤC',
    durationDays: 5,
    minInvestAmount: 5000000,
    interestRateValue: 0.011,
  },
  {
    id: '2',
    title: 'Quỹ Phát Triển Y Tế & Chăm Sóc Sức Khỏe',
    imageUrl: 'https://upload.urbox.vn/strapi/Gallery_Vinmec_1_6ec1560ff5.jpg',
    interestRate: '1.40 %',
    duration: '8640 phút',
    minAmount: '30.000.000 VNĐ',
    scale: '10.300.000.000 VNĐ',
    progress: 97,
    category: 'Y TẾ',
    durationDays: 6,
    minInvestAmount: 30000000,
    interestRateValue: 0.014,
  },
  {
    id: '3',
    title: 'Quỹ Phát Triển Thương Mại Dịch Vụ Cao Cấp',
    imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR9VWZp2ZkEBoVCekapmQLJc_8WK7E4oqaxBMIF2DHXJLITywjz',
    interestRate: '1.65 %',
    duration: '10080 phút',
    minAmount: '100.000.000 VNĐ',
    scale: '15.950.000.000 VNĐ',
    progress: 93,
    category: 'THƯƠNG MẠI',
    durationDays: 7,
    minInvestAmount: 100000000,
    interestRateValue: 0.0165,
  },
  {
    id: '4',
    title: 'Quỹ Phát Triển Công Nghệ Công Nghiệp',
    imageUrl: 'https://vcc.com.vn/upload_images/images/projects/2024/10/09/medium/Vinfast-770-500.webp',
    interestRate: '1.95 %',
    duration: '11520 phút',
    minAmount: '300.000.000 VNĐ',
    scale: '21.600.000.000 VNĐ',
    progress: 94,
    category: 'CÔNG NGHỆ',
    durationDays: 8,
    minInvestAmount: 300000000,
    interestRateValue: 0.0195,
  },
  {
    id: '5',
    title: 'Quỹ Phát Triển Thể Dục Thể Thao (Sân Vận Động Trống Đồng)',
    imageUrl: 'https://i.ex-cdn.com/vietnamfinance.vn/files/news/2025/12/14/trong-dong-0132.jpg',
    interestRate: '2.00 %',
    duration: '12960 phút',
    minAmount: '500.000.000 VNĐ',
    scale: '36.200.000.000 VNĐ',
    progress: 95,
    category: 'THỂ THAO',
    durationDays: 9,
    minInvestAmount: 500000000,
    interestRateValue: 0.02,
  }
];

export const stocks: Stock[] = [
  { symbol: 'VIC', name: 'VINGROUP', price: 85500, change: -1500, changePercent: -1.72, volume: '2.5M VIC' },
  { symbol: 'VHM', name: 'VINHOMES', price: 42300, change: 500, changePercent: 1.20, volume: '1.2M VHM' },
  { symbol: 'VRE', name: 'VINCOM RETAIL', price: 23100, change: -200, changePercent: -0.86, volume: '800K VRE' },
  { symbol: 'VPL', name: 'VINPEARL', price: 56000, change: 1200, changePercent: 2.19, volume: '400K VPL' },
  { symbol: 'VFS', name: 'VINFAST', price: 125000, change: -3500, changePercent: -2.72, volume: '5.1M VFS' },
];

export const casinoGames: CasinoGame[] = [
  { id: '1', title: 'Bài Cào', imageUrl: 'https://images.unsplash.com/photo-1592398191627-25b41eeaa398?q=80&w=500&auto=format&fit=crop' },
  { id: '2', title: 'Tiger Baccarat', imageUrl: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=500&auto=format&fit=crop' },
  { id: '3', title: 'Baccarat Long Hổ', imageUrl: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?q=80&w=500&auto=format&fit=crop' },
  { id: '4', title: "Xì Tố Texas Hold 'em", imageUrl: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=500&auto=format&fit=crop' },
  { id: '5', title: 'Xì Tố Ba Lá', imageUrl: 'https://images.unsplash.com/photo-1592398191627-25b41eeaa398?q=80&w=500&auto=format&fit=crop' },
  { id: '6', title: 'Xì Tố Nga', imageUrl: 'https://images.unsplash.com/photo-1509478861672-91e9a2f90c04?q=80&w=500&auto=format&fit=crop' },
  { id: '7', title: 'Xì Dách', imageUrl: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?q=80&w=500&auto=format&fit=crop' },
  { id: '8', title: 'Niu Niu Poker', imageUrl: 'https://images.unsplash.com/photo-1517232115160-ff93364542dd?q=80&w=500&auto=format&fit=crop' },
  { id: '9', title: 'Caribbean Stud Poker', imageUrl: 'https://images.unsplash.com/photo-1655159428752-c700435e9983?q=80&w=500&auto=format&fit=crop' },
  { id: '10', title: 'Xúc Xắc', imageUrl: 'https://images.unsplash.com/photo-1626775238053-4315516eedc9?q=80&w=500&auto=format&fit=crop' },
  { id: '11', title: 'Slots', imageUrl: 'https://images.unsplash.com/photo-1518895312237-a9e23508077d?q=80&w=500&auto=format&fit=crop' },
  { id: '12', title: 'Cò Quay', imageUrl: 'https://images.unsplash.com/photo-1627831389670-d20f5a01c536?q=80&w=500&auto=format&fit=crop' },
];

export const generateMockChartData = (basePrice: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let currentPrice = basePrice;
  for (let i = 0; i < 40; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.02);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
    data.push({
      time: `${i}`,
      open,
      high,
      low,
      close
    });
    currentPrice = close;
  }
  return data;
};

