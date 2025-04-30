
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import StatusBadge from '@/components/StatusBadge';
import { Search, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
}

// Mock data for demonstration
const mockShipments: Shipment[] = [
  {
    id: 'SH-001',
    agent: 'Menfield',
    customer: 'Acme Inc.',
    supplier: 'FastParts Ltd.',
    origin: 'New York, USA',
    destination: 'Madrid, Spain',
    status: 'In Transit',
    deliveryDate: '05/10/2025',
  },
  {
    id: 'SH-002',
    agent: 'Menfield',
    customer: 'TechCorp',
    supplier: 'Dome Parts Inc.',
    origin: 'Seattle, USA',
    destination: 'Tel Aviv, Israel',
    status: 'Pickup',
    deliveryDate: '05/15/2025',
  },
  {
    id: 'SH-003',
    agent: 'AsiaTrade',
    customer: 'Global Trade',
    supplier: 'ElectroCom',
    origin: 'Shanghai, China',
    destination: 'Amsterdam, NL',
    status: 'Confirmed',
    deliveryDate: '05/22/2025',
  },
];

const Shipments = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewShipmentDialogOpen, setIsNewShipmentDialogOpen] = useState<boolean>(false);
  const [newShipment, setNewShipment] = useState<Partial<Shipment>>({
    agent: 'Menfield',
    customer: '',
    supplier: '',
    origin: '',
    destination: '',
    status: 'Confirmed',
  });
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);

  const filteredShipments = mockShipments.filter((shipment) => {
    if (statusFilter !== 'all' && shipment.status !== statusFilter) return false;
    if (agentFilter !== 'all' && shipment.agent !== agentFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.supplier.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleCreateShipment = () => {
    if (!newShipment.customer || !newShipment.supplier || !newShipment.origin || !newShipment.destination) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    // In a real application, this would be an API call to add the shipment
    toast.success("Shipment created successfully");
    setIsNewShipmentDialogOpen(false);
    setNewShipment({
      agent: 'Menfield',
      customer: '',
      supplier: '',
      origin: '',
      destination: '',
      status: 'Confirmed',
    });
  };

  const viewShipment = (id: string) => {
    setSelectedShipmentId(id);
    setIsViewDialogOpen(true);
  };

  const selectedShipment = selectedShipmentId ? mockShipments.find(shipment => shipment.id === selectedShipmentId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <Dialog open={isNewShipmentDialogOpen} onOpenChange={setIsNewShipmentDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-status-transit hover:bg-status-transit/90">
              <Plus className="w-4 h-4 mr-2" />
              New Shipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Shipment</DialogTitle>
              <DialogDescription>
                Add a new shipment to the system. Fill in the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="agent" className="text-right">
                  Agent
                </label>
                <select
                  id="agent"
                  value={newShipment.agent}
                  onChange={(e) => setNewShipment({...newShipment, agent: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Menfield">Menfield</option>
                  <option value="AsiaTrade">AsiaTrade</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer" className="text-right">
                  Customer*
                </label>
                <Input
                  id="customer"
                  value={newShipment.customer}
                  onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="supplier" className="text-right">
                  Supplier*
                </label>
                <Input
                  id="supplier"
                  value={newShipment.supplier}
                  onChange={(e) => setNewShipment({...newShipment, supplier: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="origin" className="text-right">
                  Origin*
                </label>
                <Input
                  id="origin"
                  value={newShipment.origin}
                  onChange={(e) => setNewShipment({...newShipment, origin: e.target.value})}
                  className="col-span-3"
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="destination" className="text-right">
                  Destination*
                </label>
                <Input
                  id="destination"
                  value={newShipment.destination}
                  onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                  className="col-span-3"
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="status" className="text-right">
                  Status
                </label>
                <select
                  id="status"
                  value={newShipment.status}
                  onChange={(e) => setNewShipment({...newShipment, status: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pickup">Pickup</option>
                  <option value="In Transit">In Transit</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewShipmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={handleCreateShipment}>
                Create Shipment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="col-span-1">
          <p className="text-sm mb-2 text-muted-foreground">Filter by:</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <p className="text-sm mb-2 opacity-0">.</p>
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="Menfield">Menfield</SelectItem>
              <SelectItem value="AsiaTrade">AsiaTrade</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <p className="text-sm mb-2 opacity-0">.</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              className="pl-9" 
              placeholder="Search shipments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Agent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Origin</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Destination</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Delivery Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 text-sm">{shipment.id}</td>
                  <td className="px-4 py-4 text-sm">{shipment.agent}</td>
                  <td className="px-4 py-4 text-sm">{shipment.customer}</td>
                  <td className="px-4 py-4 text-sm">{shipment.supplier}</td>
                  <td className="px-4 py-4 text-sm">{shipment.origin}</td>
                  <td className="px-4 py-4 text-sm">{shipment.destination}</td>
                  <td className="px-4 py-4 text-sm">
                    <StatusBadge status={shipment.status} />
                  </td>
                  <td className="px-4 py-4 text-sm">{shipment.deliveryDate}</td>
                  <td className="px-4 py-4 text-sm">
                    <Button variant="outline" size="sm" onClick={() => viewShipment(shipment.id)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Shipment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shipment Details</DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Shipment ID:</span>
                <span className="col-span-2">{selectedShipment.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Agent:</span>
                <span className="col-span-2">{selectedShipment.agent}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Customer:</span>
                <span className="col-span-2">{selectedShipment.customer}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Supplier:</span>
                <span className="col-span-2">{selectedShipment.supplier}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Origin:</span>
                <span className="col-span-2">{selectedShipment.origin}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Destination:</span>
                <span className="col-span-2">{selectedShipment.destination}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  <StatusBadge status={selectedShipment.status} />
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Delivery Date:</span>
                <span className="col-span-2">{selectedShipment.deliveryDate}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={() => {
                toast.success(`Shipment ${selectedShipmentId} status updated`);
                setIsViewDialogOpen(false);
              }}>
                Update Status
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shipments;
