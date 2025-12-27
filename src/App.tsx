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
import NotFound from "./pages/NotFound";
import Signup from "@/pages/Signup";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageFaculty from "./pages/admin/ManageFaculty";
import ManageProjects from "./pages/admin/ManageProjects";
import { AuthProvider } from "./components/AuthContext";

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
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/faculty/:id" element={<FacultyDetails />} />
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/profile" element={<StudentProfile />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
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
