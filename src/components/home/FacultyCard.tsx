import { motion } from 'framer-motion';
import { Faculty } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { EditFacultyDialog } from '@/components/faculty/EditFacultyDialog';
import { Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export function FacultyCard({ faculty, index }: { faculty: Faculty; index: number }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@collabx.com';
  const initials = faculty.avatar || faculty.name.split(' ').map(n => n[0]).slice(0, 2).join('');

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;

    try {
      await deleteDoc(doc(db, 'faculty', faculty.id));
      toast.success('Faculty deleted successfully');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200 relative group"
      onClick={() => navigate(`/faculty/${faculty.id}`)}
    >
      <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <EditFacultyDialog faculty={faculty} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-4 mb-3 pr-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-md shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-bold text-foreground truncate">{faculty.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{faculty.designation} — {faculty.department}</p>
          </div>
        </div>

        {faculty.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
             <Mail className="h-3 w-3" />
             <span className="truncate">{faculty.email}</span>
          </div>
        )}

        <div className="mb-4">
           {faculty.skills && (
              <div className="flex flex-wrap gap-1 mb-2">
                {faculty.skills.split(',').slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {skill.trim()}
                  </span>
                ))}
                {faculty.skills.split(',').length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                    +{faculty.skills.split(',').length - 3}
                  </span>
                )}
              </div>
           )}
           <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
             {faculty.description}
           </p>
        </div>

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/10">
          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
            {faculty.domain}
          </span>
          <span className="text-xs text-muted-foreground">Click to view</span>
        </div>
      </div>
    </motion.div>
  );
}

