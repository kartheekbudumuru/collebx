import { motion } from 'framer-motion';

interface SkillMatchMeterProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillMatchMeter({ percentage, size = 'md' }: SkillMatchMeterProps) {
  const sizes = {
    sm: { width: 48, stroke: 4, fontSize: 'text-xs' },
    md: { width: 64, stroke: 5, fontSize: 'text-sm' },
    lg: { width: 80, stroke: 6, fontSize: 'text-base' },
  };

  const { width, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const getGradientId = () => {
    if (percentage >= 70) return 'successGradient';
    if (percentage >= 40) return 'warningGradient';
    return 'errorGradient';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={width} height={width} className="-rotate-90">
        <defs>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(158 64% 40%)" />
            <stop offset="100%" stopColor="hsl(142 76% 45%)" />
          </linearGradient>
          <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(38 92% 50%)" />
            <stop offset="100%" stopColor="hsl(25 95% 53%)" />
          </linearGradient>
          <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 84% 60%)" />
            <stop offset="100%" stopColor="hsl(350 80% 55%)" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={`url(#${getGradientId()})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Percentage text */}
      <div className={`absolute inset-0 flex items-center justify-center font-bold ${fontSize} ${getColor()}`}>
        {percentage}%
      </div>
    </div>
  );
}
