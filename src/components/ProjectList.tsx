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

  useEffect(() => {
    const q = query(collection(db, "projects"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Fallback to local data if empty
        import('../data').then(({ projects: localProjects }) => {
          setProjects(localProjects);
          setLoading(false);
        });
        return;
      }
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      projectsData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to projects:", error);
      // Fallback to local data on error
      import('../data').then(({ projects: localProjects }) => {
        setProjects(localProjects);
        setLoading(false);
      });
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0b0b0b] relative">
      {/* Header for Project List */}
      <div className="bg-[#0f0f0f] px-4 py-4 flex items-center gap-2 sticky top-0 z-20 shadow-lg border-b border-zinc-900/80">
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

      {/* List */}
      <div className="p-3.5 sm:p-4 overflow-y-auto flex-1 pb-40 scrollbar-hide space-y-4">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onInvest={() => setSelectedProject(project)} />
        ))}
      </div>

      {selectedProject && (
        <InvestmentModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
