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
import { useConversationThreads, useLatestConversationSummary, useThreadEmails } from '@/hooks/use-conversation-data';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ConversationSummaryData } from '@/types/conversations';

const AgentComms = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedThread, setSelectedThread] = useState<string>('');
  const [messageInput, setMessageInput] = useState<string>('');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState<boolean>(false);
  const [newThread, setNewThread] = useState<{
    title: string;
    agent: string;
  }>({
    title: '',
    agent: 'Menfield',
  });
  const [newMessageContent, setNewMessageContent] = useState<string>('');

  // Fetch conversation threads
  const { 
    data: threads, 
    isLoading: threadsLoading, 
    error: threadsError 
  } = useConversationThreads(selectedAgent !== 'all' ? selectedAgent : undefined);

  // Fetch emails for the selected thread
  const {
    data: emails,
    isLoading: emailsLoading,
    error: emailsError
  } = useThreadEmails(selectedThread);

  // Fetch the latest summary for the selected thread
  const {
    data: latestSummary,
    isLoading: summaryLoading,
    error: summaryError
  } = useLatestConversationSummary(selectedThread);

  // Set the first thread as selected if none is selected yet
  React.useEffect(() => {
    if (threads && threads.length > 0 && !selectedThread) {
      setSelectedThread(threads[0].id);
    }
  }, [threads, selectedThread]);

  // Display formatted summary data
  const renderSummaryContent = (summaryData: ConversationSummaryData | null) => {
    if (!summaryData) return null;
    
    return (
      <div className="space-y-2">
        {summaryData.summary && (
          <p className="text-sm">{summaryData.summary}</p>
        )}
        
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
          {summaryData.startedBy && (
            <div>
              <span className="font-semibold">Started by:</span> {summaryData.startedBy}
            </div>
          )}
          
          {summaryData.sentTo && summaryData.sentTo.length > 0 && (
            <div>
              <span className="font-semibold">Sent to:</span> {summaryData.sentTo.join(', ')}
            </div>
          )}
          
          {summaryData.startDate && (
            <div>
              <span className="font-semibold">Start date:</span> {summaryData.startDate}
            </div>
          )}

          {summaryData.customer && (
            <div>
              <span className="font-semibold">Customer:</span> {summaryData.customer}
            </div>
          )}

          {summaryData.origin && (
            <div>
              <span className="font-semibold">Origin:</span> {summaryData.origin}
            </div>
          )}

          {summaryData.destination && (
            <div>
              <span className="font-semibold">Destination:</span> {summaryData.destination}
            </div>
          )}

          {summaryData.items && (
            <div className="col-span-2">
              <span className="font-semibold">Items:</span> {summaryData.items}
            </div>
          )}

          {/* Display any additional fields that might be present */}
          {Object.entries(summaryData)
            .filter(([key]) => !['startedBy', 'sentTo', 'startDate', 'summary', 'customer', 'origin', 'destination', 'items'].includes(key))
            .map(([key, value]) => (
              <div key={key} className={typeof value === 'string' && value.length > 30 ? 'col-span-2' : undefined}>
                <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {
                  typeof value === 'string' ? value : 
                  Array.isArray(value) ? value.join(', ') : 
                  JSON.stringify(value)
                }
              </div>
            ))}
        </div>
      </div>
    );
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      try {
        // In a real scenario, you would save this message to the database
        const { error } = await supabase
          .from('emails')
          .insert({
            thread_id: selectedThread,
            message_content: messageInput,
            direction: 'outbound',
            sender_name: 'You',
            sender_email: 'you@alisonTransport.com',
            subject: threads?.find(t => t.id === selectedThread)?.subject || 'No Subject',
            received_at: new Date().toISOString(),
            status: 'sent'
          });

        if (error) {
          throw error;
        }

        toast.success("Message sent successfully");
        setMessageInput('');
      } catch (error: any) {
        toast.error("Failed to send message: " + error.message);
      }
    }
  };

  const handleCreateThread = async () => {
    if (!newThread.title || !newMessageContent) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    try {
      // Create a new thread
      const { data: newThreadData, error: threadError } = await supabase
        .from('conversation_threads')
        .insert({
          subject: newThread.title,
          status: 'active'
        })
        .select()
        .single();

      if (threadError) throw threadError;

      // Create first message in thread
      const { error: messageError } = await supabase
        .from('emails')
        .insert({
          thread_id: newThreadData.id,
          message_content: newMessageContent,
          direction: 'outbound',
          sender_name: 'You',
          sender_email: 'you@alisonTransport.com',
          subject: newThread.title,
          received_at: new Date().toISOString(),
          status: 'sent'
        });

      if (messageError) throw messageError;

      toast.success("New conversation started");
      setIsNewMessageDialogOpen(false);
      setSelectedThread(newThreadData.id);
      setNewThread({
        title: '',
        agent: 'Menfield',
      });
      setNewMessageContent('');
    } catch (error: any) {
      toast.error("Failed to create conversation: " + error.message);
    }
  };

  if (threadsError) {
    return <div className="p-4">Error loading conversations: {threadsError.message}</div>;
  }

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
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="Menfield">Menfield</SelectItem>
                <SelectItem value="AsiaTrade">AsiaTrade</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="h-[calc(100%-64px)] overflow-y-auto">
            {threadsLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-4 border-b">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : threads && threads.length > 0 ? (
              threads.map((thread) => (
                <div 
                  key={thread.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedThread === thread.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{thread.subject || 'No Subject'}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {thread.updated_at ? format(new Date(thread.updated_at), 'MMM dd, yyyy') : 'No date'}
                      </p>
                    </div>
                    {thread.status && (
                      <span className="text-xs bg-muted-foreground/10 text-muted-foreground px-2 py-1 rounded-full ml-2">
                        {thread.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <Card className="col-span-12 md:col-span-8 h-full flex flex-col">
          {selectedThread ? (
            <>
              <CardHeader className="border-b pb-3 pt-4">
                <CardTitle className="text-lg">
                  {threads?.find(t => t.id === selectedThread)?.subject || 'Loading...'}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Latest conversation summary */}
                  {summaryLoading ? (
                    <Skeleton className="h-24 w-full mb-4" />
                  ) : latestSummary ? (
                    <div className="bg-muted/50 border border-border rounded-md p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">Conversation Summary</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(latestSummary.updated_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      {renderSummaryContent(latestSummary.summary_data)}
                    </div>
                  ) : null}
                  
                  {/* No emails are shown if there's a summary */}
                  <div className="text-center text-muted-foreground p-4">
                    No messages in this conversation yet
                  </div>
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
                                <p><span className="font-medium">Customer:</span> {latestSummary?.summary_data?.customer || 'Not detected'}</p>
                                <p><span className="font-medium">Origin:</span> {latestSummary?.summary_data?.origin || 'Not detected'}</p>
                                <p><span className="font-medium">Destination:</span> {latestSummary?.summary_data?.destination || 'Not detected'}</p>
                                <p><span className="font-medium">Items:</span> {latestSummary?.summary_data?.items || 'Not detected'}</p>
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
                        disabled={!selectedThread || !messageInput.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-6">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No conversation selected</h3>
                <p className="text-muted-foreground mt-2">
                  Select a conversation from the list or create a new one
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AgentComms;
