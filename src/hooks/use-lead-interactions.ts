import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Email } from '@/types/conversations';
import { SupplierLead } from './use-leads';

export const useLeadInteractions = (lead: SupplierLead | null) => {
  return useQuery({
    queryKey: ['lead-interactions', lead?.id],
    queryFn: async () => {
      if (!lead) return [];
      
      // First, try to find emails by matching thread ID if the lead has an originating_thread_id
      if (lead.source && lead.source.includes('Thread ID:')) {
        const threadId = lead.source.split('Thread ID:')[1].trim();
        
        const { data: threadEmails, error: threadError } = await supabase
          .from('emails')
          .select('*')
          .eq('thread_id', threadId)
          .order('received_at', { ascending: false });
        
        if (threadError) {
          console.error('Error fetching thread emails:', threadError);
          throw threadError;
        }
        
        if (threadEmails && threadEmails.length > 0) {
          return threadEmails as Email[];
        }
      }
      
      // Otherwise, try to find emails by matching contact email
      if (lead.contact?.email) {
        const { data: contactEmails, error: contactError } = await supabase
          .from('emails')
          .select('*')
          .ilike('sender_email', `%${lead.contact.email}%`)
          .order('received_at', { ascending: false });
        
        if (contactError) {
          console.error('Error fetching contact emails:', contactError);
          throw contactError;
        }
        
        if (contactEmails && contactEmails.length > 0) {
          return contactEmails as Email[];
        }
      }
      
      // If no emails were found, return an empty array
      return [];
    },
    enabled: !!lead
  });
};
