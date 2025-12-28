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
  owner?: User; // Optional as we might just store ownerId
  createdBy: string; // ID of the user who created it
  status?: 'approved' | 'pending' | 'rejected';
  team?: Array<{ userId: string; userName: string; joinedAt: string; role?: string }>; // Team members array
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  designation: string; // Mapped from "title" request
  domain: string; // Mapped from "domain" request
  email: string; // Contact email
  skills: string; // Comma separated skills or string description
  description: string; // Limit 500 words
  avatar?: string; // Optional for UI persistence if we want to add it later
}

export interface Hackathon {
  id: string;
  eventName: string;
  eventDate: string; // ISO date string
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  category: string; // e.g., "AI/ML", "Web Dev", "Blockchain"
  format: 'Virtual' | 'In-Person' | 'Hybrid';
  joiningUrl: string;
  createdAt: string;
  createdBy: string;
}

export interface JoinRequest {
  id: string;
  projectId: string;
  userId: string;
  user: { id: string; name: string };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  matchPercentage?: number;
  role?: 'developer' | 'learner';
  skills?: string[];
}
