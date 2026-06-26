import React, { useState, useContext } from 'react';
import { ArrowLeft, Bell, MapPin, Building2, Wallet, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { UserContext } from './UserContext';
import ContractPreviewModal from './ContractPreviewModal';

interface VinpearlProjectDetailViewProps {
  projectId?: string;
  onBack: () => void;
  onInvest: () => void;
}

export default function VinpearlProjectDetailView({ projectId, onBack, onInvest }: VinpearlProjectDetailViewProps) {
  const { adminProjects } = useContext(UserContext);
  const [showContract, setShowContract] = useState(false);

  // Look up the selected project, or default to the first project in adminProjects
  const project = adminProjects.find(p => p.id === projectId) || adminProjects[0];

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f7f9fb] text-gray-500">
        Đang tải dữ liệu dự án...
      </div>
    );
  }

  // Set localized locations
  const getProjectLocation = (title: string) => {
    if (title.includes('Harbour')) return 'Nha Trang, Việt Nam';
    if (title.includes('Royal')) return 'Vũ Yên, Hải Phòng, Việt Nam';
    if (title.includes('Giga-Factory')) return 'Cát Hải, Hải Phòng, Việt Nam';
    if (title.includes('Eco-Retreat')) return 'Phú Quốc, Kiên Giang, Việt Nam';
    if (title.includes('Smart City Hub')) return 'Hà Nội & TP. Hồ Chí Minh, Việt Nam';
    return 'Việt Nam';
  };

  const getProjectDescription = (title: string) => {
    if (title.includes('Harbour')) {
      return 'Vinpearl Harbour Nha Trang là siêu quần thể nghỉ dưỡng, vui chơi giải trí và thương mại dịch vụ mang tầm quốc tế. Nằm tại vị trí đắc địa trên Vịnh Nha Trang, dự án hứa hẹn mang lại dòng tiền ổn định và tiềm năng tăng giá vốn vượt trội trong trung và dài hạn. Đây là cơ hội hiếm có để các nhà đầu tư tham gia vào một hệ sinh thái đã được kiểm chứng về hiệu quả hoạt động và năng lực quản lý từ tập đoàn.';
    }
    if (title.includes('Royal')) {
      return 'Vinhomes Royal Island (Đảo Hoàng Gia) tại Vũ Yên, Hải Phòng là dự án đại đô thị đảo nghỉ dưỡng sinh thái sang trọng bậc nhất Việt Nam. Với các đặc quyền thượng lưu như bến du thuyền cá nhân, sân golf 36 hố và học viện cưỡi ngựa hoàng gia, dự án kiến tạo chuẩn mực sống đỉnh cao mới.';
    }
    if (title.includes('Giga-Factory')) {
      return 'Tổ hợp siêu nhà máy sản xuất pin và lắp ráp xe điện thông minh VinFast toàn cầu. Đây là dự án hạ tầng công nghệ trọng điểm của tập đoàn phục vụ chiến lược xuất khẩu toàn cầu sang thị trường Bắc Mỹ và Châu Âu, đem lại dòng tiền bền vững và biên lợi nhuận cực kỳ hấp dẫn.';
    }
    if (title.includes('Eco-Retreat')) {
      return 'Khu nghỉ dưỡng sinh thái bảo tồn thiên nhiên và phục hồi sức khỏe cao cấp tại các vùng vịnh hoang sơ. Thiết kế xanh 100% sử dụng vật liệu tự nhiên kết hợp công nghệ xử lý tuần hoàn rác thải thông minh và năng lượng mặt trời, đem đến đặc quyền nghỉ mát sinh thái thượng lưu.';
    }
    if (title.includes('Smart City Hub')) {
      return 'Mạng lưới trạm sạc siêu nhanh và trung tâm dịch vụ xe điện thông minh tích hợp AI trên khắp các đại lộ huyết mạch cả nước, đón đầu xu thế chuyển dịch năng lượng xanh toàn cầu, mở ra đặc quyền đầu tư sinh lời vượt bậc từ doanh thu hạ tầng xanh.';
    }
    return 'Dự án đầu tư phát triển bất động sản nghỉ dưỡng và hạ tầng công nghệ thuộc hệ sinh thái Vingroup. Cam kết lợi nhuận hấp dẫn cùng các đặc quyền ưu đãi vượt trội dành riêng cho các cổ đông và nhà đầu tư chiến lược.';
  };

  const targetCapital = project.targetCapital || 35000000000000;
  const raisedCapital = project.raisedCapital || (targetCapital * (project.progress / 100));
  const remainingCapital = targetCapital - raisedCapital;

  const formatCapital = (val: number) => {
    return (val / 10**9).toLocaleString('vi-VN') + ' Tỷ';
  };

  const formatMinAmount = (val: string) => {
    return val.endsWith('VNĐ') ? val : `${val} VNĐ`;
  };

  return (
    <div className="bg-[#f7f9fb] text-[#001839] font-['Plus_Jakarta_Sans'] antialiased flex flex-col h-full relative overflow-y-auto">
      {/* TopAppBar */}
      <header className="bg-white text-[#001839] font-['Montserrat'] sticky top-0 w-full z-50 flex items-center justify-between px-4 py-4 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-sm shrink-0">
        <button onClick={onBack} className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <ArrowLeft className="w-6 h-6 text-[#001839]" />
        </button>
        <h1 className="font-bold text-[20px]">Chi tiết Đầu tư</h1>
        <button className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <Bell className="w-6 h-6 text-[#001839]" />
        </button>
      </header>
      
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 py-4 flex flex-col gap-6 flex-1">
        {/* Hero Section */}
        <section className="relative rounded-xl overflow-hidden shadow-md">
          {project.imageUrl ? (
            <img 
              className="w-full h-64 md:h-[400px] object-cover" 
              alt={project.title} 
              src={project.imageUrl}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-64 md:h-[400px] bg-gray-200 flex items-center justify-center text-gray-400">
              <Building2 className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/85 to-transparent flex flex-col justify-end p-4 md:p-8">
            <span className="inline-block bg-[#C49A6C] text-white font-bold text-[11px] tracking-wider uppercase px-3 py-1 rounded-sm w-fit mb-2">SIÊU DỰ ÁN</span>
            <h2 className="font-['Montserrat'] text-[24px] md:text-[32px] font-bold text-white mb-2 leading-tight">{project.title}</h2>
            <div className="flex items-center text-[#E2E8F0] gap-1.5">
              <MapPin className="w-4 h-4 text-[#C49A6C]" />
              <span className="text-[14px] font-medium">{getProjectLocation(project.title)}</span>
            </div>
          </div>
        </section>

        {/* Tiến độ huy động */}
        <section className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h3 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] mb-1">Tiến độ huy động</h3>
              <p className="text-[14px] text-[#475569]">Mục tiêu: <span className="font-bold text-[#001839]">{project.scale || formatCapital(targetCapital)} VNĐ</span></p>
            </div>
            <div className="text-right">
              <span className="font-['Montserrat'] text-[28px] text-[#001839] font-bold block leading-none">{project.progress}%</span>
            </div>
          </div>
          <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#001839] rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-3 text-[13px] font-medium text-[#475569]">
            <span>Đã đạt: {formatCapital(raisedCapital)} VNĐ</span>
            <span>Còn lại: {formatCapital(remainingCapital)} VNĐ</span>
          </div>
        </section>

        {/* Thông tin tài chính (Grid) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] flex flex-col gap-1.5">
            <Building2 className="w-5 h-5 text-[#C49A6C] mb-1" />
            <span className="text-[13px] text-[#475569] font-medium">Quy mô dự án</span>
            <span className="font-['Montserrat'] text-[18px] md:text-[20px] font-bold text-[#001839]">
              {project.scale ? project.scale.replace(' VNĐ', '') : formatCapital(targetCapital)}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] flex flex-col gap-1.5">
            <Wallet className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-[13px] text-[#475569] font-medium">Vốn đã góp</span>
            <span className="font-['Montserrat'] text-[18px] md:text-[20px] font-bold text-[#001839]">
              {formatCapital(raisedCapital)}
            </span>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] flex flex-col gap-1.5">
            <TrendingUp className="w-5 h-5 text-[#C49A6C] mb-1" />
            <span className="text-[13px] text-[#475569] font-medium">Cần huy động</span>
            <span className="font-['Montserrat'] text-[18px] md:text-[20px] font-bold text-[#001839]">
              {formatCapital(remainingCapital)}
            </span>
          </div>
          <div className="bg-amber-50/50 rounded-xl p-4 border border-[#C49A6C] border-dashed flex flex-col gap-1.5">
            <DollarSign className="w-5 h-5 text-[#C49A6C] mb-1" />
            <span className="text-[13px] text-[#C49A6C] font-semibold">Đầu tư tối thiểu</span>
            <span className="font-['Montserrat'] text-[18px] md:text-[20px] font-bold text-[#C49A6C]">
              {project.minAmount}
            </span>
          </div>
        </section>

        {/* Mô tả dự án */}
        <section className="bg-white rounded-xl p-5 border border-[#E2E8F0]">
          <h3 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C49A6C]" />
            Tổng quan Dự án
          </h3>
          <p className="text-[15px] text-[#475569] leading-relaxed">
            {getProjectDescription(project.title)}
          </p>
        </section>
      </main>

      {/* CTA Section */}
      <div className="shrink-0 w-full p-4 bg-white border-t border-[#E2E8F0] z-40" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="hidden md:block flex-1">
            <p className="text-[13px] text-[#475569] font-medium">Mức đầu tư tối thiểu</p>
            <p className="font-['Montserrat'] text-[22px] font-bold text-[#C49A6C]">{formatMinAmount(project.minAmount)}</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <button 
              onClick={() => setShowContract(true)}
              className="flex-1 md:flex-none bg-white text-[#001839] border border-[#E2E8F0] text-[13px] font-bold py-3.5 px-4 rounded-lg hover:bg-gray-50 transition-colors active:scale-95 duration-200 uppercase"
            >
              Xem hợp đồng
            </button>
            <button 
              onClick={() => setShowContract(true)}
              className="flex-1 md:flex-none bg-white text-[#C49A6C] border border-[#C49A6C] text-[13px] font-bold py-3.5 px-4 rounded-lg hover:bg-amber-50/30 transition-colors active:scale-95 duration-200 uppercase"
            >
              Ký điện tử
            </button>
            <button 
              onClick={onInvest}
              className="flex-1 md:flex-none bg-[#001839] text-white text-[13px] font-bold py-3.5 px-6 rounded-lg hover:bg-[#002c5f] transition-all shadow-[0_4px_12px_rgba(0,24,57,0.15)] active:scale-95 duration-200 uppercase"
            >
              Đầu tư ngay
            </button>
          </div>
        </div>
      </div>

      {showContract && (
        <ContractPreviewModal project={project} onClose={() => setShowContract(false)} />
      )}
    </div>
  );
}
