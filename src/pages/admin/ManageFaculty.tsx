import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Faculty } from '@/types';
import { AddFacultyDialog } from '@/components/faculty/AddFacultyDialog';
import { EditFacultyDialog } from '@/components/faculty/EditFacultyDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Trash2, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function ManageFaculty() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'faculty'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const facultyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Faculty[];
      setFaculties(facultyData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await deleteDoc(doc(db, 'faculty', id));
      toast.success('Faculty deleted successfully');
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error('Failed to delete faculty');
    }
  };

  const filteredFaculty = faculties.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Manage Faculty</h1>
          <p className="text-muted-foreground">Add, edit, or remove faculty members</p>
        </div>
        <AddFacultyDialog onFacultyAdded={() => {}} />
      </div>

      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md p-2 rounded-xl border border-white/10 max-w-sm shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search by name, department, or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 h-9 placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="font-semibold text-foreground">Name</TableHead>
              <TableHead className="font-semibold text-foreground">Department</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground">Contact</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                 <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filteredFaculty.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No faculty found.</TableCell>
              </TableRow>
            ) : (
              filteredFaculty.map((faculty) => (
                <TableRow key={faculty.id} className="hover:bg-primary/5 transition-colors border-white/5 group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-primary shadow-sm group-hover:scale-105 transition-transform">
                          {faculty.name.substring(0,2)}
                       </div>
                       <div>
                         <div className="font-semibold">{faculty.name}</div>
                         <div className="text-xs text-muted-foreground md:hidden">{faculty.designation}</div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{faculty.department}</span>
                      <span className="text-xs text-muted-foreground hidden md:inline">{faculty.designation}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {faculty.email ? (
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                         <div className="p-1 rounded-full bg-primary/10">
                           <Mail className="h-3 w-3 text-primary" />
                         </div>
                         {faculty.email}
                       </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <EditFacultyDialog faculty={faculty} />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDelete(faculty.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Link to={`/faculty/${faculty.id}`} target="_blank">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
