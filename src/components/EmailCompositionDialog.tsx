
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface EmailCompositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  emailType: 'intro' | 'followup';
}

const EmailCompositionDialog: React.FC<EmailCompositionDialogProps> = ({
  open,
  onOpenChange,
  recipientName,
  recipientEmail,
  subject,
  emailType
}) => {
  const { toast } = useToast();
  const [emailContent, setEmailContent] = React.useState('');

  React.useEffect(() => {
    // Set default email template based on type
    if (open) {
      if (emailType === 'intro') {
        setEmailContent(`Dear ${recipientName},\n\nI hope this email finds you well. I am reaching out from our company to introduce our logistics services.\n\nWe would love to discuss how we can support your supply chain needs. Would you be available for a brief call this week?\n\nBest regards,\n[Your Name]`);
      } else {
        setEmailContent(`Dear ${recipientName},\n\nI hope you're doing well. I'm following up on our previous conversation about our logistics services.\n\nI'd like to answer any questions you might have or provide additional information that might be helpful.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`);
      }
    }
  }, [open, recipientName, emailType]);

  const handleSendEmail = () => {
    // In a real app, this would send the email via an API
    console.log('Sending email to:', recipientEmail);
    console.log('Subject:', subject);
    console.log('Content:', emailContent);
    
    toast({
      title: "Email sent",
      description: `Your email to ${recipientName} has been sent successfully.`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {emailType === 'intro' ? 'Send Introduction Email' : 'Send Follow-up Email'}
          </DialogTitle>
          <DialogDescription>
            Compose your email to {recipientName} ({recipientEmail})
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="recipient" className="text-sm font-medium">To:</label>
            <div id="recipient" className="text-sm px-3 py-2 border rounded-md bg-muted">{recipientName} &lt;{recipientEmail}&gt;</div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">Subject:</label>
            <div id="subject" className="text-sm px-3 py-2 border rounded-md bg-muted">{subject}</div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">Message:</label>
            <Textarea
              id="message"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} className="bg-status-transit hover:bg-status-transit/90 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCompositionDialog;
