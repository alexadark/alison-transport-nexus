
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quote Management</h1>
        <Button className="bg-status-transit hover:bg-status-transit/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </Button>
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
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuotesPage;
