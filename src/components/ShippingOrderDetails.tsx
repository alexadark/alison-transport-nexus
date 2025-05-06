
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ShippingOrder } from '@/hooks/use-shipping-orders';
import StatusBadge from '@/components/StatusBadge';
import { Package, MapPin, Truck, FileText } from 'lucide-react';

interface ShippingOrderDetailsProps {
  order: ShippingOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShippingOrderDetails: React.FC<ShippingOrderDetailsProps> = ({
  order,
  open,
  onOpenChange,
}) => {
  if (!order) return null;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const parseWeight = (weightJson: any): string => {
    if (!weightJson) return 'Not specified';
    try {
      const weight = typeof weightJson === 'string' ? JSON.parse(weightJson) : weightJson;
      if (weight.value && weight.unit) {
        return `${weight.value} ${weight.unit}`;
      }
      return 'Not specified';
    } catch (e) {
      return 'Not specified';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Shipping Order {order.ordernumber || 'No reference number'}
          </DialogTitle>
          <DialogDescription>
            Created on {formatDate(order.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="mt-1">
                <StatusBadge status={order.status || 'Unknown'} />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Route</h3>
              <div className="mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.origin || 'N/A'}</span>
                <span className="mx-2">→</span>
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.destination || 'N/A'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Transport Mode</h3>
              <div className="mt-1 flex items-center gap-1">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <span>{order.modeoftransport || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Incoterm</h3>
              <p>{order.incoterm || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Requested Delivery Date</h3>
              <p>{formatDate(order.requesteddeliverydate)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Cargo Details</h3>
              <p>Pieces: {order.totalpieces || 'Not specified'}</p>
              <p>Weight: {parseWeight(order.totalweight)}</p>
            </div>
          </div>
          
          {order.instructions && (
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Instructions</h3>
              <div className="mt-1 p-2 bg-muted rounded-md">
                <p className="text-sm whitespace-pre-wrap">{order.instructions}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingOrderDetails;
