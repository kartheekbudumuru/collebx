// Mock data and types for the ColabX platform

export interface Project {
  id: string;
  title: string;
  description: string;
  domain: 'ai' | 'web' | 'iot' | 'cyber';
  difficulty: 'easy' | 'medium' | 'hard';
  skillsRequired: string[];
  skillsHave: string[];
  skillsNeed: string[];
  teamSize: number;
  currentMembers: number;
  referenceUrl?: string;
  createdAt: string;
  owner: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  role?: 'developer' | 'learner';
  avatar?: string;
}

export interface JoinRequest {
  id: string;
  projectId: string;
  user: User;
  role: 'developer' | 'learner';
  skills: string[];
  message?: string;
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Hackathon {
  id: string;
  eventName: string;
  eventDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  category: string;
  format: 'Virtual' | 'In-Person' | 'Hybrid';
  joiningUrl: string;
  createdAt: string;
  createdBy: string;
}

export const domains = [
  { id: 'ai', name: 'AI & ML', icon: '🤖', gradient: 'gradient-ai', description: 'Machine Learning, Deep Learning, NLP' },
  { id: 'web', name: 'Web Dev', icon: '🌐', gradient: 'gradient-web', description: 'React, Node.js, Full Stack' },
  { id: 'iot', name: 'IoT', icon: '📡', gradient: 'gradient-iot', description: 'Arduino, Raspberry Pi, Sensors' },
  { id: 'cyber', name: 'Cyber Security', icon: '🔒', gradient: 'gradient-cyber', description: 'Network Security, Ethical Hacking' },
] as const;

export const difficultyLevels = [
  { id: 'easy', name: 'Beginner', color: 'success' },
  { id: 'medium', name: 'Intermediate', color: 'warning' },
  { id: 'hard', name: 'Advanced', color: 'destructive' },
] as const;

export const skillSuggestions = [
  'React', 'TypeScript', 'Python', 'TensorFlow', 'PyTorch', 'Node.js',
  'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
  'Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'IoT Protocols',
  'Network Security', 'Penetration Testing', 'Cryptography', 'Linux',
  'JavaScript', 'Java', 'C++', 'Rust', 'Go', 'Flutter', 'React Native',
  'UI/UX Design', 'Figma', 'Tailwind CSS', 'GraphQL', 'REST APIs',
];

// Note: All mock data has been removed. Projects, hackathons, and faculty data
// are now fetched from Firestore. Join requests are also stored in Firestore.

export function calculateSkillMatch(requiredSkills: string[], userSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;
  const matches = userSkills.filter(skill =>
    requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  return Math.round((matches.length / requiredSkills.length) * 100);
}
