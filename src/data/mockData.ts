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

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Study Assistant',
    description: 'Build an intelligent chatbot that helps students with their coursework using NLP and GPT APIs.',
    domain: 'ai',
    difficulty: 'medium',
    skillsRequired: ['Python', 'NLP', 'React', 'FastAPI'],
    skillsHave: ['Python', 'React'],
    skillsNeed: ['NLP', 'FastAPI'],
    teamSize: 4,
    currentMembers: 2,
    referenceUrl: 'https://github.com/example/study-assistant',
    createdAt: '2024-01-15',
    owner: { id: '1', name: 'Priya Sharma', email: 'priya@mvgr.edu.in', skills: ['Python', 'React'], linkedin: 'linkedin.com/in/priya', github: 'github.com/priya' },
  },
  {
    id: '2',
    title: 'Campus Event Management System',
    description: 'A full-stack web app for organizing and managing college events with real-time updates.',
    domain: 'web',
    difficulty: 'easy',
    skillsRequired: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    skillsHave: ['React', 'Tailwind CSS'],
    skillsNeed: ['Node.js', 'MongoDB'],
    teamSize: 3,
    currentMembers: 1,
    createdAt: '2024-01-18',
    owner: { id: '2', name: 'Rahul Verma', email: 'rahul@mvgr.edu.in', skills: ['React', 'Tailwind CSS'], github: 'github.com/rahul' },
  },
  {
    id: '3',
    title: 'Smart Attendance System',
    description: 'IoT-based attendance tracking using RFID sensors and real-time dashboard.',
    domain: 'iot',
    difficulty: 'hard',
    skillsRequired: ['Arduino', 'ESP32', 'Python', 'React', 'MQTT'],
    skillsHave: ['Arduino', 'Python'],
    skillsNeed: ['ESP32', 'React', 'MQTT'],
    teamSize: 5,
    currentMembers: 2,
    referenceUrl: 'https://hackaday.io/project/smart-attendance',
    createdAt: '2024-01-20',
    owner: { id: '3', name: 'Ananya Reddy', email: 'ananya@mvgr.edu.in', skills: ['Arduino', 'Python'], linkedin: 'linkedin.com/in/ananya' },
  },
  {
    id: '4',
    title: 'Phishing Detection Extension',
    description: 'Browser extension that uses ML to detect phishing websites in real-time.',
    domain: 'cyber',
    difficulty: 'hard',
    skillsRequired: ['JavaScript', 'Python', 'Machine Learning', 'Chrome APIs'],
    skillsHave: ['Python', 'Machine Learning'],
    skillsNeed: ['JavaScript', 'Chrome APIs'],
    teamSize: 3,
    currentMembers: 1,
    createdAt: '2024-01-22',
    owner: { id: '4', name: 'Kiran Kumar', email: 'kiran@mvgr.edu.in', skills: ['Python', 'ML'], github: 'github.com/kiran' },
  },
  {
    id: '5',
    title: 'College Social Network',
    description: 'A social platform exclusively for MVGR students to connect, share, and collaborate.',
    domain: 'web',
    difficulty: 'medium',
    skillsRequired: ['React', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS'],
    skillsHave: ['React', 'TypeScript'],
    skillsNeed: ['PostgreSQL', 'GraphQL', 'AWS'],
    teamSize: 6,
    currentMembers: 3,
    createdAt: '2024-01-25',
    owner: { id: '5', name: 'Sneha Patel', email: 'sneha@mvgr.edu.in', skills: ['React', 'TypeScript'], linkedin: 'linkedin.com/in/sneha', github: 'github.com/sneha' },
  },
  {
    id: '6',
    title: 'Emotion Recognition System',
    description: 'Real-time facial emotion detection using computer vision and deep learning.',
    domain: 'ai',
    difficulty: 'hard',
    skillsRequired: ['Python', 'TensorFlow', 'OpenCV', 'React'],
    skillsHave: ['Python', 'TensorFlow'],
    skillsNeed: ['OpenCV', 'React'],
    teamSize: 4,
    currentMembers: 2,
    referenceUrl: 'https://github.com/example/emotion-ai',
    createdAt: '2024-01-28',
    owner: { id: '6', name: 'Arjun Rao', email: 'arjun@mvgr.edu.in', skills: ['Python', 'TensorFlow'], github: 'github.com/arjun' },
  },
];

