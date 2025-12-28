import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hackathon } from '@/types';
import { toast } from 'sonner';
import { createHackathon, updateHackathon } from '@/lib/api';
import { useAuth } from '@/components/AuthContext';

interface HackathonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon?: Hackathon | null;
  onSuccess: () => void;
}

export function HackathonDialog({ isOpen, onClose, hackathon, onSuccess }: HackathonDialogProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    status: 'Upcoming' as 'Upcoming' | 'Ongoing' | 'Completed',
    category: '',
    format: 'Virtual' as 'Virtual' | 'In-Person' | 'Hybrid',
    joiningUrl: '',
  });

  useEffect(() => {
    if (hackathon) {
      setFormData({
        eventName: hackathon.eventName,
        eventDate: hackathon.eventDate.split('T')[0],
        status: hackathon.status,
        category: hackathon.category,
        format: hackathon.format,
        joiningUrl: hackathon.joiningUrl,
      });
    } else {
      setFormData({
        eventName: '',
        eventDate: '',
        status: 'Upcoming',
        category: '',
        format: 'Virtual',
        joiningUrl: '',
      });
    }
  }, [hackathon, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventName.trim() || !formData.eventDate || !formData.category.trim() || !formData.joiningUrl.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.joiningUrl.includes('http')) {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      if (hackathon) {
        // Update existing hackathon
        await updateHackathon(hackathon.id, {
          ...formData,
          eventDate: new Date(formData.eventDate).toISOString(),
        });
        toast.success('Hackathon updated successfully');
      } else {
        // Create new hackathon
        if (!user) return;
        await createHackathon({
          ...formData,
          eventDate: new Date(formData.eventDate).toISOString(),
          createdAt: new Date().toISOString(),
          createdBy: user.uid,
        });
        toast.success('Hackathon created successfully');
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving hackathon:', error);
      toast.error(`Failed to save hackathon: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hackathon ? 'Edit Hackathon' : 'Add New Hackathon'}</DialogTitle>
          <DialogDescription>
            {hackathon ? 'Update hackathon details' : 'Create a new hackathon event'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              placeholder="e.g., AI Hackathon 2024"
              value={formData.eventName}
              onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g., AI/ML, Web Dev"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format *</Label>
              <Select value={formData.format} onValueChange={(value) => setFormData({ ...formData, format: value as any })}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Virtual">Virtual</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joiningUrl">Joining URL *</Label>
            <Input
              id="joiningUrl"
              type="url"
              placeholder="https://example.com/join"
              value={formData.joiningUrl}
              onChange={(e) => setFormData({ ...formData, joiningUrl: e.target.value })}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {hackathon ? 'Update' : 'Create'} Hackathon
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
