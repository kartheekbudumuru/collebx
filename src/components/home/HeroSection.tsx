import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroIllustration from '@/assets/hero-illustration.png';
import { Link } from 'react-router-dom';


export function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-hero opacity-90 z-0" />
      <img
        src={heroIllustration}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
      />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            MVGR's Student Collaboration Hub
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Next
            <br />
            <span className="gradient-text">     Project Adventure</span> 🚀
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover trending tech projects, connect with like-minded collaborators, and build amazing things together at MVGR.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/projects">
              <Button variant="gradient" size="xl" className="gap-2 group">
                Explore Projects
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/projects?action=create">
              <Button variant="glass" size="xl">
                Start a Project
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
