import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Mail, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Project } from '@/types';

interface TeamMember {
  userId: string;
  userName: string;
  joinedAt: string;
  role?: string;
}

interface TeamMemberDetail extends TeamMember {
  email?: string;
  skills?: string[];
}

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onRemoveMember?: (userId: string, projectId?: string) => Promise<void>;
}

export function TeamMembersModal({ isOpen, onClose, project, onRemoveMember }: TeamMembersModalProps) {
  const [members, setMembers] = useState<TeamMemberDetail[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMemberDetail | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMembers = async () => {
      if (!project?.team) return;
      
      setLoading(true);
      try {
        const detailedMembers: TeamMemberDetail[] = [];
        
        for (const member of project.team) {
          try {
            // Try to fetch user details from Firestore
            const userDoc = await getDoc(doc(db, 'users', member.userId));
            const userData = userDoc.data() || {};
            
            detailedMembers.push({
              ...member,
              email: userData.email || 'Not available',
              skills: userData.skills || []
            });
          } catch (error) {
            // Fallback if user doc doesn't exist
            detailedMembers.push({
              ...member,
              email: 'Not available',
              skills: []
            });
          }
        }
        
        setMembers(detailedMembers);
      } catch (error) {
        console.error('Error loading team members:', error);
        setMembers(project.team || []);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [project]);

  const handleDeleteMember = async () => {
    if (!selectedMember || !onRemoveMember) return;

    setDeleting(true);
    try {
      // Pass projectId if available (for combined view)
      const projectId = (selectedMember as any).projectId;
      await onRemoveMember(selectedMember.userId, projectId);
      setMembers(prev => prev.filter(m => m.userId !== selectedMember.userId));
      toast.success(`${selectedMember.userName} removed from team`);
      setShowDeleteDialog(false);
      setSelectedMember(null);
    } catch (error: any) {
      toast.error('Failed to remove member: ' + error.message);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-4xl max-h-[80vh] bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card/95 backdrop-blur">
            <div>
              <h2 className="text-xl font-bold">Team Members</h2>
              <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-muted-foreground">Loading team members...</p>
              </div>
            ) : members.length > 0 ? (
              <div className="space-y-4">
                {members.map((member, index) => (
                  <motion.div
                    key={member.userId || `member-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-4 space-y-3"
                  >
                    {/* Header with name and delete */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                          {member.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-lg">{member.userName}</h4>
                          {member.role && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {member.role === 'developer' ? '💻 Developer' : member.role === 'learner' ? '📚 Learner' : '👑 ' + member.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {onRemoveMember && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">EMAIL</p>
                          <p className="text-sm text-foreground break-all">{member.email}</p>
                        </div>
                      </div>

                      {/* Project */}
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">PROJECT</p>
                          <p className="text-sm text-foreground">{(member as any).projectTitle || project.title}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex items-start gap-3 md:col-span-2">
                        <Code className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium mb-2">SKILLS</p>
                          {member.skills && member.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map((skill) => (
                                <Badge key={skill} variant="skillHave" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">No skills recorded</p>
                          )}
                        </div>
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="w-5 h-5 flex items-center justify-center text-primary">📅</div>
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground font-medium">JOINED</p>
                          <p className="text-sm text-foreground">
                            {new Date(member.joinedAt).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="font-bold mb-2">No team members yet</h3>
                <p className="text-muted-foreground">Accept join requests to add team members</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.userName} from the team? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePresence>
  );
}

