
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Save } from 'lucide-react';
import { format } from 'date-fns';

interface BookingDetailsTabProps {
  booking: any;
  status: string;
  setStatus: (value: string) => void;
  internalNotes: string;
  setInternalNotes: (value: string) => void;
  newDateTime: string;
  setNewDateTime: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function BookingDetailsTab({
  booking,
  status,
  setStatus,
  internalNotes,
  setInternalNotes,
  newDateTime,
  setNewDateTime,
  onSave,
  saving
}: BookingDetailsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info */}
        <Card className="bg-gray-700/50 border-orange-900/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-gray-300">
              <strong>Name:</strong> {booking.user.name}
            </div>
            <div className="text-gray-300">
              <strong>Email:</strong> {booking.user.email}
            </div>
            <div className="text-gray-300">
              <strong>Phone:</strong> {booking.user.phone || 'Not provided'}
            </div>
          </CardContent>
        </Card>

        {/* Service Info */}
        <Card className="bg-gray-700/50 border-orange-900/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-gray-300">
              <strong>Service:</strong> {booking.service.name}
            </div>
            <div className="text-gray-300">
              <strong>Duration:</strong> {booking.service.duration} minutes
            </div>
            <div className="text-gray-300">
              <strong>Price:</strong> €{booking.service.price}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Details Form */}
      <Card className="bg-gray-700/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white">Booking Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="datetime" className="text-gray-300">Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="bg-gray-600 border-orange-900/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-gray-300">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="internal-notes" className="text-gray-300">Internal Notes</Label>
            <Textarea
              id="internal-notes"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add internal notes (not visible to client)..."
              className="bg-gray-600 border-orange-900/20 text-white"
              rows={3}
            />
          </div>

          <Button onClick={onSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
