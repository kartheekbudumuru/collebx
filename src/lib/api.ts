import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, query, where, updateDoc, arrayUnion } from 'firebase/firestore';
import { Project, Faculty, User } from '@/data/mockData';

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
