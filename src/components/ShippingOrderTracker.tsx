
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShippingOrder } from '@/hooks/use-shipping-orders';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/StatusBadge';
import { Package, FileText, Eye } from 'lucide-react';

interface ShippingOrderTrackerProps {
  orders: ShippingOrder[];
  isLoading: boolean;
}

const ShippingOrderTracker: React.FC<ShippingOrderTrackerProps> = ({ orders, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Extract unique statuses from orders
  const uniqueStatuses = [...new Set(orders.map(order => order.status))];
  
  // Filter orders based on search query and selected status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.ordernumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.origin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus === null || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Shipping Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Shipping Orders
        </CardTitle>
        <div className="flex gap-2 items-center">
          <div>
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-[200px]"
            />
          </div>
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant={selectedStatus === null ? "secondary" : "outline"}
              onClick={() => setSelectedStatus(null)}
              className="h-9"
            >
              All
            </Button>
            {uniqueStatuses.map(status => (
              <Button
                key={status}
                size="sm"
                variant={selectedStatus === status ? "secondary" : "outline"}
                onClick={() => setSelectedStatus(status)}
                className="h-9"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders.length > 0 ? (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{order.ordernumber || "N/A"}</TableCell>
                    <TableCell>{order.origin || "N/A"}</TableCell>
                    <TableCell>{order.destination || "N/A"}</TableCell>
                    <TableCell>{order.modeoftransport || "N/A"}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status || "Unknown"} />
                    </TableCell>
                    <TableCell>
                      {order.created_at ? format(new Date(order.created_at), 'MMM dd, yyyy') : "N/A"}
                    </TableCell>
                    <TableCell>
                      {order.requesteddeliverydate ? format(new Date(order.requesteddeliverydate), 'MMM dd, yyyy') : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || selectedStatus ? "Try adjusting your filters" : "There are no shipping orders in the system"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingOrderTracker;
