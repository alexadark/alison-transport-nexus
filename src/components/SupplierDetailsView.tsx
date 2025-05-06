
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SupplierLead } from '@/hooks/use-leads';

interface SupplierDetailsViewProps {
  lead: SupplierLead;
}

const SupplierDetailsView = ({ lead }: SupplierDetailsViewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Company Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID:</span>
                <span className="font-medium">{lead.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{lead.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Industry:</span>
                <span>{lead.industry || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{lead.location || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{lead.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{lead.contact.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-primary">{lead.contact.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Lead Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source:</span>
              <span>{lead.source || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">First Detected:</span>
              <span>{lead.firstDetected}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Contact:</span>
              <span>{lead.lastContact || '-'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-2">Interaction History</h3>
          <div className="text-sm text-muted-foreground italic">
            {lead.status === 'New' ? 
              "No interactions recorded yet." : 
              "Interaction history will be displayed here."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDetailsView;
