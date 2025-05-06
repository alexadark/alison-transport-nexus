
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ShippingOrder {
  id: string;
  ordernumber: string;
  origin: string;
  destination: string;
  modeoftransport: string;
  incoterm: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer_contact_id: string;
  supplier_contact_id: string;
  totalpieces: number;
  requesteddeliverydate: string;
  agent_contact_id: string;
  related_thread_id: string;
  related_quote_id: string;
  instructions?: string;
  dimensions?: any;
  totalweight?: any;
}

export const useShippingOrders = () => {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchShippingOrders = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('shipping_orders')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        
        setOrders(data || []);
        console.log("Fetched shipping orders:", data);
      } catch (err) {
        console.error("Error fetching shipping orders:", err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingOrders();
  }, []);
  
  const getOrderById = (id: string): ShippingOrder | undefined => {
    return orders.find(order => order.id === id);
  };

  return { orders, isLoading, error, getOrderById };
};
