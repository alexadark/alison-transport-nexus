
import React from 'react';
import { format } from 'date-fns';
import { Email } from '@/types/conversations';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4 mt-4">
        <p>No messages in this conversation yet</p>
        <div className="flex justify-center mt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
          >
            Send your first message
          </Button>
        </div>
      </div>
    );
  }

  // Debug output
  console.log("Rendering emails:", emails);

  return (
    <div className="space-y-4 mt-4">
      {emails.map((email) => (
        <div 
          key={email.id}
          className={`p-3 rounded-lg ${
            email.direction === 'outgoing' 
              ? 'bg-primary/10 ml-8' 
              : 'bg-muted mr-8'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-sm">
              {email.sender_name || email.sender_email || 'Unknown'}
            </span>
            <span className="text-xs text-muted-foreground">
              {email.received_at ? format(new Date(email.received_at), 'MMM dd, yyyy HH:mm') : 'No date'}
            </span>
          </div>
          <p className="text-sm whitespace-pre-wrap">{email.message_content}</p>
        </div>
      ))}
    </div>
  );
};
