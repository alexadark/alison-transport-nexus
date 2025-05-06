
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newThread: {
    title: string;
    agent: string;
  };
  setNewThread: (thread: { title: string; agent: string; }) => void;
  newMessageContent: string;
  setNewMessageContent: (content: string) => void;
  handleCreateThread: () => void;
}

export const NewMessageDialog = ({
  isOpen,
  onOpenChange,
  newThread,
  setNewThread,
  newMessageContent,
  setNewMessageContent,
  handleCreateThread,
}: NewMessageDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
          <DialogDescription>
            Create a new conversation thread with an agent.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="agent" className="text-right">
              Agent
            </label>
            <select
              id="agent"
              value={newThread.agent}
              onChange={(e) => setNewThread({ ...newThread, agent: e.target.value })}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Menfield">Menfield</option>
              <option value="AsiaTrade">AsiaTrade</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">
              Subject*
            </label>
            <Input
              id="title"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              className="col-span-3"
              placeholder="e.g., Quote Request for TechCorp"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="message" className="text-right">
              Message*
            </label>
            <textarea
              id="message"
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              className="col-span-3 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type your message here..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-status-transit hover:bg-status-transit/90" onClick={handleCreateThread}>
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
