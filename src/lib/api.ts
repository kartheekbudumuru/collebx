import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, updateDoc, arrayUnion, deleteDoc, setDoc, increment } from 'firebase/firestore';
import { Project, User, Hackathon, JoinRequest } from '@/types';
import { Faculty } from '@/types';

// Projects Collection
export const getProjects = async (): Promise<Project[]> => {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

export const getProject = async (id: string): Promise<Project | undefined> => {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Project;
  }
  return undefined;
};

export const createProject = async (projectData: Omit<Project, 'id'>) => {
  const docRef = await addDoc(collection(db, 'projects'), projectData);
  return docRef.id;
};

export const deleteProject = async (projectId: string) => {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
};

// Faculty Collection
export const getFaculty = async (): Promise<Faculty[]> => {
  const querySnapshot = await getDocs(collection(db, 'faculty'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Faculty));
};

// Users Collection (Example, if we want to store extra user details)
export const saveUserProfile = async (user: User) => {
    // This would typically go to a 'users' collection
    // implementation pending depending on requirements
};

// Hackathon Collection
export const getHackathons = async (): Promise<Hackathon[]> => {
  const querySnapshot = await getDocs(collection(db, 'hackathons'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hackathon));
};

export const getHackathon = async (id: string): Promise<Hackathon | undefined> => {
  const docRef = doc(db, 'hackathons', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Hackathon;
  }
  return undefined;
};

export const createHackathon = async (hackathonData: Omit<Hackathon, 'id'>) => {
  const docRef = await addDoc(collection(db, 'hackathons'), hackathonData);
  return docRef.id;
};

export const updateHackathon = async (hackathonId: string, hackathonData: Partial<Hackathon>) => {
  const docRef = doc(db, 'hackathons', hackathonId);
  await updateDoc(docRef, hackathonData);
};

export const deleteHackathon = async (hackathonId: string) => {
  const docRef = doc(db, 'hackathons', hackathonId);
  await deleteDoc(docRef);
};

// Join Requests Collection
export const getJoinRequests = async (projectId: string): Promise<JoinRequest[]> => {
  const q = query(collection(db, 'joinRequests'), where('projectId', '==', projectId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JoinRequest));
};

export const getUserJoinRequests = async (userId: string): Promise<JoinRequest[]> => {
  const q = query(collection(db, 'joinRequests'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JoinRequest));
};

export const createJoinRequest = async (joinRequestData: Omit<JoinRequest, 'id'>) => {
  const docRef = await addDoc(collection(db, 'joinRequests'), joinRequestData);
  return docRef.id;
};

export const updateJoinRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
  const docRef = doc(db, 'joinRequests', requestId);
  await updateDoc(docRef, { status });
};

export const deleteJoinRequest = async (requestId: string) => {
  const docRef = doc(db, 'joinRequests', requestId);
  await deleteDoc(docRef);
};

// Add team member to project
export const addTeamMember = async (projectId: string, userId: string, userName: string, role?: string) => {
  const docRef = doc(db, 'projects', projectId);
  await updateDoc(docRef, {
    team: arrayUnion({ userId, userName, joinedAt: new Date().toISOString(), role }),
    currentMembers: increment(1)
  });
};

// Remove team member from project
export const removeTeamMember = async (projectId: string, userId: string) => {
  const projectRef = doc(db, 'projects', projectId);
  const projectSnap = await getDoc(projectRef);
  
  if (projectSnap.exists()) {
    const currentTeam = projectSnap.data().team || [];
    const updatedTeam = currentTeam.filter((member: any) => member.userId !== userId);
    
    await updateDoc(projectRef, {
      team: updatedTeam,
      currentMembers: Math.max(0, (projectSnap.data().currentMembers || 0) - 1)
    });
  }
};
