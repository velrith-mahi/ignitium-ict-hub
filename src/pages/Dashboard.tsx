import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  BookOpen, 
  Clock, 
  Bell,
  Users,
  Calendar,
  LogOut,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, userRole, userProfile, signOut } = useAuth();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'teacher': return 'default';
      case 'student': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-500';
      case 'teacher': return 'text-blue-500';
      case 'student': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const dashboardMenus = {
    admin: [
      { title: "All Students", icon: Users, href: "/dashboard/students", description: "Manage all enrolled students" },
      { title: "Teachers", icon: Shield, href: "/dashboard/teachers", description: "Manage teacher accounts" },
      { title: "Notices", icon: Bell, href: "/dashboard/notices", description: "Create and manage announcements" },
      { title: "Class Schedules", icon: Calendar, href: "/dashboard/schedules", description: "Manage class timetables" },
      { title: "Settings", icon: Settings, href: "/dashboard/settings", description: "System configuration" },
    ],
    teacher: [
      { title: "My Students", icon: Users, href: "/dashboard/students", description: "View assigned students" },
      { title: "Class Schedules", icon: Calendar, href: "/dashboard/schedules", description: "Manage your classes" },
      { title: "Notices", icon: Bell, href: "/dashboard/notices", description: "Post announcements" },
      { title: "Materials", icon: BookOpen, href: "/dashboard/materials", description: "Upload course materials" },
    ],
    student: [
      { title: "My Classes", icon: Calendar, href: "/dashboard/classes", description: "View your class schedule" },
      { title: "Notices", icon: Bell, href: "/dashboard/notices", description: "View announcements" },
      { title: "Materials", icon: BookOpen, href: "/dashboard/materials", description: "Access course materials" },
      { title: "Progress", icon: Clock, href: "/dashboard/progress", description: "Track your progress" },
    ]
  };

  const currentMenus = dashboardMenus[userRole as keyof typeof dashboardMenus] || dashboardMenus.student;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xl font-bold text-gradient">ICT Care</div>
                <div className="text-xs text-muted-foreground">Dashboard</div>
              </div>
            </Link>

            {/* User Info & Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <div className="font-medium">{userProfile?.full_name || user?.email}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(userRole || '')} className="text-xs">
                    {userRole?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-gradient">{userProfile?.full_name || 'Student'}</span>
          </h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' && "Manage your ICT Care platform and oversee all operations."}
            {userRole === 'teacher' && "Track your students' progress and manage your classes."}
            {userRole === 'student' && "Continue your ICT learning journey with expert guidance."}
          </p>
        </div>

        {/* Profile Overview */}
        <Card className="card-glow mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Profile Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{user?.email}</div>
              </div>
            </div>
            
            {userProfile?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{userProfile.phone}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Shield className={`h-5 w-5 ${getRoleColor(userRole || '')}`} />
              <div>
                <div className="text-sm text-muted-foreground">Role</div>
                <div className="font-medium capitalize">{userRole}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Dashboard Menu */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentMenus.map((menu, index) => (
            <Link key={index} to={menu.href}>
              <Card className="card-glow p-6 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <menu.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{menu.title}</h3>
                    <p className="text-muted-foreground text-sm">{menu.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="card-glow mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {userRole === 'admin' && (
              <>
                <Button className="btn-hero">
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </>
            )}
            
            {userRole === 'teacher' && (
              <>
                <Button className="btn-hero">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Class
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Upload Material
                </Button>
              </>
            )}
            
            {userRole === 'student' && (
              <>
                <Button className="btn-hero">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Development Notice */}
        <Card className="card-glow mt-8 p-6 bg-accent/10">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-accent mb-1">Dashboard Under Development</h3>
              <p className="text-sm text-muted-foreground">
                The full dashboard features are being built. Your role: <strong>{userRole}</strong>. 
                Individual pages for student management, notices, schedules, and materials are coming soon.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;