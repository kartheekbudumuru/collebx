import { motion } from 'framer-motion';
import { Rocket, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import { toast } from 'sonner';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthContext';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingUp, setSigningUp] = useState(false);

  // Redirect to home if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !regNo.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSigningUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        regNo: regNo,
        email: email,
        createdAt: new Date().toISOString(),
        role: 'student' // Default role
      });

      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      }
      toast.error(errorMessage);
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-3xl p-8 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2">
              Join <span className="gradient-text">CollabX</span>
            </h1>
            <p className="text-muted-foreground">
              Create an account to start collaborating
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md bg-transparent border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Registration Number</label>
              <input
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-full rounded-md bg-transparent border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Enter your registration number"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-transparent border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md bg-transparent border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Create a password"
              />
            </div>

            <Button type="submit" variant="gradient" size="xl" className="w-full gap-2" disabled={signingUp}>
              <Sparkles className="w-5 h-5" />
              {signingUp ? 'Creating Account...' : 'Sign Up'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
