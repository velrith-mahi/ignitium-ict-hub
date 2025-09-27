import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar,
  UserCheck,
  GraduationCap,
  ChevronDown,
  Download,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Student {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  student_class: string | null;
  created_at: string;
  updated_at: string;
  email?: string;
  role?: string;
}

const StudentManagement = () => {
  const { userRole, user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
  }, [userRole]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, classFilter]);

  const fetchStudents = async () => {
    try {
      // Get students based on role
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role, user_id)
        `)
        .eq('user_roles.role', 'student')
        .order('created_at', { ascending: false });

      const { data: profileData, error: profileError } = await query;
      
      if (profileError) throw profileError;

      // Get email addresses from auth.users for each student
      const studentsWithEmails = await Promise.all(
        (profileData || []).map(async (profile) => {
          try {
            // Get user details from auth API if admin
            if (userRole === 'admin') {
              const { data: userData } = await supabase.auth.admin.getUserById(profile.user_id);
              return {
                ...profile,
                email: userData?.user?.email || 'N/A',
                role: 'student'
              };
            }
            return {
              ...profile,
              email: 'Protected',
              role: 'student'
            };
          } catch (error) {
            return {
              ...profile,
              email: 'N/A',
              role: 'student'
            };
          }
        })
      );

      setStudents(studentsWithEmails);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm)
      );
    }

    // Class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(student => 
        student.student_class === classFilter
      );
    }

    setFilteredStudents(filtered);
  };

  const exportStudentList = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Class', 'Joined Date'],
      ...filteredStudents.map(student => [
        student.full_name,
        student.email || 'N/A',
        student.phone || 'N/A',
        student.student_class || 'Not specified',
        new Date(student.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_list.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Student list exported successfully"
    });
  };

  const getUniqueClasses = () => {
    const classes = students
      .map(s => s.student_class)
      .filter((cls, index, arr) => cls && arr.indexOf(cls) === index)
      .sort();
    return classes;
  };

  const canViewAllStudents = userRole === 'admin';
  const canViewAssignedStudents = userRole === 'teacher';

  if (!canViewAllStudents && !canViewAssignedStudents) {
    return (
      <Card className="p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
        <p className="text-muted-foreground">
          You don't have permission to view student information.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {canViewAllStudents ? 'All Students' : 'My Students'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={exportStudentList} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {getUniqueClasses().map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No students found</h3>
          <p className="text-muted-foreground">
            {searchTerm || classFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No students have enrolled yet.'
            }
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="card-glow p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      View Progress
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{student.full_name}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Student
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  {userRole === 'admin' && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {student.email}
                      </span>
                    </div>
                  )}
                  
                  {student.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{student.phone}</span>
                    </div>
                  )}
                  
                  {student.student_class && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{student.student_class}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Joined {new Date(student.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{students.length}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {students.filter(s => s.created_at > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()).length}
            </div>
            <div className="text-sm text-muted-foreground">New This Month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{getUniqueClasses().length}</div>
            <div className="text-sm text-muted-foreground">Active Classes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {students.filter(s => s.phone).length}
            </div>
            <div className="text-sm text-muted-foreground">With Phone Numbers</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentManagement;