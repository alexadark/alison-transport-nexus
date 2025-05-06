
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
      
      // First try to find emails with matching thread_id
      const { data: threadEmails, error: threadError } = await supabase
        .from('emails')
        .select('*')
        .eq('thread_id', threadId)
        .order('received_at', { ascending: true });
      
      if (threadError) {
        console.error('Error fetching thread emails:', threadError);
        throw threadError;
      }
      
      // If we found emails directly linked to the thread, return them
      if (threadEmails && threadEmails.length > 0) {
        console.log(`Found ${threadEmails.length} emails with thread_id ${threadId}`);
        return threadEmails as Email[];
      }
      
      // If no emails were found by thread_id, try to find by matching subject
      console.log('No emails found with thread_id, trying to match by subject');
      
      // Get the thread to find its subject
      const { data: threadData, error: threadFetchError } = await supabase
        .from('conversation_threads')
        .select('subject')
        .eq('id', threadId)
        .single();
      
      if (threadFetchError) {
        console.error('Error fetching thread for subject match:', threadFetchError);
        return [];
      }
      
      if (threadData && threadData.subject) {
        // Clean the subject for comparison (trim and normalize whitespace)
        const normalizedThreadSubject = threadData.subject.trim().replace(/\s+/g, ' ');
        console.log('Looking for emails matching subject:', normalizedThreadSubject);
        
        // Get all emails (since we need to do custom filtering)
        const { data: allEmails, error: emailsError } = await supabase
          .from('emails')
          .select('*');
        
        if (emailsError) {
          console.error('Error fetching all emails:', emailsError);
          return [];
        }
        
        console.log('All emails from database:', allEmails);
        
        // Filter emails by normalized subject (case insensitive)
        const matchingEmails = allEmails?.filter(email => {
          if (!email.subject) return false;
          
          const normalizedEmailSubject = email.subject.trim().replace(/\s+/g, ' ');
          
          console.log(`Comparing: Thread "${normalizedThreadSubject}" vs Email "${normalizedEmailSubject}"`);
          
          // Very loose matching - check if any part matches
          const threadWords = normalizedThreadSubject.toLowerCase().split(' ');
          const emailWords = normalizedEmailSubject.toLowerCase().split(' ');
          
          // Check if there's any significant word overlap
          const commonWords = threadWords.filter(word => 
            word.length > 3 && emailWords.includes(word)
          );
          
          if (commonWords.length > 0) {
            console.log(`Match found with common words: ${commonWords.join(', ')}`);
            return true;
          }
          
          return false;
        });
        
        if (matchingEmails && matchingEmails.length > 0) {
          console.log(`Found ${matchingEmails.length} emails matching subject "${threadData.subject}"`);
          return matchingEmails.sort((a, b) => {
            // Safely sort by received_at date
            const dateA = a.received_at ? new Date(a.received_at).getTime() : 0;
            const dateB = b.received_at ? new Date(b.received_at).getTime() : 0;
            return dateA - dateB;
          }) as Email[];
        } else {
          console.log(`No emails found matching subject "${threadData.subject}"`);
          
          // For debugging: let's create a test message for this thread
          try {
            console.log('Creating a test message for thread:', threadId);
            const testMessage = {
              thread_id: threadId,
              message_content: "This is a test message created by the system to verify messaging functionality.",
              direction: 'incoming',
              sender_name: 'System Test',
              sender_email: 'system@test.com',
              subject: threadData.subject,
              received_at: new Date().toISOString(),
              status: 'received'
            };
            
            const { data: newEmail, error: insertError } = await supabase
              .from('emails')
              .insert(testMessage)
              .select();
              
            if (insertError) {
              console.error('Error creating test message:', insertError);
            } else {
              console.log('Test message created:', newEmail);
              return [newEmail[0]] as Email[];
            }
          } catch (e) {
            console.error('Exception creating test message:', e);
          }
        }
      }
      
      console.log('No emails found for thread, returning empty array');
      return [];
    },
    enabled: !!threadId,
    // Ensure data is refetched when threadId changes
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};
