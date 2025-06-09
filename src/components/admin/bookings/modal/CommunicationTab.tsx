
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, Send } from 'lucide-react';

interface CommunicationTabProps {
  booking: any;
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  emailMessage: string;
  setEmailMessage: (value: string) => void;
  smsMessage: string;
  setSmsMessage: (value: string) => void;
  onSendEmail: () => void;
  onSendSMS: () => void;
  sendingEmail: boolean;
  sendingSMS: boolean;
}

export function CommunicationTab({
  booking,
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
  smsMessage,
  setSmsMessage,
  onSendEmail,
  onSendSMS,
  sendingEmail,
  sendingSMS
}: CommunicationTabProps) {
  return (
    <div className="space-y-6">
      {/* Email Section */}
      <Card className="bg-gray-700/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-orange-400" />
            Send Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email-subject" className="text-gray-300">Subject</Label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject..."
              className="bg-gray-600 border-orange-900/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="email-message" className="text-gray-300">Message</Label>
            <Textarea
              id="email-message"
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              placeholder="Email message..."
              className="bg-gray-600 border-orange-900/20 text-white"
              rows={4}
            />
          </div>
          <Button 
            onClick={onSendEmail} 
            disabled={sendingEmail || !emailSubject || !emailMessage}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
        </CardContent>
      </Card>

      {/* SMS Section */}
      <Card className="bg-gray-700/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-400" />
            Send SMS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sms-message" className="text-gray-300">Message</Label>
            <Textarea
              id="sms-message"
              value={smsMessage}
              onChange={(e) => setSmsMessage(e.target.value)}
              placeholder="SMS message..."
              className="bg-gray-600 border-orange-900/20 text-white"
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">
              {smsMessage.length}/160 characters
            </div>
          </div>
          <Button 
            onClick={onSendSMS} 
            disabled={sendingSMS || !smsMessage || !booking.user.phone}
            className="bg-green-500 hover:bg-green-600"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendingSMS ? 'Sending...' : 'Send SMS'}
          </Button>
          {!booking.user.phone && (
            <p className="text-yellow-400 text-sm">No phone number available for this client</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
