import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, updateDoc, arrayUnion, deleteDoc, setDoc } from 'firebase/firestore';
import { Project, User, Hackathon } from '@/types';
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
