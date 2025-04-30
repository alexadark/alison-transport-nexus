
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Plus, MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: string;
}

interface Thread {
  id: string;
  title: string;
  agent: string;
  lastMessage: string;
  lastTimestamp: string;
}

// Mock data for demonstration
const mockThreads: Thread[] = [
  {
    id: 'thread-1',
    title: 'Quote Request - Dome Parts for TechCorp',
    agent: 'Menfield',
    lastMessage: 'Sarah Johnson (sarah@menfield.com) - Today',
    lastTimestamp: '09:32',
  },
  {
    id: 'thread-2',
    title: 'Pickup Confirmation - SH-002',
    agent: 'Menfield',
    lastMessage: 'John Miller (Menfield) - Yesterday',
    lastTimestamp: '16:45',
  },
  {
    id: 'thread-3',
    title: 'Delivery Update Request - SH-001',
    agent: 'Menfield',
    lastMessage: 'Sarah Johnson (Menfield) - 04/28/2025',
    lastTimestamp: '11:20',
  },
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'Sarah Johnson (sarah@menfield.com)',
    content: 'Hello Alison Transport, we have a new quote request from our customer TechCorp for shipping dome parts from Seattle, WA to Tel Aviv. Total weight: 500kg.',
    timestamp: '04/30/2025 09:32',
    type: 'received',
  },
  {
    id: 'msg-2',
    sender: 'AI',
    content: 'AI Detected: Quote request for TechCorp, Seattle → Tel Aviv, Dome parts (500kg)',
    timestamp: '04/30/2025 09:33',
    type: 'system',
  },
];

const AgentComms = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('Menfield');
  const [selectedThread, setSelectedThread] = useState<string>('thread-1');
  const [messageInput, setMessageInput] = useState<string>('');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState<boolean>(false);
  const [newThread, setNewThread] = useState<Partial<Thread>>({
    title: '',
    agent: 'Menfield',
  });
  const [newMessageContent, setNewMessageContent] = useState<string>('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      toast.success("Message sent successfully");
      setMessageInput('');
    }
  };

  const handleCreateThread = () => {
    if (!newThread.title || !newMessageContent) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    toast.success("New conversation started");
    setIsNewMessageDialogOpen(false);
    setNewThread({
      title: '',
      agent: 'Menfield',
    });
    setNewMessageContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agent Communications</h1>
        <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-status-transit hover:bg-status-transit/90">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
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
                  onChange={(e) => setNewThread({...newThread, agent: e.target.value})}
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
                  onChange={(e) => setNewThread({...newThread, title: e.target.value})}
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
              <Button variant="outline" onClick={() => setIsNewMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-status-transit hover:bg-status-transit/90" onClick={handleCreateThread}>
                Start Conversation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar with threads */}
        <div className="col-span-12 md:col-span-4 border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menfield">Menfield</SelectItem>
                <SelectItem value="AsiaTrade">AsiaTrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="h-[calc(100%-64px)] overflow-y-auto">
            {mockThreads.map((thread) => (
              <div 
                key={thread.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  selectedThread === thread.id ? 'bg-muted' : ''
                }`}
                onClick={() => setSelectedThread(thread.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{thread.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{thread.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">{thread.lastTimestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <Card className="col-span-12 md:col-span-8 h-full flex flex-col">
          <CardHeader className="border-b pb-3 pt-4">
            <CardTitle className="text-lg">Quote Request - Dome Parts for TechCorp</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${
                    message.type === 'system' 
                      ? 'bg-muted/50 border border-border rounded-md p-3' 
                      : 'space-y-1'
                  }`}
                >
                  {message.type !== 'system' && (
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{message.sender}</span>
                      <span className="text-xs text-muted-foreground ml-2">{message.timestamp}</span>
                    </div>
                  )}
                  <p className={`text-sm ${message.type === 'system' ? 'text-muted-foreground' : ''}`}>
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
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
                            <p><span className="font-medium">Customer:</span> TechCorp</p>
                            <p><span className="font-medium">Origin:</span> Seattle, WA</p>
                            <p><span className="font-medium">Destination:</span> Tel Aviv</p>
                            <p><span className="font-medium">Items:</span> Dome parts (500kg)</p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button 
                          className="bg-status-transit hover:bg-status-transit/90"
                          onClick={() => {
                            toast.success("Quote created successfully");
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
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentComms;
