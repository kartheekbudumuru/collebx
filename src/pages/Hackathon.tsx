import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Search, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { HackathonCard } from '@/components/projects/HackathonCard';
import { HackathonDialog } from '@/components/projects/HackathonDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/components/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getHackathons, deleteHackathon } from '@/lib/api';
import { Hackathon } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HackathonsList() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hackathonToDelete, setHackathonToDelete] = useState<Hackathon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: hackathons = [], isLoading, refetch } = useQuery({
    queryKey: ['hackathons'],
    queryFn: getHackathons
  });

  const handleDeleteHackathon = async () => {
    if (!hackathonToDelete) return;

    setDeleting(true);
    try {
      await deleteHackathon(hackathonToDelete.id);
      toast.success(`Hackathon "${hackathonToDelete.eventName}" deleted successfully`);
      setDeleteDialogOpen(false);
      setHackathonToDelete(null);
      refetch();
    } catch (error: any) {
      console.error("Error deleting hackathon:", error);
      toast.error(`Failed to delete hackathon: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const filteredHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesSearch =
        !search ||
        hackathon.eventName.toLowerCase().includes(search.toLowerCase()) ||
        hackathon.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !selectedStatus || hackathon.status === selectedStatus;
      const matchesFormat = !selectedFormat || hackathon.format === selectedFormat;
      const matchesCategory = !selectedCategory || hackathon.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesFormat && matchesCategory;
    });
  }, [search, selectedStatus, selectedFormat, selectedCategory, hackathons]);

  const categories = [...new Set(hackathons.map(h => h.category))];
  const formats = ['Virtual', 'In-Person', 'Hybrid'];
  const statuses = ['Upcoming', 'Ongoing', 'Completed'];

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />

      <main className="md:ml-64 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold mb-1">
                <Trophy className="w-8 h-8 inline mr-2 text-primary" />
                Hackathons
              </h1>
              <p className="text-muted-foreground">
                Discover {filteredHackathons.length} hackathon events
              </p>
            </div>
            {isAdmin && (
              <Button
                variant="gradient"
                size="lg"
                className="gap-2"
                onClick={() => {
                  setEditingHackathon(null);
                  setShowDialog(true);
                }}
              >
                <Plus className="w-5 h-5" />
                Add Hackathon
              </Button>
            )}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search hackathons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedStatus || 'all'} onValueChange={(value) => setSelectedStatus(value === 'all' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFormat || 'all'} onValueChange={(value) => setSelectedFormat(value === 'all' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Hackathons Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {isLoading ? (
              <div className="text-center py-16">
                <div className="text-muted-foreground">Loading hackathons...</div>
              </div>
            ) : filteredHackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHackathons.map((hackathon, index) => (
                  <HackathonCard
                    key={hackathon.id}
                    hackathon={hackathon}
                    index={index}
                    isAdmin={isAdmin}
                    onEdit={(h) => {
                      setEditingHackathon(h);
                      setShowDialog(true);
                    }}
                    onDelete={(h) => {
                      setHackathonToDelete(h);
                      setDeleteDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-bold mb-2">No hackathons found</h3>
                <p className="text-muted-foreground">
                  {search ? 'Try adjusting your filters' : 'Check back soon for upcoming hackathons!'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Add/Edit Hackathon Dialog */}
      <HackathonDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingHackathon(null);
        }}
        hackathon={editingHackathon}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hackathon</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{hackathonToDelete?.eventName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteHackathon}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
