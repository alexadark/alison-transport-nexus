
import React from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConversationSummaryData } from '@/types/conversations';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
  selectedThread: string | null;
  summaryData?: ConversationSummaryData | null;
}

export const MessageInput = ({ messageInput, setMessageInput, handleSendMessage, selectedThread, summaryData }: MessageInputProps) => {
  return (
    <div className="p-4 border-t mt-auto">
      <div className="flex gap-2">
        <Input 
          placeholder="Type your message..." 
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create Quote</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Quote from Message</DialogTitle>
                <DialogDescription>
                  Create a new quote based on the information in this thread.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h3 className="font-medium mb-2">Extracted Information</h3>
                  <div className="bg-muted/50 border border-border rounded-md p-3 text-sm">
                    <p><span className="font-medium">Customer:</span> {summaryData?.customer || 'Not detected'}</p>
                    <p><span className="font-medium">Origin:</span> {summaryData?.origin || 'Not detected'}</p>
                    <p><span className="font-medium">Destination:</span> {summaryData?.destination || 'Not detected'}</p>
                    <p><span className="font-medium">Items:</span> {summaryData?.items || 'Not detected'}</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button 
                  className="bg-status-transit hover:bg-status-transit/90"
                  onClick={() => {
                    // Your toast.success implementation will go here
                  }}
                >
                  Create Quote
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={handleSendMessage}
            className="bg-status-transit hover:bg-status-transit/90"
            disabled={!selectedThread || !messageInput.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
