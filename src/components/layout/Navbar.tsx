import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Rocket, Menu, X, User, LayoutDashboard, FolderOpen, Users, LogOut, Trophy, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';

export const navItems = [
  { path: '/', label: 'Home', icon: Rocket },
  { path: '/projects', label: 'Projects', icon: FolderOpen },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/faculty', label: 'faculty expertees', icon: Users },
  { path: '/hackathon', label: 'Hackathon', icon: Trophy },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3 md:hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Rocket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">CollabX</span>
            </Link>

            {/* Desktop Navigation moved to sidebar for md+ */}
            <div className="hidden">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`gap-2 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAdmin && (
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600">ADMIN</span>
              </div>
            )}
            <Link to="/profile">
              <Button variant="glass" size="icon" className="gap-2">
                <User className="w-4 h-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* User Menu - Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl mt-2 p-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={`w-full justify-start gap-2 ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="flex justify-end md:hidden">
                <ThemeToggle />
              </div>
              <div className="border-t border-border my-2" />
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="w-4 h-4" />
                  My Profile
                </Button>
              </Link>
              {isAdmin && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-600">ADMIN</span>
                </div>
              )}
              <div className="border-t border-border my-2" />
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>

    {/* Desktop Topbar */}
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur px-6 py-3"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">CollabX</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 ml-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`gap-2 ${isActive ? 'bg-primary/10 text-primary' : ''}`}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAdmin && (
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-600">ADMIN</span>
            </div>
          )}
          <Link to="/profile">
            <Button variant="glass" size="icon" className="hidden sm:flex">
              <User className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>


    </>
  );
}
