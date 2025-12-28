import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Inbox, Users, FolderOpen, SortAsc, Trash2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { ContactRevealModal } from '@/components/dashboard/ContactRevealModal';
import { TeamMembersModal } from '@/components/dashboard/TeamMembersModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, JoinRequest } from '@/types';
import { deleteProject, getJoinRequests, updateJoinRequest, addTeamMember, removeTeamMember } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [teamMembersOpen, setTeamMembersOpen] = useState(false);
  const [selectedTeamProject, setSelectedTeamProject] = useState<Project | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'date'>('match');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch projects created by the current user
    const q = query(collection(db, 'projects'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setMyProjects(projects);
      
      // Fetch join requests for all user projects
      let allRequests: JoinRequest[] = [];
      if (projects.length > 0) {
        for (const project of projects) {
          try {
            const projectRequests = await getJoinRequests(project.id);
            allRequests = [...allRequests, ...projectRequests];
          } catch (error) {
            console.error(`Error fetching requests for project ${project.id}:`, error);
          }
        }
      }
      console.log('Loaded requests:', allRequests);
      setRequests(allRequests);
      setLoading(false);
    }, (error) => {
      console.error('Error loading projects:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // const myProjects = mockProjects.slice(0, 2); // REPLACED with real data
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;
  
  // Calculate total team members across all projects
  const totalTeamMembers = myProjects.reduce((total, project) => {
    return total + (project.team?.length || 0);
  }, 0);

  const sortedRequests = [...pendingRequests].sort((a, b) => {
    if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAccept = async (request: JoinRequest) => {
    try {
      // Update join request status
      await updateJoinRequest(request.id, 'accepted');
      
      // Add user to project team
      const project = myProjects.find(p => p.id === request.projectId);
      if (project) {
        await addTeamMember(project.id, request.userId, request.user.name, request.role);
      }
      
      setRequests(prev =>
        prev.map(r => (r.id === request.id ? { ...r, status: 'accepted' as const } : r))
      );
      setSelectedUser({ id: request.userId, name: request.user.name, email: '' });
      setContactModalOpen(true);
      toast.success(`Request from ${request.user.name} accepted and added to team`);
    } catch (error: any) {
      toast.error('Failed to accept request: ' + error.message);
      console.error(error);
    }
  };

  const handleReject = async (request: JoinRequest) => {
    try {
      await updateJoinRequest(request.id, 'rejected');
      setRequests(prev =>
        prev.map(r => (r.id === request.id ? { ...r, status: 'rejected' as const } : r))
      );
      toast.info(`Request from ${request.user.name} declined`);
    } catch (error: any) {
      toast.error('Failed to reject request');
      console.error(error);
    }
  };

  const handleRemoveTeamMember = async (userId: string, projectId?: string) => {
    if (!selectedTeamProject) return;
    
    // Use provided projectId or fall back to selectedTeamProject.id
    const targetProjectId = projectId || selectedTeamProject.id;
    
    try {
      await removeTeamMember(targetProjectId, userId);
      
      // Update projects state
      const updatedProjects = myProjects.map(p => 
        p.id === targetProjectId
          ? { ...p, team: (p.team || []).filter(m => m.userId !== userId), currentMembers: Math.max(0, (p.currentMembers || 0) - 1) }
          : p
      );
      setMyProjects(updatedProjects);
      
      // If viewing "All Projects", reconstruct the combined view
      if (selectedTeamProject.title === 'All Projects') {
        const allTeamMembers: any[] = [];
        updatedProjects.forEach(project => {
          if (project.team && project.team.length > 0) {
            project.team.forEach(member => {
              allTeamMembers.push({
                ...member,
                projectTitle: project.title,
                projectId: project.id
              });
            });
          }
        });
        
        const combinedProject = {
          ...updatedProjects[0],
          title: 'All Projects',
          team: allTeamMembers
        };
        
        setSelectedTeamProject(combinedProject as any);
      } else {
        // Update single project view
        const updatedSelectedProject = updatedProjects.find(p => p.id === targetProjectId);
        if (updatedSelectedProject) {
          setSelectedTeamProject(updatedSelectedProject);
        }
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing team member:', error);
      return Promise.reject(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    
    setDeleting(true);
    try {
      await deleteProject(projectToDelete.id);
      setMyProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
      toast.success(`Project "${projectToDelete.title}" deleted successfully`);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error(`Failed to delete project: ${error.message}`);
    } finally {
      setDeleting(false);
    }
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
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-1">
              <LayoutDashboard className="w-8 h-8 inline mr-2 text-primary" />
              Project Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your projects and collaboration requests
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Inbox className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <div className="text-sm text-muted-foreground">Pending Requests</div>
              </div>
            </div>
            <button
              onClick={() => {
                if (myProjects.length > 0) {
                  // Create a combined view of all team members from all projects
                  const allTeamMembers: any[] = [];
                  myProjects.forEach(project => {
                    if (project.team && project.team.length > 0) {
                      project.team.forEach(member => {
                        allTeamMembers.push({
                          ...member,
                          projectTitle: project.title,
                          projectId: project.id
                        });
                      });
                    }
                  });
                  
                  // Create a virtual project with all team members
                  const combinedProject = {
                    ...myProjects[0],
                    title: 'All Projects',
                    team: allTeamMembers
                  };
                  
                  setSelectedTeamProject(combinedProject as any);
                  setTeamMembersOpen(true);
                }
              }}
              className="glass-card rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalTeamMembers}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </button>
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{myProjects.length}</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Requests Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-primary" />
                  Join Requests
                  <Badge variant="secondary">{pendingRequests.length}</Badge>
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'match' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('match')}
                  >
                    <SortAsc className="w-4 h-4 mr-1" />
                    Match %
                  </Button>
                  <Button
                    variant={sortBy === 'date' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('date')}
                  >
                    Recent
                  </Button>
                </div>
              </div>

              {sortedRequests.length > 0 ? (
                <div className="space-y-4">
                  {sortedRequests.map((request, index) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      index={index}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="text-lg font-bold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    When collaborators want to join your projects, you'll see them here.
                  </p>
                </div>
              )}
            </motion.div>

            {/* My Projects Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <FolderOpen className="w-5 h-5 text-accent" />
                My Projects
              </h2>

              <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
                ) : myProjects.length === 0 ? (
                    <div className="text-center py-8 bg-card/50 rounded-xl border border-dashed border-border/50">
                        <p className="text-muted-foreground mb-2">You haven't posted any projects yet.</p>
                        <Button variant="link" onClick={() => window.location.href='/projects?action=create'}>Create one now</Button>
                    </div>
                ) : (
                    myProjects.map((project) => (
                      <div
                        key={project.id}
                        className="glass-card rounded-2xl p-5"
                      >
                        <div className={`h-1 rounded-full ${
                          project.domain === 'ai' ? 'gradient-ai' :
                          project.domain === 'web' ? 'gradient-web' :
                          project.domain === 'iot' ? 'gradient-iot' : 'gradient-cyber'
                        } mb-4`} />
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold flex-1">{project.title}</h3>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setProjectToDelete(project);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 hover:bg-destructive/10 rounded flex-shrink-0"
                            title="Delete project"
                            type="button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Users className="w-4 h-4" />
                          {project.currentMembers}/{project.teamSize} members
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.skillsRequired.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="skill" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))
                )}

                <Button variant="glass" className="w-full" onClick={() => window.location.href='/projects'}>
                  View All Projects
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Contact Reveal Modal */}
      <ContactRevealModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        user={selectedUser}
      />

      {/* Team Members Modal */}
      <TeamMembersModal
        isOpen={teamMembersOpen}
        onClose={() => setTeamMembersOpen(false)}
        project={selectedTeamProject}
        onRemoveMember={handleRemoveTeamMember}
      />

      {/* Delete Project Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be undone. All project data and associated requests will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
