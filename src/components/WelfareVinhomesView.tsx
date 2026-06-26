import React, { useState } from 'react';
import { ArrowLeft, Home, Percent, Award, ShieldCheck, ChevronRight, MapPin, Star, Sparkles, X, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface WelfareVinhomesViewProps {
  onBack: () => void;
}

export default function WelfareVinhomesView({ onBack }: WelfareVinhomesViewProps) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const vinhomesProjects = [
    {
      id: 'vh-royal-island',
      title: 'Vinhomes Royal Island',
      location: 'Vũ Yên, Hải Phòng',
      description: 'Đảo hoàng gia đầu tiên tại Việt Nam sở hữu sân golf 36 hố, bến du thuyền cao cấp và học viện cưỡi ngựa đẳng cấp quốc tế.',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800',
      highlights: ['Sân golf 36 hố', 'Bến du thuyền', 'Học viện cưỡi ngựa']
    },
    {
      id: 'vh-ocean-park-1',
      title: 'Vinhomes Ocean Park 1',
      location: 'Gia Lâm, Hà Nội',
      description: 'Đại đô thị "Thành phố biển hồ" với biển hồ nước mặn 6.1 ha và hồ ngọc trai cát trắng 24.5 ha rộng lớn.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      highlights: ['Biển hồ nước mặn', 'Hồ ngọc trai', 'Bãi cát trắng']
    },
    {
      id: 'vh-ocean-park-2',
      title: 'Vinhomes Ocean Park 2',
      location: 'Văn Giang, Hưng Yên',
      description: 'Siêu quần thể đô thị biển quy mô 458 ha với tổ hợp công viên nước tạo sóng Wave Park lớn nhất thế giới.',
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800',
      highlights: ['Royal Wave Park', 'Công viên sóng', 'Đại lộ Kinh Đô']
    },
    {
      id: 'vh-ocean-park-3',
      title: 'Vinhomes Ocean Park 3',
      location: 'Văn Giang, Hưng Yên',
      description: 'Vịnh biển thượng lưu sở hữu hồ nước mặn bốn mùa trong nhà, công viên sóng biển khổng lồ đẳng cấp.',
      image: 'https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=800',
      highlights: ['Vịnh biển 4 mùa', 'Hồ bơi nước mặn', 'Vịnh Tây Ban Nha']
    },
    {
      id: 'vh-grand-park',
      title: 'Vinhomes Grand Park',
      location: 'Quận 9, TP. HCM',
      description: 'Đại đô thị thông minh đẳng cấp quốc tế tại trung tâm mới của TP.HCM sở hữu đại công viên 36 ha.',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800',
      highlights: ['Công viên 36 ha', 'Đô thị thông minh', 'The Rainbow']
    },
    {
      id: 'vh-smart-city',
      title: 'Vinhomes Smart City',
      location: 'Nam Từ Liêm, Hà Nội',
      description: 'Đô thị thông minh năng động phong cách Singapore tại cửa ngõ phía Tây thủ đô với kết nối AI toàn diện.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      highlights: ['Vườn Nhật 6.1 ha', 'An ninh AI', 'Smart Home']
    },
    {
      id: 'vh-golden-river',
      title: 'Vinhomes Golden River',
      location: 'Ba Son, Quận 1, TP. HCM',
      description: 'Khu đô thị sinh thái ven sông siêu sang trọng bậc nhất Sài Gòn tọa lạc tại mảnh đất Ba Son lịch sử.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800',
      highlights: ['Vị trí Quận 1', 'Sát ga Metro', 'Bến du thuyền Ba Son']
    },
    {
      id: 'vh-central-park',
      title: 'Vinhomes Central Park',
      location: 'Bình Thạnh, TP. HCM',
      description: 'Lấy cảm hứng từ Central Park New York với tòa tháp cao nhất Việt Nam Landmark 81 sừng sững.',
      image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800',
      highlights: ['Landmark 81', 'Công viên ven sông', 'Biệt thự biệt lập']
    },
    {
      id: 'vh-riverside',
      title: 'Vinhomes Riverside',
      location: 'Long Biên, Hà Nội',
      description: 'Khu đô thị sinh thái biệt thự ven sông mang đậm phong cách Venice sang trọng, thanh bình và an ninh nghiêm ngặt.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800',
      highlights: ['Kênh đào sinh thái', 'Phong cách Venice', 'Clubhouse cao cấp']
    },
    {
      id: 'vh-times-city',
      title: 'Vinhomes Times City',
      location: 'Hai Bà Trưng, Hà Nội',
      description: 'Khu đô thị kiểu mẫu với thủy cung hiện đại Vinpearl, nhạc nước hoành tráng và bệnh viện Vinmec cao cấp.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800',
      highlights: ['Thủy cung hiện đại', 'Nhạc nước quảng trường', 'Vinschool liên cấp']
    },
    {
      id: 'vh-royal-city',
      title: 'Vinhomes Royal City',
      location: 'Thanh Xuân, Hà Nội',
      description: '"Thành phố hoàng gia" mang phong cách kiến trúc châu Âu cổ điển quý phái với quảng trường rộng lớn.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
      highlights: ['Kiến trúc Hoàng Gia', 'Sân băng trong nhà', 'Royal Mega Mall']
    }
  ];

  const handleRegister = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedProject(null);
    }, 2500);
  };

  return (
    <div className="flex-1 bg-[#f7f9fb] text-[#001839] antialiased overflow-y-auto scrollbar-hide pb-28">
      {/* TopAppBar */}
      <header className="sticky top-0 left-0 w-full z-40 flex justify-between items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#001839] cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] tracking-tight">Đặc quyền Vinhomes</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </header>

      {/* Main Content */}
      <main className="pt-6 px-4 max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#001839] rounded-2xl p-6 relative overflow-hidden shadow-md border border-[#ebd5ad]/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider rounded shadow-sm mb-3">ĐẦU TƯ BĐS</span>
            <h2 className="font-['Montserrat'] text-[24px] md:text-[32px] font-bold text-white mb-2 leading-tight">Ưu đãi lên đến 30%</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/80 mb-6 max-w-[240px] leading-relaxed">Dành riêng cho thành viên VIP khi mua các sản phẩm Bất động sản Vinhomes.</p>
            <button className="bg-[#ebd5ad] text-[#001839] px-6 py-2.5 rounded-lg font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-md hover:bg-[#d8c39b] transition-colors cursor-pointer">
              Đăng ký tư vấn
            </button>
          </div>
        </motion.section>

        {/* Benefits Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-['Montserrat'] text-[18px] font-semibold text-[#001839] mb-4">Chi tiết đặc quyền</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center text-[#b8860b] mb-3">
                <Percent className="w-6 h-6" />
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#001839] mb-1">Chiết khấu trực tiếp</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] leading-relaxed">Lên tới 30% giá trị sản phẩm</p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center text-[#b8860b] mb-3">
                <Home className="w-6 h-6" />
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#001839] mb-1">Quỹ căn đẹp nhất</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] leading-relaxed">Ưu tiên chọn căn góc, view đẹp</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center text-[#b8860b] mb-3">
                <Award className="w-6 h-6" />
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#001839] mb-1">Tặng gói nội thất</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] leading-relaxed">Gói thiết kế thi công cao cấp</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#e0e3e5] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center text-[#b8860b] mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#001839] mb-1">Hỗ trợ lãi suất</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[12px] text-[#334155] leading-relaxed">0% trong 24 tháng đầu tiên</p>
            </div>
          </div>
        </motion.section>

        {/* All Vinhomes Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-['Montserrat'] text-[18px] font-semibold text-[#001839]">Danh sách tất cả dự án ({vinhomesProjects.length})</h3>
            <span className="text-[#b8860b] font-['Plus_Jakarta_Sans'] text-xs font-bold tracking-wider flex items-center bg-[#fcfaf5] border border-[#ebd5ad]/30 px-3 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#b8860b] fill-[#b8860b]" /> ĐẲNG CẤP THƯỢNG LƯU
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vinhomesProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSubmitted(false);
                  setSelectedProject(project);
                }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-[#ebd5ad]/40 transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="aspect-[16/10] w-full relative bg-gray-100 overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm flex items-center text-[10px] font-bold text-[#001839]">
                    <MapPin className="w-3 h-3 text-[#b8860b] mr-1" /> {project.location.split(',')[1] || project.location}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] group-hover:text-[#b8860b] transition-colors mb-1.5 line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="font-['Plus_Jakarta_Sans'] text-[12.5px] text-[#475569] leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.highlights.slice(0, 2).map((h, i) => (
                      <span key={i} className="bg-[#fcfaf5] border border-[#ebd5ad]/20 text-[#b8860b] text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
                        {h}
                      </span>
                    ))}
                    {project.highlights.length > 2 && (
                      <span className="bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        +{project.highlights.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-gray-100 flex flex-col relative max-h-[90vh]"
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="aspect-[16/10] w-full relative shrink-0">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <span className="text-[#ebd5ad] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-[#ebd5ad] fill-[#ebd5ad]" /> DỰ ÁN CAO CẤP
                </span>
                <h3 className="font-['Montserrat'] text-[20px] font-bold text-white leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-white/80 font-['Plus_Jakarta_Sans'] text-xs flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ebd5ad]" /> {selectedProject.location}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-['Montserrat'] text-base font-bold text-[#001839]">Đăng ký thành công!</h4>
                  <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#475569] max-w-[280px] leading-relaxed">
                    Chuyên viên Vinhomes VIP sẽ chuẩn bị hồ sơ bảng giá độc quyền và liên hệ tới quý khách trong giây lát.
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-[#334155] font-['Plus_Jakarta_Sans'] text-[13.5px] leading-relaxed">
                    {selectedProject.description}
                  </p>
                  <div>
                    <h4 className="font-['Montserrat'] text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Đặc điểm nổi bật</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.highlights.map((h: string, i: number) => (
                        <span key={i} className="bg-[#fcfaf5] border border-[#ebd5ad]/30 text-[#b8860b] text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                          <Star className="w-3 h-3 text-[#b8860b] fill-[#b8860b]" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex gap-3 shrink-0">
                    <button 
                      onClick={handleRegister}
                      className="flex-1 bg-[#001839] text-white py-2.5 rounded-xl font-['Plus_Jakarta_Sans'] text-[13px] font-bold shadow-md hover:bg-[#002859] transition-all cursor-pointer text-center"
                    >
                      Nhận bảng giá VIP độc quyền
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
