import React, { useContext, useState } from 'react';
import { ArrowLeft, GraduationCap, Sparkles, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { UserContext } from './UserContext';
import ProjectCard from './ProjectCard';
import InvestmentModal from './InvestmentModal';
import { Project } from '../types';

interface WelfareEducationViewProps {
  onBack: () => void;
}

export default function WelfareEducationView({ onBack }: WelfareEducationViewProps) {
  const { standardProjects } = useContext(UserContext);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const educationProjects = standardProjects.filter(p => p.category === 'GIÁO DỤC');

  return (
    <div className="flex-1 bg-[#f7f9fb] text-[#001839] antialiased overflow-y-auto scrollbar-hide pb-28">
      {/* TopAppBar */}
      <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#e0e3e5]">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-black/5 transition-colors text-[#001839]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-['Montserrat'] text-[20px] font-bold text-[#001839] tracking-tight">Ưu đãi Giáo dục</h1>
        <div className="w-10 h-10 -mr-2"></div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-[#e0e3e5]">
            <img 
              alt="Môi trường giáo dục hiện đại" 
              className="object-cover w-full h-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBAtIa_tJOMfXm4C3SjBnD6mGxqOVdjfphuqVA3svFRWl1IM-FvekfBSaJvtSv1JlJdrGX3OeG9O0bBzqAulbWsNVGsztIHkZW1AoTN4yihJED_qgM30qn4ufpW9mgaycC0u4gtIxKHoGXrZJMyCfS9FvbCoLnzkuAHV81zkLrm5fKO4tbubfRSSlS2ZXnoZCIWqQ13_p915dKLqIPGW9ktNGVdhi-_EBCEzRx5ZnPRgG2RRfL-DLq2Q0RBwAqZ1h2PvZofZFqXq0" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001839]/90 via-[#001839]/40 to-transparent flex items-end p-6">
              <div>
                <h2 className="font-['Montserrat'] text-[24px] md:text-[32px] font-semibold text-white leading-tight">Đầu tư cho tương lai</h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-white/90 mt-2 max-w-2xl">Đặc quyền giáo dục đẳng cấp quốc tế Vinschool & VinUni dành riêng cho đối tác.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Dynamic Investment Projects */}
        {educationProjects.length > 0 && (
          <section className="mb-8 bg-zinc-950 p-5 rounded-2xl border border-[#ebd5ad]/20 text-white">
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#ebd5ad] mb-1 uppercase tracking-wide">Quỹ Hỗ Trợ Phát Triển Giáo Dục</h3>
            <p className="text-[11px] text-zinc-400 mb-5 font-['Plus_Jakarta_Sans']">Đặc quyền đầu tư sinh lời cùng hệ thống giáo dục liên cấp Vinschool & VinUni</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationProjects.map(project => (
                <ProjectCard key={project.id} project={project} onInvest={() => setSelectedProject(project)} />
              ))}
            </div>
          </section>
        )}

        {/* Benefits Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
          {/* Benefit 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#e0e3e5] rounded-xl p-6 hover:shadow-md hover:border-[#b8860b] transition-all duration-300 group flex flex-col"
          >
            <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#b8860b] transition-colors">
              <GraduationCap className="w-6 h-6 text-[#b8860b] group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-semibold leading-tight text-[#001839] mb-2">Giảm 15% học phí Vinschool</h3>
            <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#334155] flex-grow leading-relaxed">Áp dụng cho toàn bộ các cấp học từ mầm non đến trung học phổ thông, duy trì trong suốt thời gian tham gia.</p>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#e0e3e5] rounded-xl p-6 hover:shadow-md hover:border-[#b8860b] transition-all duration-300 group flex flex-col md:col-span-2"
          >
            <div className="w-12 h-12 bg-[#fcfaf5] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#b8860b] transition-colors">
              <Sparkles className="w-6 h-6 text-[#b8860b] group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-semibold leading-tight text-[#001839] mb-2">Ưu đãi xét tuyển tại VinUni</h3>
            <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#334155] flex-grow mb-4 leading-relaxed">Miễn phí 100% lệ phí hồ sơ xét tuyển và ưu tiên phỏng vấn trực tiếp với hội đồng tuyển sinh dành cho con em khách hàng VIP.</p>
            <div className="mt-auto h-[140px] rounded-lg overflow-hidden relative border border-[#e0e3e5]">
              <img 
                alt="VinUni Admission" 
                className="object-cover w-full h-full" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASD31rkKU7j4UIlRfoBiqiLkqVB2IjSj-U4Opb5s557CHiEEZBZGFQawH4cRroC81lf68V-CqGnoJW1zBFxa98QuZCIBsV0c9OPFClV1TXoFb3jUKk7VdE7zyx0MZQ4UJn0aL6rBchknh1N5Gx1eguzNc4-pDaFvC7eSGWVnwY71LGVOyXyho5r1Br97s1Y7H8sqdB4TGKvpPQAz6yAMrKK7jeYDBOs0W3Xn9wdpvy2uKX2uknUZ8CFX80rcsDe63hpLS1KjkfLc0" 
              />
            </div>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#e0e3e5] rounded-xl p-6 hover:shadow-md hover:border-[#b8860b] transition-all duration-300 group flex flex-col md:col-span-3"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-14 h-14 shrink-0 bg-[#fcfaf5] rounded-full flex items-center justify-center group-hover:bg-[#b8860b] transition-colors">
                <MessageCircle className="w-7 h-7 text-[#b8860b] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-[18px] font-semibold leading-tight text-[#001839] mb-2">Tư vấn hướng nghiệp chuyên sâu 1-1</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#334155] leading-relaxed">Đội ngũ chuyên gia giáo dục hàng đầu từ hệ thống VinUni sẽ đồng hành cùng học sinh trong việc xây dựng lộ trình học tập, chuẩn bị hồ sơ du học và định hướng nghề nghiệp.</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {selectedProject && (
        <InvestmentModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
