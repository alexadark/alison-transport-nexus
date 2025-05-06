export interface ConversationThread {
  id: string;
  subject: string | null;
  outlook_conversation_id: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  agent_name?: string | null; // Added agent_name as an optional property
}

export interface ConversationSummaryData {
  startedBy?: string;
  sentTo?: string[];
  startDate?: string;
  summary?: string;
  customer?: string;
  origin?: string;
  destination?: string;
  items?: string;
  [key: string]: any; // For any additional fields
}

export interface ConversationSummary {
  id: string;
  summary_text: string;
  summary_data: ConversationSummaryData | null;
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
