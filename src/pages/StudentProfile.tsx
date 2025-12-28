import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { db, auth, storage } from '@/lib/firebase';
import { collection, query, where, getCountFromServer, doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { User, Mail, Hash, BookOpen, Briefcase, Edit, Camera, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentProfile() {
  const { user } = useAuth();
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [regNo, setRegNo] = useState("Loading...");
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [updatingName, setUpdatingName] = useState(false);
  const [newAdmissionNumber, setNewAdmissionNumber] = useState('');

  // Placeholder data depending on backend
  const studentDetails = {
    department: "Computer Science & Engineering" 
  };

  useEffect(() => {
    if (user?.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch project count
        const q = query(collection(db, 'projects'), where('createdBy', '==', user.uid));
        const snapshot = await getCountFromServer(q);
        setProjectCount(snapshot.data().count);

        // Fetch user details (Registration Number)
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setRegNo(userDocSnap.data().regNo || "Not Set");
        } else {
          setRegNo("Not Found");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error("Error sending password reset:", error);
      toast.error('Failed to send password reset email.');
    }
  };

  const handleUpdateName = async () => {
    if (!user || !newName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!newAdmissionNumber.trim()) {
      toast.error('Admission number cannot be empty');
      return;
    }
    
    if (newName === user.displayName && newAdmissionNumber === regNo) {
      toast.info('No changes made');
      setIsNameDialogOpen(false);
      return;
    }

    setUpdatingName(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: newName.trim() });
      
      // Update or create Firestore document with name and admission number
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: newName.trim(),
        regNo: newAdmissionNumber.trim()
      }, { merge: true });
      
      toast.success('Name and admission number updated successfully!');
      setIsNameDialogOpen(false);
      setNewAdmissionNumber('');
      // Refresh the page to reflect the changes
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating name:", error);
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      setUpdatingName(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!user || !selectedFile) {
      console.log("Missing user or file", { user, selectedFile });
      return;
    }
    setUpdatingPhoto(true);
    console.log("Starting upload process for file:", selectedFile.name);
    try {
      // Create a reference to 'profile_pictures/<uid>/<timestamp>_<filename>'
      const filePath = `profile_pictures/${user.uid}/${Date.now()}_${selectedFile.name}`;
      console.log("Creating storage ref at:", filePath);
      const storageRef = ref(storage, filePath);
      
      console.log("Uploading bytes...");
      const snapshot = await uploadBytes(storageRef, selectedFile);
      console.log("Upload complete, snapshot:", snapshot);

      console.log("Getting download URL...");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("Download URL:", downloadURL);

      console.log("Updating profile...");
      await updateProfile(user, { photoURL: downloadURL });
      console.log("Profile updated");

      // Update local state immediately for better UX
      setPhotoURL(downloadURL);
      
      toast.success('Profile picture updated successfully!');
      setIsPhotoDialogOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Error updating photo:", error);
      toast.error(`Upload failed: ${error.message} (Check console for details)`);
    } finally {
      setUpdatingPhoto(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen gradient-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Profile Header */}
          <div className="relative">
             <div className="h-48 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-md overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5" />
             </div>
             
             <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                  <Avatar className="w-32 h-32 border-4 border-background relative">
                    <AvatarImage src={photoURL} className="object-cover" />
                    <AvatarFallback className="text-4xl font-bold bg-background text-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button 
                    onClick={() => setIsPhotoDialogOpen(true)}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-4 space-y-1">
                   <div className="flex items-center gap-3">
                     <h1 className="text-3xl font-bold text-foreground">{user.displayName || 'Student'}</h1>
                     <button 
                       onClick={() => {
                         setNewName(user.displayName || '');
                         setNewAdmissionNumber(regNo);
                         setIsNameDialogOpen(true);
                       }}
                       className="text-muted-foreground hover:text-primary transition-colors"
                     >
                        <Edit className="w-4 h-4" />
                     </button>
                   </div>
                   <Badge variant="secondary" className="px-3 py-1 text-sm bg-background/50 backdrop-blur border-white/10">
                      Student
                   </Badge>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            
            {/* Left Column: Personal Details */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                   <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1 p-3 rounded-xl bg-background/40 border border-white/5">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Mail className="w-3 h-3" /> Email Address
                         </div>
                         <div className="font-medium truncate" title={user.email || ''}>{user.email}</div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-xl bg-background/40 border border-white/5">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <Hash className="w-3 h-3" /> Admission Number
                         </div>
                         <div className="font-medium">{regNo}</div>
                      </div>

                      <div className="space-y-1 p-3 rounded-xl bg-background/40 border border-white/5 sm:col-span-2">
                         <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                            <BookOpen className="w-3 h-3" /> Department
                         </div>
                         <div className="font-medium">{studentDetails.department}</div>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Stats & Actions */}
            <div className="space-y-6">
               <Card className="border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-md">
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-base">
                     <Briefcase className="w-5 h-5 text-indigo-400" />
                     Project Contributions
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center justify-between">
                       <div className="text-4xl font-bold gradient-text">{loading ? "..." : projectCount}</div>
                       <Button variant="secondary" size="sm" onClick={() => window.location.href = '/dashboard'}>
                         View All
                       </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                       Total projects created and managed by you on ColabX.
                    </p>
                 </CardContent>
               </Card>


            </div>

          </div>
        </div>

        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Profile Picture</DialogTitle>
              <DialogDescription>
                Upload a new profile picture. Supported formats: JPG, PNG, GIF.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo-file" className="text-right">
                  Image
                </Label>
                <Input
                  id="photo-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="col-span-3 cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsPhotoDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleUpdatePhoto} disabled={updatingPhoto || !selectedFile}>
                {updatingPhoto && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload & Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Your Profile</DialogTitle>
              <DialogDescription>
                Update your name and admission number.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name-input" className="text-right">
                  Name
                </Label>
                <Input
                  id="name-input"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admission-input" className="text-right">
                  Admission No
                </Label>
                <Input
                  id="admission-input"
                  type="text"
                  value={newAdmissionNumber}
                  onChange={(e) => setNewAdmissionNumber(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter admission number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsNameDialogOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleUpdateName} disabled={updatingName || !newName.trim() || !newAdmissionNumber.trim()}>
                {updatingName && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
