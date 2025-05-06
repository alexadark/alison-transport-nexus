
import React from 'react';
import ShippingOrderTracker from '@/components/ShippingOrderTracker';
import { useShippingOrders } from '@/hooks/use-shipping-orders';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar, PackageCheck, Ship } from 'lucide-react';

const ShippingOrders = () => {
  const { orders, isLoading, error } = useShippingOrders();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold">Shipping Orders</h1>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <PackageCheck className="h-4 w-4" />
            <span>Orders List</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <ChartBar className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ShippingOrderTracker orders={orders} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="flex items-center justify-center p-12 border rounded-lg">
            <div className="text-center">
              <Ship className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Analytics Coming Soon</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Detailed shipping order analytics will be available in a future update.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md">
          Error loading shipping orders: {error.message}
        </div>
      )}
    </div>
  );
};

export default ShippingOrders;
