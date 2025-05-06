
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupplierLead {
  id: string;
  name: string;
  industry?: string;
  contact: {
    name: string;
    email: string;
  };
  source?: string;
  location?: string;
  status: string;
  firstDetected: string;
  lastContact?: string;
}

export const useLeads = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['leads', searchQuery],
    queryFn: async () => {
      // Start with a query that joins leads with contacts to get contact information
      let query = supabase
        .from('leads')
        .select(`
          *,
          contact:contact_id (
            id,
            contact_name,
            company_name,
            email,
            city,
            country
          )
        `);
      
      // If there's a search query, filter results
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        // Search in both leads and related contact fields
        query = query.or(`
          supplier_contact_name.ilike.%${searchLower}%,
          supplier_email.ilike.%${searchLower}%,
          status.ilike.%${searchLower}%,
          contact.company_name.ilike.%${searchLower}%,
          contact.contact_name.ilike.%${searchLower}%
        `);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }
      
      // Map the database response to our SupplierLead interface
      return data.map(item => {
        // Format dates for display
        const createdDate = new Date(item.created_at);
        const formattedCreatedDate = `${createdDate.getMonth() + 1}/${createdDate.getDate()}/${createdDate.getFullYear()}`;
        
        // Format last contact date if it exists
        let formattedLastContact = '-';
        if (item.updated_at && item.updated_at !== item.created_at) {
          const lastContactDate = new Date(item.updated_at);
          formattedLastContact = `${lastContactDate.getMonth() + 1}/${lastContactDate.getDate()}/${lastContactDate.getFullYear()}`;
        }
        
        return {
          id: item.id,
          name: item.contact?.company_name || 'Unknown Company',
          industry: 'General', // Default industry since it's not in the database schema
          contact: {
            name: item.supplier_contact_name || item.contact?.contact_name || 'Unknown',
            email: item.supplier_email || item.contact?.email || '',
          },
          source: item.source_email_id ? `Email ID: ${item.source_email_id}` : (
            item.originating_thread_id ? `Thread ID: ${item.originating_thread_id}` : 'Manual Entry'
          ),
          location: item.contact?.city && item.contact?.country ? 
            `${item.contact.city}, ${item.contact.country}` : 'Unknown',
          status: item.status || 'New',
          firstDetected: formattedCreatedDate,
          lastContact: formattedLastContact,
        } as SupplierLead;
      });
    }
  });
};
