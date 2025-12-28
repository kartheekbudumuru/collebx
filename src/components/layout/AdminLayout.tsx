import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut, 
  Menu,
  X 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.email !== 'admin@collabx.com') {
      navigate('/');
    } else if (!user) {
        navigate('/login');
    }

    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [user, navigate]);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Manage Faculty', path: '/admin/faculty' },
    { icon: Briefcase, label: 'Manage Projects', path: '/admin/projects' },
  ];

  if (!user || user.email !== 'admin@collabx.com') return null;

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative z-40 h-screen border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col backdrop-blur-xl bg-black/40",
          isSidebarOpen ? "w-72 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className={cn("font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3 transition-all duration-300", !isSidebarOpen && "scale-0 w-0 opacity-0")}>
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
               C
             </div>
             ColabX
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
          {!isSidebarOpen && (
            <div className="w-full flex justify-center md:flex">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                 C
               </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto py-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="block relative group">
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)] md:block hidden" />
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 transition-all duration-200",
                    isActive 
                      ? "bg-white/10 text-white font-medium shadow-inner border border-white/5" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5",
                    !isSidebarOpen && "md:justify-center md:px-0"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-indigo-400" : "group-hover:text-indigo-300")} />
                  <span className={cn("transition-all duration-300 origin-left", !isSidebarOpen && "md:hidden md:opacity-0 md:w-0")}>{item.label}</span>
                  
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 m-2 mt-auto">
          <Button 
            variant="ghost" 
            className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors h-11", 
                !isSidebarOpen && "md:justify-center md:px-0"
            )}
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            <span className={cn("transition-all duration-300", !isSidebarOpen && "md:hidden md:opacity-0 md:w-0")}>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-background/95 backdrop-blur-3xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
        
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-30 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-medium text-white">Administrator</span>
                <span className="text-xs text-muted-foreground">admin@collabx.com</span>
             </div>
             <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px] shadow-lg shadow-indigo-500/20">
               <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">A</span>
               </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
