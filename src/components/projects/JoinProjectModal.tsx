import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, User, Code, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { skillSuggestions } from '@/data/mockData';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { createJoinRequest } from '@/lib/api';
import { Project } from '@/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface JoinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function JoinProjectModal({ isOpen, onClose, project }: JoinProjectModalProps) {
  const { user } = useAuth();
  const [role, setRole] = useState<'developer' | 'learner' | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!user || !project || !role) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const requestData = {
        projectId: project.id,
        userId: user.uid,
        user: { id: user.uid, name: user.displayName || 'Anonymous' },
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        role,
        skills: selectedSkills,
        matchPercentage: 0
      };

      // Only add message if it's not empty
      if (message.trim()) {
        Object.assign(requestData, { message });
      }

      // Update user profile with skills and email
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email || '',
        skills: selectedSkills,
        role: role,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log('Creating join request:', requestData);
      const requestId = await createJoinRequest(requestData);
      console.log('Request created with ID:', requestId);

      setShowSuccess(true);
      setTimeout(() => {
        toast.success('Join request sent! 🎉');
        onClose();
        setShowSuccess(false);
        setRole(null);
        setSelectedSkills([]);
        setMessage('');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast.error('Failed to send request: ' + error.message);
    } finally {
      setSubmitting(false);
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
          className="w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full gradient-accent mx-auto mb-6 flex items-center justify-center">
                <Check className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
              <p className="text-muted-foreground">The project owner will review your request soon.</p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">Join Project</h2>
                    <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">I want to join as...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRole('developer')}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        role === 'developer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Code className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Skilled Developer</div>
                      <div className="text-xs text-muted-foreground mt-1">I have experience</div>
                    </button>
                    <button
                      onClick={() => setRole('learner')}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        role === 'learner'
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/30'
                      }`}
                    >
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-accent" />
                      <div className="font-medium">Eager Learner</div>
                      <div className="text-xs text-muted-foreground mt-1">I want to learn</div>
                    </button>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">My Skills</label>
                  <p className="text-xs text-muted-foreground mb-3">Select skills you can contribute</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsRequired.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedSkills.includes(skill)
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                    {skillSuggestions.slice(0, 6).filter(s => !project.skillsRequired.includes(s)).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          selectedSkills.includes(skill)
                            ? 'gradient-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the owner why you'd be a great fit..."
                    rows={3}
                    maxLength={280}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    {message.length}/280
                  </div>
                </div>

                {/* Preview Card */}
                {role && selectedSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4"
                  >
                    <p className="text-xs text-muted-foreground mb-2">Preview - What the owner will see:</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">You</div>
                        <Badge variant={role === 'developer' ? 'default' : 'accent'} className="text-xs">
                          {role === 'developer' ? 'Developer' : 'Learner'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedSkills.map(s => (
                        <Badge key={s} variant="skillHave" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <Button
                  variant="accent"
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!role || selectedSkills.length === 0 || submitting}
                >
                  {submitting ? 'Sending...' : 'Send Request 🤝'}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
