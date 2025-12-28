import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ProjectsList from "./pages/ProjectsList";
import OwnerDashboard from "./pages/OwnerDashboard";
import StudentProfile from "./pages/StudentProfile";
import Faculty from "./pages/Faculty";
import FacultyDetails from "./pages/FacultyDetails";
import Hackathon from "./pages/Hackathon";
import NotFound from "./pages/NotFound";
import Signup from "@/pages/Signup";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageFaculty from "./pages/admin/ManageFaculty";
import ManageProjects from "./pages/admin/ManageProjects";
import { AuthProvider } from "./components/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
            <Route path="/hackathon" element={<ProtectedRoute><Hackathon /></ProtectedRoute>} />
            <Route path="/faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
            <Route path="/faculty/:id" element={<ProtectedRoute><FacultyDetails /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="faculty" element={<ManageFaculty />} />
              <Route path="projects" element={<ManageProjects />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
