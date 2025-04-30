
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Eye } from 'lucide-react';
import { toast } from "sonner";

interface Shipment {
  id: string;
  agent: string;
  customer: string;
  supplier: string;
  origin: string;
  destination: string;
  status: string;
  deliveryDate: string;
  documents?: { name: string; url: string }[];
  trackingInfo?: { date: string; location: string; status: string; notes?: string }[];
}

interface ShipmentsKanbanProps {
  shipments: Shipment[];
  onView: (id: string) => void;
}

const ShipmentsKanban: React.FC<ShipmentsKanbanProps> = ({ shipments, onView }) => {
  // Create a local copy of shipments that we can modify when dragging
  const [localShipments, setLocalShipments] = useState<Shipment[]>(shipments);
  
  // Group shipments by status
  const confirmedShipments = localShipments.filter(shipment => shipment.status.toLowerCase() === 'confirmed');
  const pickupShipments = localShipments.filter(shipment => shipment.status.toLowerCase() === 'pickup');
  const inTransitShipments = localShipments.filter(shipment => shipment.status.toLowerCase() === 'in transit');
  
  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, shipment: Shipment) => {
    e.dataTransfer.setData('shipmentId', shipment.id);
  };
  
  // Function to handle drop
  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const shipmentId = e.dataTransfer.getData('shipmentId');
    const shipment = localShipments.find(s => s.id === shipmentId);
    
    if (shipment && shipment.status.toLowerCase() !== targetStatus.toLowerCase()) {
      // Update the shipment status in our local state
      const updatedShipments = localShipments.map(s => {
        if (s.id === shipmentId) {
          return { ...s, status: targetStatus };
        }
        return s;
      });
      
      setLocalShipments(updatedShipments);
      
      // Show toast notification
      toast.success(`Shipment ${shipmentId} moved to ${targetStatus}`);
    }
  };
  
  // Function to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Update local shipments when props change
  useEffect(() => {
    setLocalShipments(shipments);
  }, [shipments]);
  
  // Render a single shipment card
  const renderShipmentCard = (shipment: Shipment) => (
    <Card 
      key={shipment.id} 
      className="mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing" 
      draggable={true}
      onDragStart={(e) => handleDragStart(e, shipment)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{shipment.id}</h3>
            <p className="text-xs text-muted-foreground">
              {shipment.customer} - {shipment.deliveryDate}
            </p>
          </div>
          <StatusBadge status={shipment.status} />
        </div>
        
        <div className="text-xs">
          <div className="grid grid-cols-3 gap-1">
            <span className="text-muted-foreground">Origin:</span>
            <span className="col-span-2">{shipment.origin}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <span className="text-muted-foreground">Destination:</span>
            <span className="col-span-2">{shipment.destination}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <span className="text-muted-foreground">Agent:</span>
            <span className="col-span-2">{shipment.agent}</span>
          </div>
        </div>
        
        <div className="flex justify-end pt-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onView(shipment.id)}
            className="h-7 px-2 text-xs flex items-center"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Confirmed column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'Confirmed')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-confirmed mr-2"></div>
            Confirmed
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {confirmedShipments.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {confirmedShipments.map(renderShipmentCard)}
        </div>
      </div>

      {/* Pickup column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'Pickup')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-pickup mr-2"></div>
            Pickup
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {pickupShipments.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {pickupShipments.map(renderShipmentCard)}
        </div>
      </div>

      {/* In Transit column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'In Transit')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-transit mr-2"></div>
            In Transit
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {inTransitShipments.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {inTransitShipments.map(renderShipmentCard)}
        </div>
      </div>
    </div>
  );
};

export default ShipmentsKanban;
