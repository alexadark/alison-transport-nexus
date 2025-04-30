
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

interface SupplierLead {
  id: string;
  name: string;
  industry: string;
  contact: {
    name: string;
    email: string;
  };
  source: string;
  location: string;
  status: string;
  firstDetected: string;
  lastContact: string;
}

// Mock data for demonstration
const mockLeads: SupplierLead[] = [
  {
    id: 'SL-001',
    name: 'QuickShip Parts',
    industry: 'Manufacturing',
    contact: {
      name: 'Michael Roberts',
      email: 'm.roberts@quickship.com',
    },
    source: 'Detected from Order SH-007',
    location: 'Dallas, TX',
    status: 'New',
    firstDetected: '04/29/2025',
    lastContact: '-',
  },
  {
    id: 'SL-002',
    name: 'TechSupply Inc.',
    industry: 'Electronics',
    contact: {
      name: 'Jennifer Lee',
      email: 'j.lee@techsupply.com',
    },
    source: 'Quote QR-103',
    location: 'Chicago, IL',
    status: 'Contacted',
    firstDetected: '04/27/2025',
    lastContact: '04/28/2025',
  },
  {
    id: 'SL-003',
    name: 'Dome Parts Inc.',
    industry: 'Industrial',
    contact: {
      name: 'Robert Johnson',
      email: 'r.johnson@domeparts.com',
    },
    source: 'Detected from Order SH-002',
    location: 'Seattle, WA',
    status: 'Qualified',
    firstDetected: '04/15/2025',
    lastContact: '04/25/2025',
  },
];

const SupplierLeads = () => {
  const [currentTab, setCurrentTab] = useState("all");
  
  const filteredLeads = currentTab === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.status.toLowerCase() === currentTab.toLowerCase());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Supplier Lead Management</h1>
        <Button className="bg-status-new hover:bg-status-new/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <LeadTable leads={filteredLeads} />
        </TabsContent>
        <TabsContent value="new" className="mt-4">
          <LeadTable leads={filteredLeads} />
        </TabsContent>
        <TabsContent value="contacted" className="mt-4">
          <LeadTable leads={filteredLeads} />
        </TabsContent>
        <TabsContent value="qualified" className="mt-4">
          <LeadTable leads={filteredLeads} />
        </TabsContent>
        <TabsContent value="converted" className="mt-4">
          <LeadTable leads={filteredLeads} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface LeadTableProps {
  leads: SupplierLead[];
}

const LeadTable = ({ leads }: LeadTableProps) => {
  const getActionButton = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Button size="sm" className="bg-status-transit hover:bg-status-transit/90">Send Intro</Button>;
      case 'contacted':
        return <Button size="sm" className="bg-status-followup hover:bg-status-followup/90">Follow Up</Button>;
      case 'qualified':
        return <Button size="sm">Add to CRM</Button>;
      default:
        return <Button size="sm" variant="outline">View</Button>;
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Supplier</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Source</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">First Detected</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-muted/50">
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.industry}</div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <div>{lead.contact.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.contact.email}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm">{lead.source}</td>
                <td className="px-4 py-4 text-sm">{lead.location}</td>
                <td className="px-4 py-4 text-sm">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-4 text-sm">{lead.firstDetected}</td>
                <td className="px-4 py-4 text-sm">{lead.lastContact}</td>
                <td className="px-4 py-4 text-sm">
                  {getActionButton(lead.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierLeads;
