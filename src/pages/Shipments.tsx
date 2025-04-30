
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
import { Search, Plus, Table, Columns, Upload, FileText, RefreshCw } from 'lucide-react';
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
import ShipmentsKanban from '@/components/ShipmentsKanban';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    documents: [
      { name: 'Invoice #45612', url: '#' },
      { name: 'Packing List', url: '#' }
    ],
    trackingInfo: [
      { date: '04/20/2025', location: 'New York Warehouse', status: 'Picked Up', notes: 'Shipment collected from supplier' },
      { date: '04/22/2025', location: 'JFK Airport', status: 'Departed', notes: 'On flight AA123' }
    ]
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
    documents: [
      { name: 'Commercial Invoice', url: '#' }
    ],
    trackingInfo: [
      { date: '04/18/2025', location: 'Seattle Office', status: 'Scheduled', notes: 'Awaiting pickup' }
    ]
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
    documents: [],
    trackingInfo: [
      { date: '04/15/2025', location: 'Shanghai HQ', status: 'Order Confirmed', notes: 'Documents in preparation' }
    ]
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
    documents: [],
    trackingInfo: []
  });
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('table');
  const [editableShipment, setEditableShipment] = useState<Shipment | null>(null);
  const [newDocument, setNewDocument] = useState({ name: '', url: '' });
  const [newTrackingInfo, setNewTrackingInfo] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    location: '', 
    status: 'Update', 
    notes: '' 
  });

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
      documents: [],
      trackingInfo: []
    });
  };

  const viewShipment = (id: string) => {
    const shipment = mockShipments.find(s => s.id === id);
    if (shipment) {
      setSelectedShipmentId(id);
      setEditableShipment({...shipment});
      setIsViewDialogOpen(true);
    }
  };

  const updateShipmentStatus = () => {
    if (!editableShipment) return;

    // In a real app, this would update the shipment in the database
    toast.success(`Shipment ${editableShipment.id} status updated to ${editableShipment.status}`);
    setIsViewDialogOpen(false);
  };

  const addDocument = () => {
    if (!newDocument.name || !newDocument.url || !editableShipment) return;
    
    const updatedDocs = [...(editableShipment.documents || []), newDocument];
    setEditableShipment({...editableShipment, documents: updatedDocs});
    setNewDocument({ name: '', url: '' });
    toast.success("Document added");
  };

  const addTrackingInfo = () => {
    if (!newTrackingInfo.location || !newTrackingInfo.status || !editableShipment) return;
    
    const updatedTracking = [...(editableShipment.trackingInfo || []), newTrackingInfo];
    setEditableShipment({...editableShipment, trackingInfo: updatedTracking});
    setNewTrackingInfo({ 
      date: new Date().toISOString().split('T')[0], 
      location: '', 
      status: 'Update', 
      notes: '' 
    });
    toast.success("Tracking information updated");
  };

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

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="flex space-x-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-1">
                <Table className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-1">
                <Columns className="h-4 w-4" />
                Kanban View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex w-full md:w-auto">
          <div className="relative flex-1 md:w-[200px]">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <p className="text-sm mb-2 text-muted-foreground">Filter by status:</p>
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
          <p className="text-sm mb-2 text-muted-foreground">Filter by agent:</p>
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
      </div>

      <TabsContent value="table" className={activeTab === 'table' ? 'block' : 'hidden'}>
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
      </TabsContent>

      <TabsContent value="kanban" className={activeTab === 'kanban' ? 'block' : 'hidden'}>
        <ShipmentsKanban 
          shipments={filteredShipments} 
          onView={viewShipment}
        />
      </TabsContent>

      {/* Enhanced Shipment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Shipment Details</DialogTitle>
          </DialogHeader>
          {editableShipment && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Basic Information</h3>
                    <div className="bg-muted/50 p-3 rounded-md space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Shipment ID</label>
                        <p className="font-semibold">{editableShipment.id}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Agent</label>
                        <Select value={editableShipment.agent} onValueChange={(value) => 
                          setEditableShipment({...editableShipment, agent: value})
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder={editableShipment.agent} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Menfield">Menfield</SelectItem>
                            <SelectItem value="AsiaTrade">AsiaTrade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Customer</label>
                        <Input 
                          value={editableShipment.customer} 
                          onChange={(e) => setEditableShipment({...editableShipment, customer: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Supplier</label>
                        <Input 
                          value={editableShipment.supplier} 
                          onChange={(e) => setEditableShipment({...editableShipment, supplier: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Route Information</h3>
                    <div className="bg-muted/50 p-3 rounded-md space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Origin</label>
                        <Input 
                          value={editableShipment.origin} 
                          onChange={(e) => setEditableShipment({...editableShipment, origin: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Destination</label>
                        <Input 
                          value={editableShipment.destination} 
                          onChange={(e) => setEditableShipment({...editableShipment, destination: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Delivery Date</label>
                        <Input 
                          type="text" 
                          value={editableShipment.deliveryDate}
                          onChange={(e) => setEditableShipment({...editableShipment, deliveryDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Status</label>
                        <Select 
                          value={editableShipment.status}
                          onValueChange={(value) => setEditableShipment({...editableShipment, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={editableShipment.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="Pickup">Pickup</SelectItem>
                            <SelectItem value="In Transit">In Transit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Documents</h3>
                      <Button size="sm" variant="outline" className="h-7 gap-1">
                        <Upload className="h-3.5 w-3.5" />
                        <span className="text-xs">Upload</span>
                      </Button>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      {editableShipment.documents && editableShipment.documents.length > 0 ? (
                        <div className="space-y-2">
                          {editableShipment.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-background p-2 rounded-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{doc.name}</span>
                              </div>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-3">No documents uploaded</p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Document name" 
                            className="text-sm"
                            value={newDocument.name}
                            onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                          />
                          <Input 
                            placeholder="URL or reference" 
                            className="text-sm"
                            value={newDocument.url}
                            onChange={(e) => setNewDocument({...newDocument, url: e.target.value})}
                          />
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shrink-0"
                            onClick={addDocument}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Tracking Info</h3>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-md">
                      {editableShipment.trackingInfo && editableShipment.trackingInfo.length > 0 ? (
                        <div className="space-y-3">
                          {editableShipment.trackingInfo.map((info, idx) => (
                            <div key={idx} className="bg-background p-2 rounded-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground">{info.date}</span>
                                <StatusBadge status={info.status} className="text-[10px] py-0 h-5" />
                              </div>
                              <p className="text-sm font-medium">{info.location}</p>
                              {info.notes && <p className="text-xs text-muted-foreground">{info.notes}</p>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-3">No tracking information available</p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input 
                            type="date" 
                            className="text-sm"
                            value={newTrackingInfo.date}
                            onChange={(e) => setNewTrackingInfo({...newTrackingInfo, date: e.target.value})}
                          />
                          <Select
                            value={newTrackingInfo.status}
                            onValueChange={(value) => setNewTrackingInfo({...newTrackingInfo, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Update">Update</SelectItem>
                              <SelectItem value="Confirmed">Confirmed</SelectItem>
                              <SelectItem value="Picked Up">Picked Up</SelectItem>
                              <SelectItem value="Departed">Departed</SelectItem>
                              <SelectItem value="Arrived">Arrived</SelectItem>
                              <SelectItem value="In Transit">In Transit</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input 
                          placeholder="Location" 
                          className="text-sm"
                          value={newTrackingInfo.location}
                          onChange={(e) => setNewTrackingInfo({...newTrackingInfo, location: e.target.value})}
                        />
                        <Input 
                          placeholder="Notes (optional)" 
                          className="text-sm"
                          value={newTrackingInfo.notes || ''}
                          onChange={(e) => setNewTrackingInfo({...newTrackingInfo, notes: e.target.value})}
                        />
                        <Button 
                          onClick={addTrackingInfo}
                          className="w-full mt-1 bg-status-transit hover:bg-status-transit/90"
                          size="sm"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-1" />
                          Add Tracking Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-status-transit hover:bg-status-transit/90"
                  onClick={updateShipmentStatus}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shipments;
