import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { domains, difficultyLevels, skillSuggestions } from '@/data/mockData';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDomain?: string;
}

export function CreateProjectModal({ isOpen, onClose, defaultDomain }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState(defaultDomain || '');
  const [difficulty, setDifficulty] = useState('');
  const [skillsHave, setSkillsHave] = useState<string[]>([]);
  const [skillsNeed, setSkillsNeed] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState(3);
  const [skillInput, setSkillInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [addMeToTeam, setAddMeToTeam] = useState<boolean | null>(null);

  const totalSteps = 5;

  const addSkill = (skill: string, type: 'have' | 'need') => {
    if (type === 'have' && !skillsHave.includes(skill)) {
      setSkillsHave([...skillsHave, skill]);
    } else if (type === 'need' && !skillsNeed.includes(skill)) {
      setSkillsNeed([...skillsNeed, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string, type: 'have' | 'need') => {
    if (type === 'have') {
      setSkillsHave(skillsHave.filter(s => s !== skill));
    } else {
      setSkillsNeed(skillsNeed.filter(s => s !== skill));
    }
  };

  const { user, isAdmin } = useAuth();

  const handleSubmit = async () => {
    if (!user) return;

    // Determine if user should be added to team
    let shouldAddToTeam = false;
    if (isAdmin) {
      // Admin: only if they explicitly chose to be added
      shouldAddToTeam = addMeToTeam === true;
    } else {
      // Regular user: automatically added unless they chose not to
      shouldAddToTeam = addMeToTeam !== false;
    }
    
    try {
      const projectData: any = {
        title,
        description,
        domain,
        difficulty,
        skillsHave,
        skillsNeed,
        teamSize,
        currentMembers: shouldAddToTeam ? 1 : 0,
        skillsRequired: [...skillsHave, ...skillsNeed],
        createdBy: user.uid,
        owner: {
            id: user.uid,
            name: user.email?.split('@')[0] || 'User',
            email: user.email || '',
            skills: []
        },
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Add creator to team if applicable
      if (shouldAddToTeam) {
        projectData.team = [{
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || 'User',
          joinedAt: new Date().toISOString(),
          role: 'owner'
        }];
      }

      await addDoc(collection(db, 'projects'), projectData);

      setShowSuccess(true);
      setTimeout(() => {
        toast.success('Project created successfully! 🎉');
        onClose();
        setShowSuccess(false);
        // Reset form
        setStep(1);
        setTitle('');
        setDescription('');
        setDomain(defaultDomain || '');
        setDifficulty('');
        setSkillsHave([]);
        setSkillsNeed([]);
        setTeamSize(3);
        setAddMeToTeam(null);
      }, 2000);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return title.length > 0 && description.length > 0 && domain;
      case 2: return skillsHave.length > 0 || skillsNeed.length > 0;
      case 3: return difficulty && teamSize >= 2;
      case 4: return addMeToTeam !== null;
      default: return true;
    }
  };

  if (!isOpen) return null;

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
          className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {showSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full gradient-success mx-auto mb-6 flex items-center justify-center">
                <Check className="w-10 h-10 text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Project Created!</h3>
              <p className="text-muted-foreground">Your project is now live and ready for collaborators.</p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Create New Project</h2>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Progress */}
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i < step ? 'gradient-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[300px]">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Project Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., AI-Powered Study Assistant"
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your project idea..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Domain</label>
                        <div className="grid grid-cols-2 gap-2">
                          {domains.map((d) => (
                            <button
                              key={d.id}
                              onClick={() => setDomain(d.id)}
                              className={`p-3 rounded-xl border-2 transition-all text-left ${
                                domain === d.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <span className="text-2xl">{d.icon}</span>
                              <div className="text-sm font-medium mt-1">{d.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2 text-success">Skills I Have</label>
                        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
                          {skillsHave.map((skill) => (
                            <Badge key={skill} variant="skillHave" className="gap-1 cursor-pointer" onClick={() => removeSkill(skill, 'have')}>
                              {skill}
                              <X className="w-3 h-3" />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-warning">Skills I Need</label>
                        <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
                          {skillsNeed.map((skill) => (
                            <Badge key={skill} variant="skillNeed" className="gap-1 cursor-pointer" onClick={() => removeSkill(skill, 'need')}>
                              {skill}
                              <X className="w-3 h-3" />
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Add Skills</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            placeholder="Type a skill..."
                            className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border focus:border-primary outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && skillInput) {
                                addSkill(skillInput, 'have');
                              }
                            }}
                          />
                          <Button variant="outline" size="sm" onClick={() => skillInput && addSkill(skillInput, 'have')}>
                            <Plus className="w-4 h-4 mr-1" /> Have
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => skillInput && addSkill(skillInput, 'need')}>
                            <Plus className="w-4 h-4 mr-1" /> Need
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {skillSuggestions.slice(0, 12).map((skill) => (
                            <button
                              key={skill}
                              onClick={() => addSkill(skill, 'have')}
                              className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-3">Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-3">
                          {difficultyLevels.map((level) => (
                            <button
                              key={level.id}
                              onClick={() => setDifficulty(level.id)}
                              className={`p-4 rounded-xl border-2 transition-all text-center ${
                                difficulty === level.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/30'
                              }`}
                            >
                              <div className="text-2xl mb-1">
                                {level.id === 'easy' ? '🌱' : level.id === 'medium' ? '🌿' : '🌳'}
                              </div>
                              <div className="text-sm font-medium">{level.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-3">Team Size</label>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTeamSize(Math.max(2, teamSize - 1))}
                          >
                            -
                          </Button>
                          <div className="text-4xl font-bold w-16 text-center">{teamSize}</div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setTeamSize(Math.min(10, teamSize + 1))}
                          >
                            +
                          </Button>
                          <span className="text-muted-foreground">members</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {isAdmin ? 'Add yourself to this project?' : 'Project Membership'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {isAdmin 
                            ? 'As an admin, you can choose whether to join this project as a member or manage it separately.'
                            : 'You will be automatically added as a team member to this project.'}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setAddMeToTeam(false)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                              addMeToTeam === false
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            }`}
                          >
                            <div className="text-2xl mb-2">👁️</div>
                            <div className="font-medium">
                              {isAdmin ? 'No, just manage' : 'I prefer not to'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {isAdmin ? 'Stay as admin only' : 'Not a member'}
                            </div>
                          </button>
                          <button
                            onClick={() => setAddMeToTeam(true)}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${
                              addMeToTeam === true
                                ? 'border-success bg-success/5'
                                : 'border-border hover:border-success/30'
                            }`}
                          >
                            <div className="text-2xl mb-2">✨</div>
                            <div className="font-medium">
                              {isAdmin ? 'Yes, join team' : 'Add me to team'}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Be a team member
                            </div>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 5 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">Review Your Project</h3>
                      
                      <div className="glass-card rounded-xl p-4 space-y-3">
                        <div>
                          <span className="text-muted-foreground text-sm">Title</span>
                          <p className="font-semibold">{title}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Description</span>
                          <p className="text-sm">{description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={domain as any}>
                            {domains.find(d => d.id === domain)?.icon} {domains.find(d => d.id === domain)?.name}
                          </Badge>
                          <Badge variant={difficultyLevels.find(d => d.id === difficulty)?.color === 'success' ? 'success' : 'warning'}>
                            {difficultyLevels.find(d => d.id === difficulty)?.name}
                          </Badge>
                          <Badge variant="outline">Team of {teamSize}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Skills Have</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skillsHave.map(s => <Badge key={s} variant="skillHave">{s}</Badge>)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Skills Need</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skillsNeed.map(s => <Badge key={s} variant="skillNeed">{s}</Badge>)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                
                {step < totalSteps ? (
                  <Button
                    variant="gradient"
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={handleSubmit}>
                    Create Project 🚀
                  </Button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
