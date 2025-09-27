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
  Bell, 
  Plus, 
  Send, 
  Users, 
  Calendar,
  Edit3,
  Eye,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Notice {
  id: string;
  title: string;
  content: string;
  target_audience: string[] | null;
  is_published: boolean;
  created_at: string;
  created_by: string;
}

const NoticeBoard = () => {
  const { userRole, user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAudience, setTargetAudience] = useState<string[]>(['all']);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchNotices();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notices'
        },
        () => {
          fetchNotices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotices = async () => {
    try {
      let query = supabase.from('notices').select('*').order('created_at', { ascending: false });
      
      // Students only see published notices
      if (userRole === 'student') {
        query = query.eq('is_published', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch notices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createNotice = async () => {
    if (!title || !content || !user) return;

    try {
      setIsCreating(true);
      
      const { error } = await supabase.from('notices').insert([{
        title,
        content,
        target_audience: targetAudience.includes('all') ? null : targetAudience as ('admin' | 'teacher' | 'student')[],
        is_published: isPublished,
        created_by: user.id
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notice created successfully"
      });

      // Reset form
      setTitle('');
      setContent('');
      setTargetAudience(['all']);
      setIsPublished(false);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create notice",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const togglePublishStatus = async (noticeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({ is_published: !currentStatus })
        .eq('id', noticeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Notice ${!currentStatus ? 'published' : 'unpublished'} successfully`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update notice status",
        variant: "destructive"
      });
    }
  };

  const getAudienceBadge = (audience: string[] | null) => {
    if (!audience) return <Badge variant="default">All Users</Badge>;
    
    return (
      <div className="flex gap-1 flex-wrap">
        {audience.map((role) => (
          <Badge key={role} variant="secondary" className="text-xs">
            {role.charAt(0).toUpperCase() + role.slice(1)}s
          </Badge>
        ))}
      </div>
    );
  };

  const canCreateNotice = userRole === 'admin' || userRole === 'teacher';

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
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Notice Board</h1>
        </div>
        
        {canCreateNotice && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notice title..."
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter notice content..."
                    rows={6}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Target Audience</label>
                  <Select value={targetAudience[0]} onValueChange={(value) => {
                    if (value === 'all') {
                      setTargetAudience(['all']);
                    } else {
                      setTargetAudience([value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="student">Students Only</SelectItem>
                      <SelectItem value="teacher">Teachers Only</SelectItem>
                      <SelectItem value="admin">Admins Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="publish"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="publish" className="text-sm font-medium">
                    Publish immediately
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    onClick={createNotice}
                    disabled={!title || !content || isCreating}
                    className="btn-hero"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isCreating ? 'Creating...' : 'Create Notice'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No notices yet</h3>
            <p className="text-muted-foreground">
              {canCreateNotice ? 'Create your first notice to get started.' : 'Check back later for updates.'}
            </p>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="card-glow p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{notice.title}</h3>
                        {notice.is_published ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {notice.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(notice.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {getAudienceBadge(notice.target_audience)}
                          </div>
                        </div>
                        
                        {canCreateNotice && notice.created_by === user?.id && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublishStatus(notice.id, notice.is_published)}
                            >
                              {notice.is_published ? (
                                <>
                                  <Eye className="h-3 w-3 mr-1" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Publish
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;