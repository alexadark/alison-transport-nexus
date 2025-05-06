
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ConversationThread, ConversationSummary, Email } from '@/types/conversations';

export const useConversationThreads = (agentFilter?: string) => {
  return useQuery({
    queryKey: ['conversation-threads', agentFilter],
    queryFn: async () => {
      let query = supabase
        .from('conversation_threads')
        .select('*');
      
      // We can add filter by agent in the future if needed
      // if (agentFilter) {
      //   query = query.eq('agent', agentFilter);
      // }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ConversationThread[];
    }
  });
};

export const useLatestConversationSummary = (threadId: string) => {
  return useQuery({
    queryKey: ['conversation-summary', threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('conversation_thread_id', threadId)
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data[0] as ConversationSummary || null;
    },
    enabled: !!threadId
  });
};

export const useThreadEmails = (threadId: string) => {
  return useQuery({
    queryKey: ['thread-emails', threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });
      
      if (error) throw error;
      return data as Email[];
    },
    enabled: !!threadId
  });
};
