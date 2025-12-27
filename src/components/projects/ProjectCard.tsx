import { motion } from 'framer-motion';
import { ExternalLink, Users, Lightbulb, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project, domains, difficultyLevels } from '@/data/mockData';

interface ProjectCardProps {
  project: Project;
  index: number;
  onStart: (project: Project) => void;
  onJoin: (project: Project) => void;
}

export function ProjectCard({ project, index, onStart, onJoin }: ProjectCardProps) {
  const domain = domains.find(d => d.id === project.domain);
  const difficulty = difficultyLevels.find(d => d.id === project.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card glass-card-hover rounded-2xl overflow-hidden group"
    >
      {/* Domain Header */}
      <div className={`h-2 ${domain?.gradient || 'gradient-primary'}`} />
      
      <div className="p-6">
        {/* Title & Domain */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>
          {project.referenceUrl && (
            <a
              href={project.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={project.domain as any}>
            {domain?.icon} {domain?.name}
          </Badge>
          <Badge variant={difficulty?.color === 'success' ? 'success' : difficulty?.color === 'warning' ? 'warning' : 'destructive'}>
            {difficulty?.name}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Users className="w-3 h-3" />
            {project.currentMembers}/{project.teamSize}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.skillsRequired.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="skill" className="text-xs">
              {skill}
            </Badge>
          ))}
          {project.skillsRequired.length > 4 && (
            <Badge variant="skill" className="text-xs">
              +{project.skillsRequired.length - 4}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="gradient"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onStart(project)}
          >
            <Lightbulb className="w-4 h-4" />
            Start This
          </Button>
          <Button
            variant="glass"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={() => onJoin(project)}
          >
            <UserPlus className="w-4 h-4" />
            Join
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
