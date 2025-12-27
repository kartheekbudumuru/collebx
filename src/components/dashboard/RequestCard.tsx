import { motion } from 'framer-motion';
import { Check, X, Code, BookOpen, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkillMatchMeter } from './SkillMatchMeter';
import { JoinRequest } from '@/data/mockData';

interface RequestCardProps {
  request: JoinRequest;
  index: number;
  onAccept: (request: JoinRequest) => void;
  onReject: (request: JoinRequest) => void;
}

export function RequestCard({ request, index, onAccept, onReject }: RequestCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card glass-card-hover rounded-2xl p-5"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
          {getInitials(request.user.name)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-foreground">{request.user.name}</h4>
            <Badge variant={request.role === 'developer' ? 'default' : 'accent'}>
              {request.role === 'developer' ? (
                <><Code className="w-3 h-3 mr-1" /> Developer</>
              ) : (
                <><BookOpen className="w-3 h-3 mr-1" /> Learner</>
              )}
            </Badge>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {request.skills.map((skill) => (
              <Badge key={skill} variant="skillHave" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Message */}
          {request.message && (
            <div className="mt-3 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4 inline mr-2 text-primary" />
              {request.message}
            </div>
          )}
        </div>

        {/* Match Meter */}
        <div className="shrink-0 text-center">
          <SkillMatchMeter percentage={request.matchPercentage} size="md" />
          <p className="text-xs text-muted-foreground mt-1">Match</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="success"
          className="flex-1 gap-1.5"
          onClick={() => onAccept(request)}
        >
          <Check className="w-4 h-4" />
          Accept
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30"
          onClick={() => onReject(request)}
        >
          <X className="w-4 h-4" />
          Decline
        </Button>
      </div>
    </motion.div>
  );
}
