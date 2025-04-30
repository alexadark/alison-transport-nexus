
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SupplierDetailsView from '@/components/SupplierDetailsView';

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

// Form schema for adding a new supplier
const supplierFormSchema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  contactName: z.string().min(1, { message: "Contact name is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  source: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const SupplierLeads = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedLead, setSelectedLead] = useState<SupplierLead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      location: "",
      contactName: "",
      contactEmail: "",
      source: "",
    },
  });

  const filteredLeads = currentTab === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.status.toLowerCase() === currentTab.toLowerCase());
  
  const onSubmit = (data: SupplierFormValues) => {
    // This would send the data to the database in a real application
    console.log("Form submitted:", data);
    toast({
      title: "Supplier added",
      description: `${data.name} has been added as a new supplier lead.`,
    });
    form.reset();
  };

  const handleViewLead = (lead: SupplierLead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  };

  const handleAction = (lead: SupplierLead) => {
    let actionMessage = "";
    
    switch (lead.status.toLowerCase()) {
      case 'new':
        actionMessage = `Introduction email sent to ${lead.contact.name}`;
        break;
      case 'contacted':
        actionMessage = `Follow-up initiated with ${lead.contact.name}`;
        break;
      case 'qualified':
        actionMessage = `${lead.name} added to CRM`;
        break;
      default:
        actionMessage = `Action performed for ${lead.name}`;
    }
    
    toast({
      title: "Action performed",
      description: actionMessage,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Supplier Lead Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-status-new hover:bg-status-new/90 text-white self-start">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier Lead</DialogTitle>
              <DialogDescription>
                Enter the details of the potential supplier below.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter company name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter industry" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="City, State" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source (Optional)</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How was this lead found?" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="text-white">Add Supplier</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" onValueChange={setCurrentTab} className="w-full">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <LeadTable 
            leads={filteredLeads} 
            onView={handleViewLead} 
            onAction={handleAction} 
            isMobile={isMobile} 
          />
        </TabsContent>
        <TabsContent value="new" className="mt-4">
          <LeadTable 
            leads={filteredLeads} 
            onView={handleViewLead} 
            onAction={handleAction} 
            isMobile={isMobile} 
          />
        </TabsContent>
        <TabsContent value="contacted" className="mt-4">
          <LeadTable 
            leads={filteredLeads} 
            onView={handleViewLead} 
            onAction={handleAction} 
            isMobile={isMobile} 
          />
        </TabsContent>
        <TabsContent value="qualified" className="mt-4">
          <LeadTable 
            leads={filteredLeads} 
            onView={handleViewLead}  
            onAction={handleAction} 
            isMobile={isMobile} 
          />
        </TabsContent>
        <TabsContent value="converted" className="mt-4">
          <LeadTable 
            leads={filteredLeads} 
            onView={handleViewLead} 
            onAction={handleAction} 
            isMobile={isMobile} 
          />
        </TabsContent>
      </Tabs>

      {selectedLead && (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Supplier Lead Details</DialogTitle>
            </DialogHeader>
            <SupplierDetailsView lead={selectedLead} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface LeadTableProps {
  leads: SupplierLead[];
  onView: (lead: SupplierLead) => void;
  onAction: (lead: SupplierLead) => void;
  isMobile: boolean;
}

const LeadTable = ({ leads, onView, onAction, isMobile }: LeadTableProps) => {
  const getActionButton = (status: string, lead: SupplierLead) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Button size="sm" onClick={() => onAction(lead)} className="bg-status-transit hover:bg-status-transit/90 text-white">Send Intro</Button>;
      case 'contacted':
        return <Button size="sm" onClick={() => onAction(lead)} className="bg-status-followup hover:bg-status-followup/90 text-white">Follow Up</Button>;
      case 'qualified':
        return <Button size="sm" onClick={() => onAction(lead)} className="bg-primary text-white">Add to CRM</Button>;
      default:
        return <Button size="sm" onClick={() => onAction(lead)} variant="outline">View</Button>;
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{lead.name}</h3>
                <p className="text-xs text-muted-foreground">{lead.industry}</p>
              </div>
              <StatusBadge status={lead.status} />
            </div>
            <div className="text-sm">
              <p><span className="text-muted-foreground">Contact:</span> {lead.contact.name}</p>
              <p><span className="text-muted-foreground">Email:</span> {lead.contact.email}</p>
              <p><span className="text-muted-foreground">Location:</span> {lead.location}</p>
              <p><span className="text-muted-foreground">Source:</span> {lead.source}</p>
              <p><span className="text-muted-foreground">First Detected:</span> {lead.firstDetected}</p>
              {lead.lastContact !== '-' && (
                <p><span className="text-muted-foreground">Last Contact:</span> {lead.lastContact}</p>
              )}
            </div>
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => onView(lead)} className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              {getActionButton(lead.status, lead)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>First Detected</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.industry}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{lead.contact.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.contact.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{lead.source}</TableCell>
                <TableCell className="text-sm">{lead.location}</TableCell>
                <TableCell className="text-sm">
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-sm">{lead.firstDetected}</TableCell>
                <TableCell className="text-sm">{lead.lastContact}</TableCell>
                <TableCell className="text-sm space-y-2">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onView(lead)} className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {getActionButton(lead.status, lead)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SupplierLeads;
