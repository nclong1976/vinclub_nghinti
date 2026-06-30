import React, { useContext, useState } from 'react';
import { ArrowLeft, Percent, Car, CheckCircle2, Headset, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { UserContext } from './UserContext';
import ProjectCard from './ProjectCard';
import InvestmentModal from './InvestmentModal';
import { Project } from '../types';

interface WelfareMedicalViewProps {
  onBack: () => void;
}

export default function WelfareMedicalView({ onBack }: WelfareMedicalViewProps) {
  const { standardProjects } = useContext(UserContext);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const medicalProjects = standardProjects.filter(p => p.category === 'Y TẾ');

  return (
    <div className="flex-1 bg-[#f7f9fb] text-[#001839] antialiased overflow-y-auto scrollbar-hide pb-28">
      {/* TopAppBar */}
      <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#001839]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] tracking-tight">Chăm sóc sức khỏe</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </header>
      
      <main className="max-w-[1280px] mx-auto px-4 mt-4">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-xl overflow-hidden mb-8 border border-[#e0e3e5] shadow-sm"
        >
          <div className="w-full h-48 md:h-80 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoOsTlWGJPBFJl-ZB_lnTITwu98TJ8jCRHtDrSD2PvkrHhrkI-rqagIHbIOTOLod_YuaNZY-5dL9TW4Jc21ZSEp2mQM4kOK5uqGT3wzaY7XdJXqBfVsWAw1CCi88z4IJkuS6PSgR_w_57Sal_3gTuVBe9NzjXOI7vj4qT1N5ISOppsZvg8qjoncvba9EEwgk1OBsPIvCjE-sB5TgMdT-mGcQbUCFOjnk8xtHcacI6z8oDcm0bY3-FK5mjpA2p2A2ktfS47ti32ai4')"}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/90 via-[#001839]/40 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-white text-[#b8860b] font-['Plus_Jakarta_Sans'] text-[11px] font-bold tracking-wider px-2 py-1 rounded-sm shadow-sm">ĐẶC QUYỀN VIP</span>
            </div>
            <h2 className="font-['Montserrat'] text-[24px] md:text-[32px] font-semibold text-white leading-tight">Sức khỏe toàn diện</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-white/90 mt-1">Dịch vụ y tế đẳng cấp quốc tế Vinmec dành riêng cho đối tác.</p>
          </div>
        </motion.section>

        {/* Dynamic Investment Projects */}
        {medicalProjects.length > 0 && (
          <section className="mb-8 bg-zinc-950 p-5 rounded-2xl border border-[#ebd5ad]/20 text-white">
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#ebd5ad] mb-1 uppercase tracking-wide">Quỹ Đầu Tư Y Tế & Chăm Sóc Sức Khỏe</h3>
            <p className="text-[11px] text-zinc-400 mb-5 font-['Plus_Jakarta_Sans']">Đặc quyền đầu tư sinh lời cùng hệ sinh thái y tế quốc tế Vinmec</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalProjects.map(project => (
                <ProjectCard key={project.id} project={project} onInvest={() => setSelectedProject(project)} />
              ))}
            </div>
          </section>
        )}

        {/* Ưu đãi đặc quyền */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-xl flex items-start gap-4 border-l-4 border-l-[#b8860b] border-y border-r border-[#e0e3e5] shadow-sm"
          >
            <div className="p-3 bg-[#fcfaf5] text-[#b8860b] rounded-full flex-shrink-0">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] mb-1">Giảm trực tiếp 30%</h3>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] leading-relaxed">Áp dụng cho tất cả các dịch vụ khám chữa bệnh nội trú và ngoại trú tại hệ thống bệnh viện Vinmec trên toàn quốc.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-5 rounded-xl flex items-start gap-4 border-l-4 border-l-[#b8860b] border-y border-r border-[#e0e3e5] shadow-sm"
          >
            <div className="p-3 bg-[#fcfaf5] text-[#b8860b] rounded-full flex-shrink-0">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] mb-1">Đưa đón miễn phí</h3>
              <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] leading-relaxed">Trải nghiệm dịch vụ di chuyển cao cấp bằng xe điện VinFast, áp dụng 2 chiều từ nhà đến bệnh viện và ngược lại.</p>
            </div>
          </motion.div>
        </section>

        {/* Các gói khám */}
        <section className="mb-8">
          <h2 className="font-['Montserrat'] text-[20px] font-semibold text-[#001839] mb-4">Gói khám chuyên sâu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Gói 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-[#ebd5ad] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="h-40 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANhQM1bN8pFWoEyo1DSECOIv9QYLEJyUN44QohyY2StLDDCFiXVMYvSgWSSM6VfY6-xVSB8wFsY3jSlGYpSOpFFihOUUmkMhQXvzQ_o4F-g6FB2T9SD0BQm8F0iby3Sy4J-Wf1edGIZSxkr2-fKkzxXtbbtR1heUWHJO5nkPCkw8lT5HHTF_-JfLlmTnt2IRYgrftUiGQMX_gqBdebraEu5ng7XMeTkRzwbVwhOHZNdIdXCo7BZLllHF8rFnr651-ZPRvianxJm-E')"}}></div>
              <div className="p-5 flex flex-col flex-grow bg-white z-10">
                <div className="flex-grow">
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] mb-2">Gói Diamond cho cả gia đình</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 leading-relaxed">Giải pháp bảo vệ sức khỏe toàn diện cho mọi thành viên, bao gồm tầm soát ung thư sớm và tư vấn dinh dưỡng chuyên biệt.</p>
                  <ul className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] space-y-2 mb-6">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Khám tổng quát định kỳ</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Nha khoa cao cấp</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-[#001839] text-white rounded-lg hover:bg-[#002c5f] transition-colors font-['Plus_Jakarta_Sans'] text-[14px] font-bold">Xem chi tiết</button>
              </div>
            </motion.div>

            {/* Gói 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-[#ebd5ad] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 relative flex flex-col group"
            >
              <div className="absolute top-4 right-4 bg-[#ba1a1a] text-white font-['Plus_Jakarta_Sans'] text-[10px] font-bold tracking-wider px-2.5 py-1 rounded shadow-sm z-20">MỚI</div>
              <div className="h-40 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500 z-10" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuASbbCuO5yqK3ApHl23p4ArbDtTN-hDV4T62Yq6jafme8ZFjrq9N6Rsk16z9y-L16hSOmhO-QyjJmk2eggVeD4kKrih4Kq-biux48Knytkup9HeqgF87FsfT17JmeEnPAkN5sI0qPaUJcouL7N5zTflV_8MccB0typOQAGwAy7zZT42lviLzVnOaFXQh8edm0WaOaZH7XUKeKe6AWteShvp2-Y8Atbu82PLqpbVGfkyrueiNlfFF4adfAdP5495tbascCrSEDXRss8')"}}></div>
              <div className="p-5 flex flex-col flex-grow bg-white z-10">
                <div className="flex-grow">
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] mb-2">Tầm soát sức khỏe bằng AI</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 leading-relaxed">Ứng dụng trí tuệ nhân tạo trong phân tích hình ảnh y khoa, phát hiện sớm các nguy cơ tiềm ẩn với độ chính xác cao.</p>
                  <ul className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] space-y-2 mb-6">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Chụp MRI toàn thân</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Phân tích gen chuyên sâu</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-[#001839] text-white rounded-lg hover:bg-[#002c5f] transition-colors font-['Plus_Jakarta_Sans'] text-[14px] font-bold">Xem chi tiết</button>
              </div>
            </motion.div>

            {/* Gói 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white border border-[#ebd5ad] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              <div className="h-40 bg-cover bg-center shrink-0 group-hover:scale-105 transition-transform duration-500" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDMkoqoRo54a3yPLj2oBIPqwkpb51li2nFQJpME1pk9N21v5kPAuWXTu6DWYlOsOIdfokuNMlcHuSLm7EBhGKGei82l_p6SoIzCWMnsgYUGQsSBFwTiMa1o6JiyZK3yH65dqTL62IJz_rsNWQZXQ47eA4HhKAmzFf42CYGSN_bS_uLxKEKtgRhOkR_dzDOwGao3uuElzvj_wZ6C4OFn433Ekfe1i0wvIy0W0R9sglvvRMWDeVzSSvAXMeF1XySLDSICtL4MqXvh4vg')"}}></div>
              <div className="p-5 flex flex-col flex-grow bg-white z-10">
                <div className="flex-grow">
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#001839] mb-2">Đặc quyền sinh con cấp cao</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] mb-4 leading-relaxed">Trải nghiệm nghỉ dưỡng chuẩn 5 sao trong quá trình vượt cạn, với đội ngũ chuyên gia sản khoa hàng đầu túc trực 24/7.</p>
                  <ul className="font-['Plus_Jakarta_Sans'] text-[13px] text-[#334155] space-y-2 mb-6">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Phòng suite sang trọng</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-[16px] h-[16px] text-[#00875A]" /> Chăm sóc mẹ và bé 24/7</li>
                  </ul>
                </div>
                <button className="w-full py-2.5 bg-[#001839] text-white rounded-lg hover:bg-[#002c5f] transition-colors font-['Plus_Jakarta_Sans'] text-[14px] font-bold">Xem chi tiết</button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Actions */}
        <section className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
          <button className="w-full md:w-auto px-8 py-3 border border-[#001839] text-[#001839] font-['Plus_Jakarta_Sans'] text-[14px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-black/5 transition-colors">
            <Headset className="w-5 h-5" />
            Liên hệ tư vấn
          </button>
          <button className="w-full md:w-auto px-8 py-3 bg-[#001839] text-white font-['Plus_Jakarta_Sans'] text-[14px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#002c5f] transition-colors shadow-md">
            <Calendar className="w-5 h-5" />
            Đặt lịch khám
          </button>
        </section>
      </main>

      {selectedProject && (
        <InvestmentModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
