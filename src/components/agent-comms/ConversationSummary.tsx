
import React from 'react';
import { ConversationSummary as ConversationSummaryType } from '@/types/conversations';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ConversationSummaryProps {
  summary: ConversationSummaryType | null;
  loading: boolean;
}

export const ConversationSummary = ({ summary, loading }: ConversationSummaryProps) => {
  if (loading) {
    return <Skeleton className="h-24 w-full" />;
  }

  if (!summary) {
    return null;
  }

  // Parse summary data if it exists
  const summaryData = summary.summary_data;

  // If we have structured data, display it nicely
  if (summaryData) {
    return (
      <Card className="bg-muted/50 mb-4">
        <CardContent className="pt-4 pb-2">
          <h3 className="font-medium mb-2">Conversation Summary</h3>
          <div className="text-sm space-y-1">
            {summaryData.customer && (
              <p><span className="font-medium">Customer:</span> {summaryData.customer}</p>
            )}
            {summaryData.startedBy && (
              <p><span className="font-medium">Started by:</span> {summaryData.startedBy}</p>
            )}
            {summaryData.summary && (
              <p><span className="font-medium">Summary:</span> {summaryData.summary}</p>
            )}
            {summaryData.origin && summaryData.destination && (
              <p><span className="font-medium">Route:</span> {summaryData.origin} to {summaryData.destination}</p>
            )}
            {summaryData.items && (
              <p><span className="font-medium">Items:</span> {summaryData.items}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no structured data, just show the raw summary text
  return (
    <Card className="bg-muted/50 mb-4">
      <CardContent className="pt-4 pb-2">
        <h3 className="font-medium mb-2">Conversation Summary</h3>
        <p className="text-sm">{summary.summary_text || 'No summary available'}</p>
      </CardContent>
    </Card>
  );
};
