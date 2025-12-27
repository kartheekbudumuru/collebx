import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Inbox, Users, FolderOpen, SortAsc } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { ContactRevealModal } from '@/components/dashboard/ContactRevealModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRequests, JoinRequest, User } from '@/data/mockData';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState(mockRequests);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'date'>('match');
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch projects created by the current user
    const q = query(collection(db, 'projects'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setMyProjects(projects);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // const myProjects = mockProjects.slice(0, 2); // REPLACED with real data
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedCount = requests.filter(r => r.status === 'accepted').length;

  const sortedRequests = [...pendingRequests].sort((a, b) => {
    if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAccept = (request: JoinRequest) => {
    setRequests(prev =>
      prev.map(r => (r.id === request.id ? { ...r, status: 'accepted' as const } : r))
    );
    setSelectedUser(request.user);
    setContactModalOpen(true);
  };

  const handleReject = (request: JoinRequest) => {
    setRequests(prev =>
      prev.map(r => (r.id === request.id ? { ...r, status: 'rejected' as const } : r))
    );
    toast.info(`Request from ${request.user.name} declined`);
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
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{acceptedCount}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </div>
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
                        <h3 className="font-bold mb-2">{project.title}</h3>
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
    </div>
  );
}
