import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, FolderOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { ProjectFilter } from '@/components/projects/ProjectFilter';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { JoinProjectModal } from '@/components/projects/JoinProjectModal';
import { Button } from '@/components/ui/button';
import { Project } from '@/data/mockData';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/lib/api';

export default function ProjectsList() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string | null>(
    searchParams.get('domain')
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setCreateModalOpen(true);
    }
  }, [searchParams]);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.skillsRequired.some((s) =>
          s.toLowerCase().includes(search.toLowerCase())
        );
      const matchesDomain = !selectedDomain || project.domain === selectedDomain;
      const matchesDifficulty =
        !selectedDifficulty || project.difficulty === selectedDifficulty;

      return matchesSearch && matchesDomain && matchesDifficulty;
    });
  }, [search, selectedDomain, selectedDifficulty, projects]);

  const handleStartProject = (project: Project) => {
    toast.success(`Starting "${project.title}"! 💡`, {
      description: 'This will be added to your projects.',
    });
  };

  const handleJoinProject = (project: Project) => {
    setSelectedProject(project);
    setJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />

      <main className="md:ml-64 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-1">
                <FolderOpen className="w-8 h-8 inline mr-2 text-primary" />
                Trending Projects
              </h1>
              <p className="text-muted-foreground">
                Discover {filteredProjects.length} projects waiting for collaborators
              </p>
            </div>
            <Button
              variant="gradient"
              size="lg"
              className="gap-2"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Create Project
            </Button>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ProjectFilter
              search={search}
              setSearch={setSearch}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
            />
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
             <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
             </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onStart={handleStartProject}
                  onJoin={handleJoinProject}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or create a new project
              </p>
              <Button
                variant="gradient"
                onClick={() => setCreateModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Project
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultDomain={selectedDomain || undefined}
      />
      <JoinProjectModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        project={selectedProject}
      />
    </div>
  );
}
