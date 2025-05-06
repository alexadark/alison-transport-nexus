
export interface ConversationThread {
  id: string;
  subject: string | null;
  outlook_conversation_id: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ConversationSummary {
  id: string;
  summary_text: string;
  summary_data: any | null;
  conversation_thread_id: string;
  attachment_links: any | null;
  updated_at: string;
}

export interface Email {
  id: string;
  thread_id: string | null;
  sender_name: string | null;
  sender_email: string | null;
  subject: string | null;
  message_content: string | null;
  received_at: string | null;
  direction: string | null;
  status: string | null;
  outlook_message_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}
