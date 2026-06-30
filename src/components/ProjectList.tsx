import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import ProjectCard from './ProjectCard';
import InvestmentModal from './InvestmentModal';
import { ChevronLeft } from 'lucide-react';
import { Project } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function ProjectList({ onBack }: { onBack: () => void }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  useEffect(() => {
    const allowedCategories = ['Vinhomes', 'Y TẾ', 'GIÁO DỤC', 'THƯƠNG MẠI', 'CÔNG NGHỆ'];
    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to local data if empty
        import('../data').then(({ projects: localProjects }) => {
          setProjects(localProjects.filter((p: any) => allowedCategories.includes(p.category)));
          setLoading(false);
        });
        return;
      }
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      projectsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setProjects(projectsData.filter(p => allowedCategories.includes(p.category)));
      setLoading(false);
    }, (error) => {
      console.error("Error listening to projects:", error);
      // Fallback to local data on error
      import('../data').then(({ projects: localProjects }) => {
        setProjects(localProjects.filter((p: any) => allowedCategories.includes(p.category)));
        setLoading(false);
      });
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    return () => unsubscribe();
  }, []);

  const displayedProjects = activeCategory === 'Tất cả'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] relative">
      {/* Header for Project List */}
      <div className="bg-[#0f0f0f] px-4 py-4 flex items-center gap-2 sticky top-0 z-20 shadow-lg border-b border-zinc-900/80 shrink-0">
        <button 
          onClick={onBack} 
          className="p-1 -ml-1 hover:bg-zinc-900/50 rounded-full transition-colors active:scale-95 text-[#c29b57]"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex-1 text-center pr-6">
          <h2 className="text-[14px] sm:text-[16px] font-bold text-[#ebd5ad] tracking-widest uppercase">DANH MỤC DỰ ÁN ĐẦU TƯ</h2>
          <p className="text-[9px] text-zinc-500 font-medium tracking-wider">Đặc quyền sinh lời từ cộng đồng VinClub</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-4 py-3 bg-[#0c0c0c] border-b border-zinc-900/80 overflow-x-auto scrollbar-hide shrink-0">
        {['Tất cả', 'Vinhomes', 'Y TẾ', 'GIÁO DỤC', 'THƯƠNG MẠI', 'CÔNG NGHỆ'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedProjectId(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-[#c29b57] text-black border-[#c29b57] shadow-md shadow-[#c29b57]/15'
                : 'bg-zinc-900 text-zinc-450 border-zinc-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 pb-40 scrollbar-hide space-y-3">
        {loading ? (
          <div className="py-12 text-center text-zinc-500 font-sans text-xs">Đang tải danh sách dự án...</div>
        ) : displayedProjects.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-sans text-xs">Không có dự án nào trong mục này.</div>
        ) : (
          displayedProjects.map(project => {
            const isExpanded = expandedProjectId === project.id;
            return (
              <div key={project.id} className="bg-zinc-900/25 border border-zinc-850 rounded-2xl overflow-hidden transition-all duration-300">
                {isExpanded ? (
                  <div>
                    {/* Collapsible Header */}
                    <div 
                      onClick={() => setExpandedProjectId(null)}
                      className="p-3 bg-zinc-950/60 border-b border-zinc-850 flex justify-between items-center cursor-pointer select-none"
                    >
                      <span className="text-[10px] font-bold text-[#c29b57] uppercase tracking-widest">{project.category}</span>
                      <span className="text-[10.5px] text-zinc-500 font-bold hover:text-zinc-300">Thu gọn ▲</span>
                    </div>
                    {/* Full Card */}
                    <ProjectCard project={project} onInvest={() => setSelectedProject(project)} />
                  </div>
                ) : (
                  /* Compact View */
                  <div 
                    onClick={() => setExpandedProjectId(project.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-850/20 active:scale-[0.99] transition-all select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={project.imageUrl || "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?q=80&w=200"} 
                        alt={project.title} 
                        className="w-11 h-11 object-cover rounded-xl border border-zinc-850 shrink-0"
                      />
                      <div className="text-left min-w-0">
                        <span className="inline-block text-[8px] font-black text-[#c29b57] uppercase tracking-wider mb-0.5 bg-[#c29b57]/10 px-1.5 py-0.5 rounded border border-[#c29b57]/15">
                          {project.category}
                        </span>
                        <h4 className="font-bold text-[13px] text-zinc-200 truncate leading-snug">
                          {project.title}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[#c29b57] font-extrabold text-[12px]">{project.interestRate}</div>
                        <div className="text-zinc-500 text-[8px] uppercase tracking-wider mt-0.5">Lãi suất</div>
                      </div>
                      <span className="text-zinc-650 text-[10px] font-bold pl-1 font-mono">▼</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {selectedProject && (
        <InvestmentModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
