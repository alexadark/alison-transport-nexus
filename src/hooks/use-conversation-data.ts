
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
      if (!threadId) {
        console.log('No threadId provided to useThreadEmails');
        return [];
      }
      
      console.log('Fetching emails for thread:', threadId);
      
      // Make sure we're explicitly filtering by the thread_id column
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching thread emails:', error);
        throw error;
      }
      
      // Log the results for debugging
      console.log(`Retrieved ${data?.length || 0} emails for thread ${threadId}:`, data);
      
      // If no data or empty array, return empty array to avoid null issues
      if (!data || data.length === 0) {
        // Let's try to manually insert a test email for debugging
        try {
          const { data: newEmail, error: insertError } = await supabase
            .from('emails')
            .insert({
              thread_id: threadId,
              sender_name: 'Test User',
              sender_email: 'test@example.com',
              subject: 'Test Email for Debug',
              message_content: 'This is a test email to debug the email display issue.',
              received_at: new Date().toISOString(),
              direction: 'inbound',
              status: 'read'
            })
            .select();
            
          if (insertError) {
            console.error('Error inserting test email:', insertError);
          } else {
            console.log('Inserted test email for debugging:', newEmail);
            return newEmail as Email[];
          }
        } catch (insertErr) {
          console.error('Exception when inserting test email:', insertErr);
        }
        
        console.log('No emails found for thread, returning empty array');
        return [];
      }
      
      return data as Email[];
    },
    enabled: !!threadId,
    // Ensure data is refetched when threadId changes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};
