
import React from 'react';
import { format } from 'date-fns';
import { ConversationSummary as ConversationSummaryType, ConversationSummaryData } from '@/types/conversations';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationSummaryProps {
  summary: ConversationSummaryType | null;
  loading: boolean;
}

export const ConversationSummary = ({ summary, loading }: ConversationSummaryProps) => {
  // Display formatted summary data
  const renderSummaryContent = (summaryData: ConversationSummaryData | null, summaryText: string | null) => {
    // If we have summaryData already parsed, use that
    if (summaryData) {
      console.log('Rendering summary data from summaryData:', summaryData);
      
      return (
        <div className="space-y-2">
          {summaryData.summary && (
            <p className="text-sm">{summaryData.summary}</p>
          )}
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {summaryData.startedBy && (
              <div>
                <span className="font-semibold">Started by:</span> {summaryData.startedBy}
              </div>
            )}
            
            {summaryData.sentTo && summaryData.sentTo.length > 0 && (
              <div>
                <span className="font-semibold">Sent to:</span> {summaryData.sentTo.join(', ')}
              </div>
            )}
            
            {summaryData.startDate && (
              <div>
                <span className="font-semibold">Start date:</span> {summaryData.startDate}
              </div>
            )}

            {summaryData.customer && (
              <div>
                <span className="font-semibold">Customer:</span> {summaryData.customer}
              </div>
            )}

            {summaryData.origin && (
              <div>
                <span className="font-semibold">Origin:</span> {summaryData.origin}
              </div>
            )}

            {summaryData.destination && (
              <div>
                <span className="font-semibold">Destination:</span> {summaryData.destination}
              </div>
            )}

            {summaryData.items && (
              <div className="col-span-2">
                <span className="font-semibold">Items:</span> {summaryData.items}
              </div>
            )}

            {/* Display any additional fields that might be present */}
            {Object.entries(summaryData)
              .filter(([key]) => !['startedBy', 'sentTo', 'startDate', 'summary', 'customer', 'origin', 'destination', 'items'].includes(key))
              .map(([key, value]) => (
                <div key={key} className={typeof value === 'string' && value.length > 30 ? 'col-span-2' : undefined}>
                  <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {
                    typeof value === 'string' ? value : 
                    Array.isArray(value) ? value.join(', ') : 
                    JSON.stringify(value)
                  }
                </div>
              ))}
          </div>
        </div>
      );
    } 
    // If we have summaryText but no parsed summaryData, try to parse it here
    else if (summaryText) {
      try {
        const parsedData = JSON.parse(summaryText);
        console.log('Parsed summary text in render function:', parsedData);
        
        return renderSummaryContent(parsedData, null);
      } catch (e) {
        console.error('Error parsing summary text in render function:', e);
        return <p className="text-sm text-muted-foreground">{summaryText}</p>;
      }
    }
    
    // If we have neither, show no summary available
    return <p className="text-sm text-muted-foreground">No summary information available.</p>;
  };

  if (loading) {
    return <Skeleton className="h-24 w-full mb-4" />;
  }

  if (!summary) {
    return (
      <div className="bg-muted/50 border border-border rounded-md p-3 mb-4">
        <p className="text-sm text-muted-foreground">No summary available for this conversation.</p>
      </div>
    );
  }

  return (
    <div className="bg-muted/50 border border-border rounded-md p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">Conversation Summary</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(summary.updated_at), 'MMM dd, yyyy HH:mm')}
        </span>
      </div>
      {renderSummaryContent(summary.summary_data, summary.summary_text)}
    </div>
  );
};
