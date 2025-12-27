import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Faculty } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Building, Award, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FacultyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'faculty', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFaculty({ id: docSnap.id, ...docSnap.data() } as Faculty);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen gradient-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Faculty Not Found</h1>
        <Button onClick={() => navigate('/faculty')}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      <main className="md:ml-64 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2" 
            onClick={() => navigate('/faculty')}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-32 h-32 rounded-2xl gradient-primary flex items-center justify-center text-4xl font-bold text-white shadow-lg shrink-0">
                {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{faculty.name}</h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      {faculty.designation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-primary" />
                      {faculty.department}
                    </span>
                    {faculty.email && (
                      <a href={`mailto:${faculty.email}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <Mail className="h-4 w-4 text-primary" />
                        {faculty.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      Domain Expertise
                    </h3>
                    <p className="text-sm">{faculty.domain}</p>
                  </div>
                   {faculty.skills && (
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {faculty.skills.split(',').map((skill, i) => (
                           <span key={i} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">About</h2>
                  <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {faculty.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
