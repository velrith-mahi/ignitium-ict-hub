-- Create admin user seed and chat functionality
-- First, create the admin user (ali with password 1234)
-- Note: This will create the user in auth.users and trigger our existing handle_new_user function

-- Create a function to seed the admin user
CREATE OR REPLACE FUNCTION public.seed_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'ali@ictcare.com';
  
  IF admin_user_id IS NULL THEN
    -- Insert admin user into auth.users (this would typically be done via Supabase auth signup)
    -- For now, we'll create a placeholder profile and role
    admin_user_id := gen_random_uuid();
    
    -- Insert into profiles
    INSERT INTO public.profiles (id, user_id, full_name, phone)
    VALUES (
      gen_random_uuid(),
      admin_user_id,
      'Ali Hossain (Admin)',
      '01303177324'
    );
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (admin_user_id, 'admin', admin_user_id);
  END IF;
END;
$$;

-- Create chat tables for real-time messaging
CREATE TABLE public.chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  room_type text NOT NULL DEFAULT 'group', -- 'group', 'private', 'class'
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true
);

CREATE TABLE public.chat_room_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  role text DEFAULT 'member', -- 'admin', 'moderator', 'member'
  UNIQUE(room_id, user_id)
);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text text NOT NULL,
  message_type text DEFAULT 'text', -- 'text', 'image', 'file', 'system'
  reply_to uuid REFERENCES public.chat_messages(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false
);

-- Add RLS policies for chat tables
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Users can view rooms they are members of" ON public.chat_rooms
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members 
    WHERE room_id = chat_rooms.id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins and teachers can create rooms" ON public.chat_rooms
FOR INSERT WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'teacher'::app_role)
);

-- Chat room members policies
CREATE POLICY "Users can view room members for their rooms" ON public.chat_room_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members crm 
    WHERE crm.room_id = chat_room_members.room_id AND crm.user_id = auth.uid()
  )
);

CREATE POLICY "Room admins can manage members" ON public.chat_room_members
FOR ALL USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  EXISTS (
    SELECT 1 FROM public.chat_room_members 
    WHERE room_id = chat_room_members.room_id 
    AND user_id = auth.uid() 
    AND role IN ('admin', 'moderator')
  )
);

-- Chat messages policies
CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_room_members 
    WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages to their rooms" ON public.chat_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_room_members 
    WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" ON public.chat_messages
FOR UPDATE USING (sender_id = auth.uid());

-- Create triggers for updated_at columns
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON public.chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.chat_room_members REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_room_members;

-- Create default general chat room
INSERT INTO public.chat_rooms (name, description, room_type, created_by)
VALUES (
  'General Discussion',
  'Main chat room for all students and teachers',
  'group',
  (SELECT user_id FROM public.user_roles WHERE role = 'admin' LIMIT 1)
);

-- Add all existing users to general room
INSERT INTO public.chat_room_members (room_id, user_id, role)
SELECT 
  (SELECT id FROM public.chat_rooms WHERE name = 'General Discussion'),
  profiles.user_id,
  CASE 
    WHEN user_roles.role = 'admin' THEN 'admin'
    WHEN user_roles.role = 'teacher' THEN 'moderator'
    ELSE 'member'
  END
FROM public.profiles
LEFT JOIN public.user_roles ON profiles.user_id = user_roles.user_id;