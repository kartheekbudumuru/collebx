import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Mail, Linkedin, Github, PartyPopper, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/data/mockData';
import { toast } from 'sonner';

interface ContactRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function ContactRevealModal({ isOpen, onClose, user }: ContactRevealModalProps) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast.success('Email copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !user) return null;

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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  y: 400,
                  opacity: 0,
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Content */}
          <div className="p-8 text-center relative">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
              className="w-20 h-20 rounded-full gradient-success mx-auto mb-6 flex items-center justify-center shadow-lg"
            >
              <PartyPopper className="w-10 h-10 text-success-foreground" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-2">
                <Sparkles className="w-5 h-5 inline mr-2 text-warning" />
                It's a Match!
                <Sparkles className="w-5 h-5 inline ml-2 text-warning" />
              </h2>
              <p className="text-muted-foreground mb-6">
                You've accepted <strong>{user.name}</strong> to your team!
              </p>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-5 text-left space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-sm text-muted-foreground">New Team Member</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={copyEmail}>
                  {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex gap-2">
                {user.linkedin && (
                  <a
                    href={`https://${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      LinkedIn
                    </Button>
                  </a>
                )}
                {user.github && (
                  <a
                    href={`https://${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <Github className="w-4 h-4" />
                      GitHub
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6"
            >
              <Button variant="gradient" className="w-full" size="lg" onClick={onClose}>
                Start Collaborating 🚀
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
