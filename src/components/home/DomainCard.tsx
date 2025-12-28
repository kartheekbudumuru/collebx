import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { domains } from '@/data/mockData';

export function DomainCard({ domain, index }: { domain: typeof domains[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link to={`/projects?domain=${domain.id}`}>
        <div className="glass-card glass-card-hover rounded-2xl p-6 cursor-pointer group h-full flex flex-col">
          <div className={`w-16 h-16 rounded-2xl ${domain.gradient} flex items-center justify-center text-2xl md:text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {domain.icon}
          </div>
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1">{domain.name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">{domain.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