export const mockRequests: JoinRequest[] = [
  {
    id: '1',
    projectId: '1',
    user: { id: '7', name: 'Vikram Singh', email: 'vikram@mvgr.edu.in', skills: ['Python', 'NLP', 'FastAPI'], linkedin: 'linkedin.com/in/vikram', github: 'github.com/vikram' },
    role: 'developer',
    skills: ['Python', 'NLP', 'FastAPI'],
    message: 'I have experience with NLP projects and would love to contribute to this!',
    matchPercentage: 85,
    status: 'pending',
    createdAt: '2024-01-30',
  },
  {
    id: '2',
    projectId: '1',
    user: { id: '8', name: 'Meera Nair', email: 'meera@mvgr.edu.in', skills: ['React', 'JavaScript'], github: 'github.com/meera' },
    role: 'learner',
    skills: ['React', 'JavaScript'],
    message: 'Eager to learn NLP and contribute to frontend!',
    matchPercentage: 45,
    status: 'pending',
    createdAt: '2024-01-31',
  },
  {
    id: '3',
    projectId: '1',
    user: { id: '9', name: 'Aditya Menon', email: 'aditya@mvgr.edu.in', skills: ['Python', 'FastAPI', 'Docker'], linkedin: 'linkedin.com/in/aditya' },
    role: 'developer',
    skills: ['Python', 'FastAPI', 'Docker'],
    matchPercentage: 70,
    status: 'pending',
    createdAt: '2024-02-01',
  },
];

// Faculty type and mock faculty data for the college directory
export interface Faculty {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  office?: string;
  phone?: string;
  researchAreas: string[];
  profileUrl?: string;
  avatar?: string; // Optional emoji or initials
}

export const mockFaculties: Faculty[] = [
  {
    id: 'f1',
    name: 'Dr. S. Ramesh',
    title: 'Professor & HOD',
    department: 'Computer Science & Engineering',
    email: 'ramesh@mvgr.edu.in',
    office: 'Block A, Room 214',
    phone: '+91-98765-43210',
    researchAreas: ['Distributed Systems', 'Cloud Computing', 'OS'],
    profileUrl: 'https://mvgr.edu.in/faculty/ramesh',
    avatar: 'SR',
  },
  {
    id: 'f2',
    name: 'Dr. Meena K',
    title: 'Associate Professor',
    department: 'Electronics & Communication',
    email: 'meena@mvgr.edu.in',
    office: 'Block B, Room 110',
    phone: '+91-91234-56789',
    researchAreas: ['VLSI', 'Embedded Systems', 'IoT'],
    profileUrl: 'https://mvgr.edu.in/faculty/meena',
    avatar: 'MK',
  },
  {
    id: 'f3',
    name: 'Prof. K. Srinivas',
    title: 'Assistant Professor',
    department: 'Information Technology',
    email: 'srinivas@mvgr.edu.in',
    office: 'Block C, Room 307',
    phone: '+91-99876-54321',
    researchAreas: ['Data Science', 'Machine Learning', 'NLP'],
    profileUrl: 'https://mvgr.edu.in/faculty/srinivas',
    avatar: 'KS',
  },
  {
    id: 'f4',
    name: 'Dr. Anita Rao',
    title: 'Professor',
    department: 'Cyber Security',
    email: 'anita@mvgr.edu.in',
    office: 'Block D, Room 201',
    phone: '+91-90123-45678',
    researchAreas: ['Network Security', 'Cryptography', 'Privacy'],
    profileUrl: 'https://mvgr.edu.in/faculty/anita',
    avatar: 'AR',
  },
  {
    id: 'f5',
    name: 'Dr. N. Prakash',
    title: 'Associate Professor',
    department: 'Mechanical Engineering',
    email: 'prakash@mvgr.edu.in',
    office: 'Block E, Room 102',
    phone: '+91-93456-78901',
    researchAreas: ['Robotics', 'Control Systems', 'CAD/CAM'],
    profileUrl: 'https://mvgr.edu.in/faculty/prakash',
    avatar: 'NP',
  },
  {
    id: 'f6',
    name: 'Dr. Leela Devi',
    title: 'Assistant Professor',
    department: 'Civil Engineering',
    email: 'leela@mvgr.edu.in',
    office: 'Block F, Room 209',
    phone: '+91-94567-89012',
    researchAreas: ['Structural Engineering', 'Sustainability', 'Materials'],
    profileUrl: 'https://mvgr.edu.in/faculty/leela',
    avatar: 'LD',
  },
];

export function calculateSkillMatch(requiredSkills: string[], userSkills: string[]): number {
  if (requiredSkills.length === 0) return 100;
  const matches = userSkills.filter(skill =>
    requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
  );
  return Math.round((matches.length / requiredSkills.length) * 100);
}
