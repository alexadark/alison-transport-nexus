
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useConversationThreads, useLatestConversationSummary, useThreadEmails } from '@/hooks/use-conversation-data';
import { supabase } from '@/integrations/supabase/client';
import { ThreadList } from '@/components/agent-comms/ThreadList';
import { ConversationSummary } from '@/components/agent-comms/ConversationSummary';
import { MessageList } from '@/components/agent-comms/MessageList';
import { MessageInput } from '@/components/agent-comms/MessageInput';
import { NewMessageDialog } from '@/components/agent-comms/NewMessageDialog';

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
    error: emailsError,
    refetch: refetchEmails
  } = useThreadEmails(selectedThread);

  // Fetch the latest summary for the selected thread
  const {
    data: latestSummary,
    isLoading: summaryLoading,
    error: summaryError
  } = useLatestConversationSummary(selectedThread);

  // Set the first thread as selected if none is selected yet
  useEffect(() => {
    if (threads && threads.length > 0 && !selectedThread) {
      setSelectedThread(threads[0].id);
      console.log('Setting initial thread:', threads[0].id);
    }
  }, [threads, selectedThread]);

  // Debug logs to track data
  useEffect(() => {
    if (threads) {
      console.log('Loaded threads:', threads.length);
    }
    
    if (latestSummary) {
      console.log('Latest summary:', latestSummary);
    }
    
    if (emails) {
      console.log('Emails count:', emails.length);
    }
  }, [threads, latestSummary, emails]);

  // Effect to refetch emails when thread changes
  useEffect(() => {
    if (selectedThread) {
      console.log('Selected thread changed to:', selectedThread);
      refetchEmails();
    }
  }, [selectedThread, refetchEmails]);

  const handleSendMessage = async () => {
    if (!selectedThread || !messageInput.trim()) {
      toast.error("Please select a thread and enter a message");
      return;
    }

    try {
      console.log("Sending message to thread:", selectedThread);
      const { error, data } = await supabase
        .from('emails')
        .insert({
          thread_id: selectedThread,
          message_content: messageInput,
          direction: 'outgoing', // Updated from 'outbound' to 'outgoing'
          sender_name: 'You',
          sender_email: 'you@alisonTransport.com',
          subject: threads?.find(t => t.id === selectedThread)?.subject || 'No Subject',
          received_at: new Date().toISOString(),
          status: 'sent'
        })
        .select();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("Message sent successfully:", data);
      toast.success("Message sent successfully");
      setMessageInput('');
      
      // Refetch emails to display the new message
      refetchEmails();
    } catch (error: any) {
      toast.error("Failed to send message: " + error.message);
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
          direction: 'outgoing', // Updated from 'outbound' to 'outgoing'
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
    return <div className="p-4">Error loading conversations: {(threadsError as Error).message}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agent Communications</h1>
        <NewMessageDialog
          isOpen={isNewMessageDialogOpen}
          onOpenChange={setIsNewMessageDialogOpen}
          newThread={newThread}
          setNewThread={setNewThread}
          newMessageContent={newMessageContent}
          setNewMessageContent={setNewMessageContent}
          handleCreateThread={handleCreateThread}
        />
        <Button className="bg-status-transit hover:bg-status-transit/90" onClick={() => setIsNewMessageDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar with threads */}
        <ThreadList
          threads={threads}
          threadsLoading={threadsLoading}
          selectedThread={selectedThread}
          setSelectedThread={setSelectedThread}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
        />

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
                  <ConversationSummary 
                    summary={latestSummary} 
                    loading={summaryLoading} 
                  />
                  
                  {/* Display emails if available */}
                  <h3 className="font-medium text-sm border-b pb-2">Messages</h3>
                  <MessageList
                    emails={emails}
                    loading={emailsLoading}
                    messageInput={messageInput}
                    handleSendMessage={handleSendMessage}
                  />
                  
                  {/* Show errors if any */}
                  {emailsError && (
                    <div className="text-red-500 p-4 bg-red-50 rounded-md mt-4">
                      <p className="font-medium">Error loading messages</p>
                      <p className="text-sm">{(emailsError as Error).message}</p>
                    </div>
                  )}
                </div>
                <MessageInput
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  handleSendMessage={handleSendMessage}
                  selectedThread={selectedThread}
                  summaryData={latestSummary?.summary_data}
                />
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
