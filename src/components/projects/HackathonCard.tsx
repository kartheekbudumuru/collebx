import { motion } from 'framer-motion';
import { Calendar, MapPin, Tag, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Hackathon } from '@/types';

interface HackathonCardProps {
  hackathon: Hackathon;
  index: number;
  isAdmin?: boolean;
  onEdit?: (hackathon: Hackathon) => void;
  onDelete?: (hackathon: Hackathon) => void;
}

export function HackathonCard({ hackathon, index, isAdmin, onEdit, onDelete }: HackathonCardProps) {
  const statusColors = {
    'Upcoming': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    'Ongoing': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
    'Completed': 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl overflow-hidden group"
    >
      <div className={`h-2 ${
        hackathon.status === 'Upcoming' ? 'bg-blue-500' :
        hackathon.status === 'Ongoing' ? 'bg-green-500' : 'bg-gray-500'
      }`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {hackathon.eventName}
            </h3>
          </div>
          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit?.(hackathon)}
                className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete?.(hackathon)}
                className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={statusColors[hackathon.status]}>
            {hackathon.status}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Tag className="w-3 h-3" />
            {hackathon.category}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <MapPin className="w-3 h-3" />
            {hackathon.format}
          </Badge>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="w-4 h-4" />
          {formatDate(hackathon.eventDate)}
        </div>

        {/* Join Button */}
        {!isAdmin && (
          <Button
            variant="gradient"
            className="w-full gap-2"
            onClick={() => window.open(hackathon.joiningUrl, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            Join Hackathon
          </Button>
        )}
      </div>
    </motion.div>
  );
}
