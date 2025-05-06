
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Contact {
  id: string;
  name: string;
  company: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export const useContacts = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['contacts', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('contacts')
        .select('*');
      
      // If there's a search query, filter results
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        query = query.or(`contact_name.ilike.%${searchLower}%,company_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%,city.ilike.%${searchLower}%,country.ilike.%${searchLower}%,contact_type.ilike.%${searchLower}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
      
      // Map the database columns to our Contact interface
      return data.map(item => ({
        id: item.id,
        name: item.contact_name || 'Unknown',
        company: item.company_name || 'Unknown',
        type: item.contact_type || 'Unknown',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || '',
        city: item.city || '',
        country: item.country || '',
      })) as Contact[];
    }
  });
};
