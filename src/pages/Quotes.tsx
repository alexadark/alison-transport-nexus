
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusBadge from '@/components/StatusBadge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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

interface Quote {
  id: string;
  customer: string;
  agent: string;
  origin: string;
  destination: string;
  items: string;
  status: string;
  requestDate: string;
  expiryDate: string;
}

// Mock data for demonstration
const mockQuotes: Quote[] = [
  {
    id: 'QR-101',
    customer: 'Acme Inc.',
    agent: 'Menfield',
    origin: 'New York, USA',
    destination: 'Madrid, Spain',
    items: 'Electronics components',
    status: 'New',
    requestDate: '04/27/2025',
    expiryDate: '05/11/2025',
  },
  {
    id: 'QR-102',
    customer: 'Global Trade',
    agent: 'AsiaTrade',
    origin: 'Shanghai, China',
    destination: 'Amsterdam, NL',
    items: 'Textile machinery',
    status: 'Quoted',
    requestDate: '04/26/2025',
    expiryDate: '05/10/2025',
  },
  {
    id: 'QR-103',
    customer: 'TechCorp',
    agent: 'Menfield',
    origin: 'Seattle, USA',
    destination: 'Tel Aviv, Israel',
    items: 'Dome parts (500kg)',
    status: 'Accepted',
    requestDate: '04/25/2025',
    expiryDate: '05/09/2025',
  },
];

const QuotesPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    customer: '',
    agent: 'Menfield',
    origin: '',
    destination: '',
    items: '',
    status: 'New',
  });
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);

  const filteredQuotes = mockQuotes.filter((quote) => {
    if (statusFilter !== 'all' && quote.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        quote.id.toLowerCase().includes(query) ||
        quote.customer.toLowerCase().includes(query) ||
        quote.agent.toLowerCase().includes(query) ||
        quote.origin.toLowerCase().includes(query) ||
        quote.destination.toLowerCase().includes(query) ||
        quote.items.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleCreateQuote = () => {
    if (!newQuote.customer || !newQuote.origin || !newQuote.destination || !newQuote.items) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    // In a real application, this would be an API call to add the quote
    toast.success("Quote created successfully");
    setIsCreateDialogOpen(false);
    setNewQuote({
      customer: '',
      agent: 'Menfield',
      origin: '',
      destination: '',
      items: '',
      status: 'New',
    });
  };

  const viewQuote = (id: string) => {
    setSelectedQuoteId(id);
    setIsViewDialogOpen(true);
  };

  const selectedQuote = selectedQuoteId ? mockQuotes.find(quote => quote.id === selectedQuoteId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quote Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-status-transit hover:bg-status-transit/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Quote</DialogTitle>
              <DialogDescription>
                Create a new quote for a customer. Fill in the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer" className="text-right">
                  Customer*
                </label>
                <Input
                  id="customer"
                  value={newQuote.customer}
                  onChange={(e) => setNewQuote({...newQuote, customer: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="agent" className="text-right">
                  Agent
                </label>
                <select
                  id="agent"
                  value={newQuote.agent}
                  onChange={(e) => setNewQuote({...newQuote, agent: e.target.value})}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Menfield">Menfield</option>
                  <option value="AsiaTrade">AsiaTrade</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="origin" className="text-right">
                  Origin*
                </label>
                <Input
                  id="origin"
                  value={newQuote.origin}
                  onChange={(e) => setNewQuote({...newQuote, origin: e.target.value})}
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
                  value={newQuote.destination}
                  onChange={(e) => setNewQuote({...newQuote, destination: e.target.value})}
                  className="col-span-3"
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="items" className="text-right">
                  Items*
                </label>
                <Input
                  id="items"
                  value={newQuote.items}
                  onChange={(e) => setNewQuote({...newQuote, items: e.target.value})}
                  className="col-span-3"
                  placeholder="Description and weight"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={handleCreateQuote}>
                Create Quote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm mb-2 text-muted-foreground">Filter by Status:</p>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="quoted">Quoted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm mb-2 opacity-0">.</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              className="pl-9" 
              placeholder="Search quotes..." 
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
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Agent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Route</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Items</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Request Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Expiry Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4 text-sm">{quote.id}</td>
                  <td className="px-4 py-4 text-sm">{quote.customer}</td>
                  <td className="px-4 py-4 text-sm">{quote.agent}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium">{quote.origin}</span>
                      <span className="text-xs text-muted-foreground">to</span>
                      <span className="font-medium">{quote.destination}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{quote.items}</td>
                  <td className="px-4 py-4 text-sm">
                    <StatusBadge status={quote.status === 'New' ? 'New' : 
                                        quote.status === 'Quoted' ? 'Contacted' :
                                        quote.status === 'Accepted' ? 'Confirmed' : 'Contacted'} />
                  </td>
                  <td className="px-4 py-4 text-sm">{quote.requestDate}</td>
                  <td className="px-4 py-4 text-sm">{quote.expiryDate}</td>
                  <td className="px-4 py-4 text-sm">
                    <Button variant="outline" size="sm" onClick={() => viewQuote(quote.id)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Quote Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Quote ID:</span>
                <span className="col-span-2">{selectedQuote.id}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Customer:</span>
                <span className="col-span-2">{selectedQuote.customer}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Agent:</span>
                <span className="col-span-2">{selectedQuote.agent}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Origin:</span>
                <span className="col-span-2">{selectedQuote.origin}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Destination:</span>
                <span className="col-span-2">{selectedQuote.destination}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Items:</span>
                <span className="col-span-2">{selectedQuote.items}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  <StatusBadge status={selectedQuote.status === 'New' ? 'New' : 
                                      selectedQuote.status === 'Quoted' ? 'Contacted' :
                                      selectedQuote.status === 'Accepted' ? 'Confirmed' : 'Contacted'} />
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Request Date:</span>
                <span className="col-span-2">{selectedQuote.requestDate}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-medium">Expiry Date:</span>
                <span className="col-span-2">{selectedQuote.expiryDate}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={() => {
                toast.success(`Quote ${selectedQuoteId} updated to Quoted status`);
                setIsViewDialogOpen(false);
              }}>
                Send Quote
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuotesPage;
