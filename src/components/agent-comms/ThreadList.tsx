
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { ConversationThread } from '@/types/conversations';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThreadListProps {
  threads: ConversationThread[] | undefined;
  threadsLoading: boolean;
  selectedThread: string;
  setSelectedThread: (id: string) => void;
  selectedAgent: string;
  setSelectedAgent: (agent: string) => void;
}

export const ThreadList = ({
  threads,
  threadsLoading,
  selectedThread,
  setSelectedThread,
  selectedAgent,
  setSelectedAgent,
}: ThreadListProps) => {
  // Extract unique agent names from thread data
  const availableAgents = useMemo(() => {
    if (!threads || threads.length === 0) {
      return [];
    }
    
    const agentSet = new Set<string>();
    
    // Add each agent name to the Set (automatically removes duplicates)
    threads.forEach(thread => {
      if (thread.agent_name) {
        agentSet.add(thread.agent_name);
      }
    });
    
    // Convert Set to Array for rendering
    return Array.from(agentSet);
  }, [threads]);
  
  console.log("Available agents:", availableAgents);
  
  return (
    <div className="col-span-12 md:col-span-4 border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted">
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger>
            <SelectValue placeholder="Select agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agents</SelectItem>
            {availableAgents.map(agent => (
              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
            ))}
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
  );
};
