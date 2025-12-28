import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { FacultyCard } from '@/components/home/FacultyCard';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Faculty as FacultyType } from '@/types';
import { useAuth } from '@/components/AuthContext';
import { AddFacultyDialog } from '@/components/faculty/AddFacultyDialog';

export default function Faculty() {
  const [faculties, setFaculties] = useState<FacultyType[]>([]);
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@collabx.com';

  useEffect(() => {
    const q = query(collection(db, 'faculty'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const facultyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FacultyType[];
      setFaculties(facultyData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />

      <main className="md:ml-64 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold mb-1">Faculty Directory</h1>
              <p className="text-muted-foreground">Browse faculty members across departments</p>
            </div>
            {isAdmin && (
              <AddFacultyDialog onFacultyAdded={() => {}} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {faculties.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No faculty members found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {faculties.map((f, i) => (
                  <FacultyCard key={f.id} faculty={f} index={i} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
