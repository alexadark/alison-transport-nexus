
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewMessageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newThread: {
    title: string;
    agent: string;
  };
  setNewThread: React.Dispatch<React.SetStateAction<{
    title: string;
    agent: string;
  }>>;
  newMessageContent: string;
  setNewMessageContent: React.Dispatch<React.SetStateAction<string>>;
  handleCreateThread: () => Promise<void>;
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Subject
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={newThread.title}
              onChange={(e) => setNewThread({...newThread, title: e.target.value})}
              placeholder="Enter message subject"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agent" className="text-right">
              Agent
            </Label>
            <Select 
              value={newThread.agent}
              onValueChange={(value) => setNewThread({...newThread, agent: value})}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menfield">Menfield</SelectItem>
                <SelectItem value="Shanghai">Shanghai</SelectItem>
                <SelectItem value="Rotterdam">Rotterdam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              className="col-span-3"
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder="Enter your message"
              rows={5}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateThread}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
