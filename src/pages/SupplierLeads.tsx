import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SupplierDetailsView from '@/components/SupplierDetailsView';
import SupplierLeadsKanban from '@/components/SupplierLeadsKanban';
import EmailCompositionDialog from '@/components/EmailCompositionDialog';
import { useLeads, SupplierLead } from '@/hooks/use-leads';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

// Form schema for adding a new supplier
const supplierFormSchema = z.object({
  name: z.string().min(1, {
    message: "Company name is required"
  }),
  industry: z.string().min(1, {
    message: "Industry is required"
  }),
  location: z.string().min(1, {
    message: "Location is required"
  }),
  contactName: z.string().min(1, {
    message: "Contact name is required"
  }),
  contactEmail: z.string().email({
    message: "Invalid email address"
  }),
  source: z.string().optional()
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

const SupplierLeads = () => {
  const [currentTab, setCurrentTab] = useState("all");
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedLead, setSelectedLead] = useState<SupplierLead | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailType, setEmailType] = useState<'intro' | 'followup'>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Use our custom hook to fetch leads
  const { data: leads = [], isLoading, error } = useLeads(searchQuery);
  
  // Handle errors
  if (error) {
    console.error('Error loading leads:', error);
  }
  
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      location: "",
      contactName: "",
      contactEmail: "",
      source: ""
    }
  });
  
  const filteredLeads = currentTab === 'all' ? leads : leads.filter(lead => lead.status.toLowerCase() === currentTab.toLowerCase());
  
  const onSubmit = async (data: SupplierFormValues) => {
    try {
      // Create a new lead in the database
      const { error: contactError, data: contactData } = await supabase
        .from('contacts')
        .insert({
          company_name: data.name,
          contact_name: data.contactName,
          email: data.contactEmail,
          // Split location into city and country if possible
          city: data.location.split(',')[0]?.trim() || data.location,
          country: data.location.split(',')[1]?.trim() || '',
          contact_type: 'Supplier'
        })
        .select('id')
        .single();
      
      if (contactError) throw contactError;
      
      // Create the lead with a reference to the contact
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          contact_id: contactData.id,
          supplier_contact_name: data.contactName,
          supplier_email: data.contactEmail,
          status: 'New',
          is_quote_lead: true,
          source_email_id: data.source || null,
        });
      
      if (leadError) throw leadError;
      
      toast({
        title: "Supplier added",
        description: `${data.name} has been added as a new supplier lead.`
      });
      form.reset();
    } catch (err) {
      console.error('Error adding supplier lead:', err);
      toast({
        title: "Error",
        description: "Failed to add supplier lead. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleViewLead = (lead: SupplierLead) => {
    setSelectedLead(lead);
    setViewDialogOpen(true);
  };
  
  const handleSendIntro = (lead: SupplierLead) => {
    setSelectedLead(lead);
    setEmailType('intro');
    setEmailDialogOpen(true);
  };
  
  const handleFollowUp = (lead: SupplierLead) => {
    setSelectedLead(lead);
    setEmailType('followup');
    setEmailDialogOpen(true);
  };
  
  const handleConvert = async (lead: SupplierLead) => {
    try {
      // Update the lead status to Converted in the database
      const { error } = await supabase
        .from('leads')
        .update({ status: 'Converted' })
        .eq('id', lead.id);
      
      if (error) throw error;
      
      toast({
        title: "Lead converted",
        description: `${lead.name} has been converted to a customer.`,
      });
    } catch (err) {
      console.error('Error converting lead:', err);
      toast({
        title: "Error",
        description: "Failed to convert lead. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getActionButton = (status: string, lead: SupplierLead) => {
    switch (status.toLowerCase()) {
      case 'new':
        return <Button size="sm" onClick={() => handleSendIntro(lead)} className="bg-status-transit hover:bg-status-transit/90 text-white">Send Intro</Button>;
      case 'contacted':
        return <Button size="sm" onClick={() => handleFollowUp(lead)} className="bg-status-followup hover:bg-status-followup/90 text-white">Follow Up</Button>;
      case 'qualified':
        return <Button size="sm" onClick={() => handleConvert(lead)} className="bg-red-600 hover:bg-red-500 text-white">Convert</Button>;
      default:
        return <Button size="sm" onClick={() => handleViewLead(lead)} variant="outline">View</Button>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Supplier Lead Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setViewType(viewType === 'list' ? 'kanban' : 'list')}
            className="self-start"
          >
            {viewType === 'list' ? 'Kanban View' : 'List View'}
          </Button>
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
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter company name" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="industry" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter industry" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="City, State" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contactName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Full name" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="email@example.com" type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="source" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source (Optional)</FormLabel>
                      <FormControl>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How was this lead found?" {...field} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <Button type="submit" className="text-white">Add Supplier</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative max-w-md mx-auto md:mx-0">
        <Input 
          className="pl-3" 
          placeholder="Search leads..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : viewType === 'list' ? (
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
              onSendIntro={handleSendIntro}
              onFollowUp={handleFollowUp}
              onConvert={handleConvert}
              isMobile={isMobile}
              getActionButton={getActionButton}
            />
          </TabsContent>
          <TabsContent value="new" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              onView={handleViewLead} 
              onSendIntro={handleSendIntro}
              onFollowUp={handleFollowUp}
              onConvert={handleConvert}
              isMobile={isMobile}
              getActionButton={getActionButton}
            />
          </TabsContent>
          <TabsContent value="contacted" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              onView={handleViewLead} 
              onSendIntro={handleSendIntro}
              onFollowUp={handleFollowUp}
              onConvert={handleConvert}
              isMobile={isMobile}
              getActionButton={getActionButton}
            />
          </TabsContent>
          <TabsContent value="qualified" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              onView={handleViewLead} 
              onSendIntro={handleSendIntro}
              onFollowUp={handleFollowUp}
              onConvert={handleConvert}
              isMobile={isMobile}
              getActionButton={getActionButton}
            />
          </TabsContent>
          <TabsContent value="converted" className="mt-4">
            <LeadTable 
              leads={filteredLeads} 
              onView={handleViewLead} 
              onSendIntro={handleSendIntro}
              onFollowUp={handleFollowUp}
              onConvert={handleConvert}
              isMobile={isMobile}
              getActionButton={getActionButton}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <SupplierLeadsKanban
          leads={leads}
          onView={handleViewLead}
          onSendIntro={handleSendIntro}
          onFollowUp={handleFollowUp}
          onConvert={handleConvert}
        />
      )}

      {selectedLead && (
        <>
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Supplier Lead Details</DialogTitle>
              </DialogHeader>
              <SupplierDetailsView lead={selectedLead} />
            </DialogContent>
          </Dialog>
          
          <EmailCompositionDialog
            open={emailDialogOpen}
            onOpenChange={setEmailDialogOpen}
            recipientName={selectedLead.contact.name}
            recipientEmail={selectedLead.contact.email}
            subject={emailType === 'intro' ? 
              `Introduction to Our Logistics Services - ${selectedLead.name}` : 
              `Follow-up Regarding Our Logistics Services - ${selectedLead.name}`}
            emailType={emailType}
          />
        </>
      )}
    </div>
  );
};

// Update LeadTableProps interface to use the SupplierLead from use-leads.ts
interface LeadTableProps {
  leads: SupplierLead[];
  onView: (lead: SupplierLead) => void;
  onSendIntro: (lead: SupplierLead) => void;
  onFollowUp: (lead: SupplierLead) => void;
  onConvert: (lead: SupplierLead) => void;
  isMobile: boolean;
  getActionButton: (status: string, lead: SupplierLead) => React.ReactNode;
}

const LeadTable = ({
  leads,
  onView,
  onSendIntro,
  onFollowUp,
  onConvert,
  isMobile,
  getActionButton
}: LeadTableProps) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {leads.map(lead => (
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
              {lead.lastContact !== '-' && <p><span className="text-muted-foreground">Last Contact:</span> {lead.lastContact}</p>}
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
            {leads.map(lead => (
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
