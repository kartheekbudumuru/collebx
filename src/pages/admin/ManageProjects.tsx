import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
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
import { Search, Trash2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.domain.toLowerCase().includes(search.toLowerCase()) ||
    (p.owner?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Manage Projects</h1>
        <p className="text-muted-foreground">Review and manage student research projects</p>
      </div>

     <div className="flex items-center gap-2 bg-card/50 backdrop-blur-md p-2 rounded-xl border border-white/10 max-w-sm shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search projects..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 h-9 placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground">Domain</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground">Created By</TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                 <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No projects found.</TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-primary/5 transition-colors border-white/5 group">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-lg bg-gradient-to-br ${
                           project.domain === 'ai' ? 'from-purple-500/20 to-blue-500/20 text-purple-400' :
                           project.domain === 'web' ? 'from-blue-500/20 to-cyan-500/20 text-blue-400' :
                           'from-emerald-500/20 to-green-500/20 text-emerald-400'
                       } shadow-sm group-hover:scale-105 transition-transform`}>
                          <Briefcase className="h-4 w-4" />
                       </div>
                       <div>
                         <div className="font-semibold">{project.title}</div>
                         <div className="text-xs text-muted-foreground md:hidden">{project.domain}</div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{project.domain}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{project.owner?.name || project.createdBy || 'Unknown'}</span>
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    <Badge variant={project.status === 'approved' ? 'default' : 'secondary'} className="capitalize">
                        {project.status || 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10 transition-colors"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
