
import React from 'react';
import { format } from 'date-fns';
import { Email } from '@/types/conversations';

interface MessageItemProps {
  email: Email;
}

export const MessageItem = ({ email }: MessageItemProps) => {
  return (
    <div 
      className={`p-3 rounded-lg ${
        email.direction === 'outgoing' 
          ? 'bg-primary/10 ml-8' 
          : 'bg-muted mr-8'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-sm">
          {email.sender_name || email.sender_email || 'Unknown'}
        </span>
        <span className="text-xs text-muted-foreground">
          {email.received_at ? format(new Date(email.received_at), 'MMM dd, yyyy HH:mm') : 'No date'}
        </span>
      </div>
      <p className="text-sm whitespace-pre-wrap">{email.message_content}</p>
    </div>
  );
};
