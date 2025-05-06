
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Eye, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SupplierLead } from '@/hooks/use-leads';

interface SupplierLeadsKanbanProps {
  leads: SupplierLead[];
  onView: (lead: SupplierLead) => void;
  onSendIntro: (lead: SupplierLead) => void;
  onFollowUp: (lead: SupplierLead) => void;
  onConvert: (lead: SupplierLead) => void;
}

const SupplierLeadsKanban: React.FC<SupplierLeadsKanbanProps> = ({
  leads,
  onView,
  onSendIntro,
  onFollowUp,
  onConvert
}) => {
  const { toast } = useToast();
  // Create a local copy of leads that we can modify when dragging
  const [localLeads, setLocalLeads] = useState<SupplierLead[]>(leads);
  
  // Group leads by status
  const newLeads = localLeads.filter(lead => lead.status.toLowerCase() === 'new');
  const contactedLeads = localLeads.filter(lead => lead.status.toLowerCase() === 'contacted');
  const qualifiedLeads = localLeads.filter(lead => lead.status.toLowerCase() === 'qualified');
  const convertedLeads = localLeads.filter(lead => lead.status.toLowerCase() === 'converted');
  
  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, lead: SupplierLead) => {
    e.dataTransfer.setData('leadId', lead.id);
  };
  
  // Function to handle drop
  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const lead = localLeads.find(l => l.id === leadId);
    
    if (lead && lead.status.toLowerCase() !== targetStatus.toLowerCase()) {
      // Update the lead status in our local state
      const updatedLeads = localLeads.map(l => {
        if (l.id === leadId) {
          return { ...l, status: targetStatus };
        }
        return l;
      });
      
      setLocalLeads(updatedLeads);
      
      // Show toast notification
      toast({
        title: "Lead status updated",
        description: `${lead.name} moved to ${targetStatus} stage.`
      });

      // Update the status in the database
      try {
        const { error } = await supabase
          .from('leads')
          .update({ status: targetStatus })
          .eq('id', leadId);

        if (error) {
          console.error('Error updating lead status in database:', error);
          throw error;
        }
        
        // Handle specific actions based on the new status
        if (targetStatus.toLowerCase() === 'converted') {
          // If moved to converted, trigger the convert action
          onConvert(lead);
        }
      } catch (err) {
        console.error('Error updating lead status:', err);
        toast({
          title: "Error",
          description: "Failed to update lead status. Please try again.",
          variant: "destructive"
        });
        
        // Revert the local state change on error
        setLocalLeads(localLeads);
      }
    }
  };
  
  // Function to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Update local leads when props change
  React.useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);
  
  // Render a single lead card
  const renderLeadCard = (lead: SupplierLead) => (
    <Card 
      key={lead.id} 
      className="mb-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing" 
      draggable={true}
      onDragStart={(e) => handleDragStart(e, lead)}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{lead.name}</h3>
            <p className="text-xs text-muted-foreground">{lead.industry || 'General'}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>
        
        <div className="text-xs">
          <p><span className="text-muted-foreground">Contact:</span> {lead.contact.name}</p>
          <p><span className="text-muted-foreground">Email:</span> {lead.contact.email}</p>
          <p><span className="text-muted-foreground">Location:</span> {lead.location || 'Unknown'}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onView(lead)}
            className="h-7 px-2 text-xs flex items-center"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          
          {lead.status.toLowerCase() === 'new' && (
            <Button
              size="sm"
              onClick={() => onSendIntro(lead)}
              className="h-7 px-2 text-xs bg-status-transit hover:bg-status-transit/90 text-white"
            >
              Send Intro
            </Button>
          )}
          
          {lead.status.toLowerCase() === 'contacted' && (
            <Button
              size="sm"
              onClick={() => onFollowUp(lead)}
              className="h-7 px-2 text-xs bg-status-followup hover:bg-status-followup/90 text-white"
            >
              Follow Up
            </Button>
          )}
          
          {lead.status.toLowerCase() === 'qualified' && (
            <Button
              size="sm"
              onClick={() => onConvert(lead)}
              className="h-7 px-2 text-xs bg-red-600 hover:bg-red-500 text-white"
            >
              Convert
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* New leads column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'New')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-new mr-2"></div>
            New
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {newLeads.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {newLeads.map(renderLeadCard)}
        </div>
      </div>

      {/* Contacted leads column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'Contacted')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-transit mr-2"></div>
            Contacted
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {contactedLeads.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {contactedLeads.map(renderLeadCard)}
        </div>
      </div>

      {/* Qualified leads column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'Qualified')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-status-followup mr-2"></div>
            Qualified
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {qualifiedLeads.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {qualifiedLeads.map(renderLeadCard)}
        </div>
      </div>

      {/* Converted leads column */}
      <div 
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border"
        onDrop={(e) => handleDrop(e, 'Converted')}
        onDragOver={handleDragOver}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            Converted
            <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {convertedLeads.length}
            </span>
          </h3>
        </div>
        <div className="space-y-3 min-h-[100px]">
          {convertedLeads.map(renderLeadCard)}
        </div>
      </div>
    </div>
  );
};

export default SupplierLeadsKanban;
