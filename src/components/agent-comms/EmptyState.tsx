
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  messageInput: string;
  handleSendMessage: () => void;
}

export const EmptyState = ({ messageInput, handleSendMessage }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <MessageSquare className="h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-medium">No messages in this conversation</h3>
      <p className="text-muted-foreground max-w-md">
        This conversation doesn't have any messages yet. Start the conversation by sending a message below.
      </p>
      {messageInput.trim() && (
        <Button onClick={handleSendMessage}>Send Message</Button>
      )}
    </div>
  );
};
