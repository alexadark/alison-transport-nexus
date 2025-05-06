
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  messageInput: string;
  handleSendMessage: () => void;
}

export const EmptyState = ({ messageInput, handleSendMessage }: EmptyStateProps) => {
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
};
