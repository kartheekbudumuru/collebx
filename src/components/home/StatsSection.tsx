import { motion } from 'framer-motion';
import { FolderOpen, Users, Trophy } from 'lucide-react';

const stats = [
  { icon: FolderOpen, label: 'Active Projects', value: '24', color: 'text-primary' },
  { icon: Users, label: 'Collaborators', value: '156', color: 'text-accent' },
  { icon: Trophy, label: 'Success Stories', value: '18', color: 'text-success' },
];

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="glass-card rounded-2xl p-6 text-center"
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
