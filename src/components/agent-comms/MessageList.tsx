
import React from 'react';
import { format } from 'date-fns';
import { Email } from '@/types/conversations';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageItem } from '@/components/agent-comms/MessageItem';
import { EmptyState } from '@/components/agent-comms/EmptyState';

interface MessageListProps {
  emails: Email[] | undefined;
  loading: boolean;
  messageInput: string;
  handleSendMessage: () => void;
}

export const MessageList = ({ emails, loading, messageInput, handleSendMessage }: MessageListProps) => {
  if (loading) {
    return (
      <div className="space-y-4 mt-4">
        {Array(2).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  
  // Check if emails is undefined, null, or empty array
  const hasEmails = emails && emails.length > 0;
  
  // Debug output
  console.log("MessageList - Rendering emails count:", emails?.length || 0);
  
  if (!hasEmails) {
    return <EmptyState messageInput={messageInput} handleSendMessage={handleSendMessage} />;
  }

  return (
    <div className="space-y-4 mt-4">
      {emails.map((email) => (
        <MessageItem key={email.id} email={email} />
      ))}
    </div>
  );
};
