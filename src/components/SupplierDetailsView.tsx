
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { SupplierLead } from '@/hooks/use-leads';
import { useLeadInteractions } from '@/hooks/use-lead-interactions';
import { MessageItem } from '@/components/agent-comms/MessageItem';

interface SupplierDetailsViewProps {
  lead: SupplierLead;
}

const SupplierDetailsView = ({ lead }: SupplierDetailsViewProps) => {
  const { data: interactions, isLoading: interactionsLoading } = useLeadInteractions(lead);

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
          {interactionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : interactions && interactions.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {interactions.map((email) => (
                <div key={email.id} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{email.sender_name || email.sender_email}</span>
                    <span className="text-xs text-muted-foreground">
                      {email.received_at ? format(new Date(email.received_at), 'MMM dd, yyyy HH:mm') : ''}
                    </span>
                  </div>
                  <div className="text-sm">
                    {email.subject && <p className="font-medium mb-1">{email.subject}</p>}
                    <p className="whitespace-pre-wrap text-muted-foreground">{email.message_content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              {lead.status === 'New' ? 
                "No interactions recorded yet." : 
                "No interaction history found for this lead."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierDetailsView;
