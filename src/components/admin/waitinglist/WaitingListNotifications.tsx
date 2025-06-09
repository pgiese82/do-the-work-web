
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Send } from 'lucide-react';

export function WaitingListNotifications() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Email Notifications */}
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-400" />
            Email Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="availability_email" className="text-gray-300">
              Slot Available Notification
            </Label>
            <Textarea
              id="availability_email"
              placeholder="Hi {name}, we have a slot available for {service} on {date} at {time}..."
              className="bg-gray-700/50 border-orange-900/20 text-white mt-2"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="reminder_email" className="text-gray-300">
              Waiting List Reminder
            </Label>
            <Textarea
              id="reminder_email"
              placeholder="Hi {name}, you're still on our waiting list for {service}..."
              className="bg-gray-700/50 border-orange-900/20 text-white mt-2"
              rows={4}
            />
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            <Send className="w-4 h-4 mr-2" />
            Save Email Templates
          </Button>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="bg-gray-800/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-400" />
            SMS Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="availability_sms" className="text-gray-300">
              Slot Available SMS
            </Label>
            <Textarea
              id="availability_sms"
              placeholder="Slot available for {service} on {date} at {time}. Reply YES to book."
              className="bg-gray-700/50 border-orange-900/20 text-white mt-2"
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">160 characters max</div>
          </div>
          
          <div>
            <Label htmlFor="reminder_sms" className="text-gray-300">
              Waiting List Reminder SMS
            </Label>
            <Textarea
              id="reminder_sms"
              placeholder="Still waiting for {service}? We'll notify you when slots open."
              className="bg-gray-700/50 border-orange-900/20 text-white mt-2"
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1">160 characters max</div>
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            <Send className="w-4 h-4 mr-2" />
            Save SMS Templates
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card className="bg-gray-800/50 border-orange-900/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Bulk Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Notify All Active
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-500/20 text-blue-300 hover:bg-blue-500/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              SMS All Active
            </Button>
            <Button 
              variant="outline" 
              className="border-green-500/20 text-green-300 hover:bg-green-500/10"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Reminders
            </Button>
          </div>
          
          <div className="text-sm text-gray-400">
            Use bulk actions to notify multiple clients at once when slots become available or send reminder messages.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
