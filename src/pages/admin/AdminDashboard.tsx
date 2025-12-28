import { useEffect, useState } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, GraduationCap, ArrowUpRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Faculty } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    faculty: 0,
    projects: 0,
    students: 0
  });
  const [departmentData, setDepartmentData] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener to get faculty stats and chart data
    const q = query(collection(db, 'faculty'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const facultyList = snapshot.docs.map(doc => doc.data()) as Faculty[];
      
      // Calculate Stats
      const facultyCount = facultyList.length;
      
      // Calculate Department Distribution for Chart
      const deptMap: Record<string, number> = {};
      facultyList.forEach(f => {
        const dept = f.department || 'Unknown';
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });
      
      const chartData = Object.entries(deptMap).map(([name, count]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
        fullName: name,
        count
      })).sort((a, b) => b.count - a.count); // Sort by count desc

      setDepartmentData(chartData);
      setStats({
        faculty: facultyCount,
        projects: 0, // Placeholder
        students: 0  // Placeholder
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { title: 'Total Faculty', value: stats.faculty, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Active Projects', value: stats.projects, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Registered Students', value: stats.students, icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-md hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-md group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                +0% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader>
             <div className="flex items-center gap-2">
               <BarChart3 className="h-5 w-5 text-primary" />
               <CardTitle>Faculty Distribution</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="pl-0">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading chart...</div>
            ) : departmentData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">No data available</div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 text-sm flex items-center justify-between cursor-pointer hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300 group">
               <span className="font-medium group-hover:text-primary transition-colors">Add New Faculty</span>
               <div className="bg-background/50 p-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowUpRight className="h-4 w-4 pt-0.5" />
               </div>
             </div>
             <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-xl border border-green-500/20 text-sm flex items-center justify-between cursor-pointer hover:from-green-500/20 hover:to-teal-500/20 transition-all duration-300 group">
               <span className="font-medium group-hover:text-primary transition-colors">Review Project Proposals</span>
               <div className="bg-background/50 p-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowUpRight className="h-4 w-4 pt-0.5" />
               </div>
             </div>
             <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 text-sm flex items-center justify-between cursor-pointer hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300 group">
               <span className="font-medium group-hover:text-primary transition-colors">System Settings</span>
               <div className="bg-background/50 p-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowUpRight className="h-4 w-4 pt-0.5" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
