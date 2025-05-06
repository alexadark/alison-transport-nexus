
import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConversationSummaryData } from '@/types/conversations';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
  selectedThread: string;
  summaryData?: ConversationSummaryData | null;
}

export const MessageInput = ({ 
  messageInput, 
  setMessageInput, 
  handleSendMessage,
  selectedThread,
  summaryData
}: MessageInputProps) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="border-t p-4 bg-card">
      <div className="flex flex-col space-y-2">
        {/* Show context information if available */}
        {summaryData && (
          <div className="text-xs text-muted-foreground rounded-md mb-1">
            <span className="font-medium">Context:</span>
            {' '}
            {summaryData.customer ? `Customer: ${summaryData.customer}.` : ''}
            {' '}
            {summaryData.origin && summaryData.destination 
              ? `Route: ${summaryData.origin} to ${summaryData.destination}.` 
              : ''}
          </div>
        )}
        
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            className="resize-none pr-12 focus-visible:ring-1"
            disabled={!selectedThread}
          />
          <Button
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !selectedThread}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Press Shift + Enter for a new line
        </div>
      </div>
    </div>
  );
};
