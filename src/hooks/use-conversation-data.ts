
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
      if (!threadId) return null;
      
      console.log('Fetching summary for thread:', threadId);
      
      const { data, error } = await supabase
        .from('conversation_summaries')
        .select('*')
        .eq('conversation_thread_id', threadId)
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching conversation summary:', error);
        throw error;
      }
      
      console.log('Retrieved summary data:', data);
      
      // Process the summary data
      if (data && data.length > 0) {
        // First check if summary_data is already processed
        if (!data[0].summary_data && data[0].summary_text) {
          try {
            // Try to parse the summary_text as JSON
            data[0].summary_data = JSON.parse(data[0].summary_text);
            console.log('Parsed summary_data from summary_text:', data[0].summary_data);
          } catch (e) {
            console.error('Error parsing summary_text JSON:', e);
            data[0].summary_data = null;
          }
        } else if (typeof data[0].summary_data === 'string') {
          // If summary_data is a string, try to parse it
          try {
            data[0].summary_data = JSON.parse(data[0].summary_data as string);
            console.log('Parsed string summary_data to object:', data[0].summary_data);
          } catch (e) {
            console.error('Error parsing summary_data string:', e);
            data[0].summary_data = null;
          }
        }
        
        return data[0] as ConversationSummary;
      }
      
      return null;
    },
    enabled: !!threadId
  });
};

export const useThreadEmails = (threadId: string) => {
  return useQuery({
    queryKey: ['thread-emails', threadId],
    queryFn: async () => {
      if (!threadId) return [];
      
      console.log('Fetching emails for thread:', threadId);
      
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching thread emails:', error);
        throw error;
      }
      
      console.log('Retrieved emails:', data?.length || 0);
      
      return data as Email[] || [];
    },
    enabled: !!threadId
  });
};
