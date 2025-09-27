import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Plus, 
  Clock, 
  Users, 
  BookOpen,
  Edit3,
  Trash2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClassSchedule {
  id: string;
  title: string;
  description: string | null;
  class_type: string;
  scheduled_at: string;
  duration_minutes: number | null;
  is_active: boolean | null;
  teacher_id: string;
  created_at: string;
  updated_at: string;
}

const ClassScheduleManagement = () => {
  const { userRole, user } = useAuth();
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classType, setClassType] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(90);

  useEffect(() => {
    fetchSchedules();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('schedules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_schedules'
        },
        () => {
          fetchSchedules();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSchedules = async () => {
    try {
      let query = supabase
        .from('class_schedules')
        .select('*')
        .order('scheduled_at', { ascending: true });
      
      // Teachers only see their own schedules
      if (userRole === 'teacher' && user) {
        query = query.eq('teacher_id', user.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setSchedules(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch class schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async () => {
    if (!title || !classType || !scheduledAt || !user) return;

    try {
      setIsCreating(true);
      
      const { error } = await supabase.from('class_schedules').insert({
        title,
        description,
        class_type: classType,
        scheduled_at: scheduledAt,
        duration_minutes: duration,
        teacher_id: user.id,
        is_active: true
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class scheduled successfully"
      });

      // Reset form
      setTitle('');
      setDescription('');
      setClassType('');
      setScheduledAt('');
      setDuration(90);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create schedule",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const toggleScheduleStatus = async (scheduleId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .update({ is_active: !currentStatus })
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Class ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update class status",
        variant: "destructive"
      });
    }
  };

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Class deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive"
      });
    }
  };

  const getSchedulesForWeek = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.scheduled_at);
      return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const getClassTypeBadge = (type: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      'SSC': 'default',
      'HSC': 'secondary',
      'University': 'destructive',
      'Revision': 'outline'
    };
    return variants[type] || 'outline';
  };

  const canCreateSchedule = userRole === 'admin' || userRole === 'teacher';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const weeklySchedules = getSchedulesForWeek();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Class Schedule</h1>
        </div>
        
        {canCreateSchedule && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-hero">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Class</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., ICT Chapter 1"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Class Type</label>
                    <Select value={classType} onValueChange={setClassType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SSC">SSC</SelectItem>
                        <SelectItem value="HSC">HSC</SelectItem>
                        <SelectItem value="University">University Admission</SelectItem>
                        <SelectItem value="Revision">Revision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the class..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                    <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                        <SelectItem value="180">180 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    onClick={createSchedule}
                    disabled={!title || !classType || !scheduledAt || isCreating}
                    className="btn-hero"
                  >
                    {isCreating ? 'Scheduling...' : 'Schedule Class'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Week Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigateWeek('prev')} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          
          <div className="text-center">
            <h3 className="font-semibold">
              {currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long',
                day: 'numeric'
              })} Week
            </h3>
            <p className="text-sm text-muted-foreground">
              {weeklySchedules.length} classes scheduled
            </p>
          </div>
          
          <Button onClick={() => navigateWeek('next')} variant="outline" size="sm">
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Schedules List */}
      <div className="space-y-4">
        {weeklySchedules.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No classes this week</h3>
            <p className="text-muted-foreground">
              {canCreateSchedule ? 'Schedule your first class to get started.' : 'Check back later for upcoming classes.'}
            </p>
          </Card>
        ) : (
          weeklySchedules.map((schedule) => {
            const scheduleDate = new Date(schedule.scheduled_at);
            const isUpcoming = scheduleDate > new Date();
            const isPast = scheduleDate < new Date();
            
            return (
              <Card key={schedule.id} className="card-glow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{schedule.title}</h3>
                        <Badge variant={getClassTypeBadge(schedule.class_type)}>
                          {schedule.class_type}
                        </Badge>
                        
                        {schedule.is_active ? (
                          <Badge variant="default" className="text-xs">
                            <Play className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Pause className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                        
                        {isPast && (
                          <Badge variant="outline" className="text-xs">
                            Completed
                          </Badge>
                        )}
                        
                        {isUpcoming && (
                          <Badge variant="destructive" className="text-xs">
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      
                      {schedule.description && (
                        <p className="text-muted-foreground mb-3">{schedule.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {scheduleDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {scheduleDate.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} ({schedule.duration_minutes || 90} min)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {canCreateSchedule && schedule.teacher_id === user?.id && (
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleScheduleStatus(schedule.id, schedule.is_active)}
                      >
                        {schedule.is_active ? (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Upcoming Classes Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {schedules.filter(s => new Date(s.scheduled_at) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">Total Upcoming</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {schedules.filter(s => s.class_type === 'SSC' && new Date(s.scheduled_at) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">SSC Classes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {schedules.filter(s => s.class_type === 'HSC' && new Date(s.scheduled_at) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">HSC Classes</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {schedules.filter(s => s.class_type === 'University' && new Date(s.scheduled_at) > new Date()).length}
            </div>
            <div className="text-sm text-muted-foreground">University Prep</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClassScheduleManagement;