
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Save } from 'lucide-react';

interface AttendanceTabProps {
  attendanceStatus: string;
  setAttendanceStatus: (value: string) => void;
  sessionNotes: string;
  setSessionNotes: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function AttendanceTab({
  attendanceStatus,
  setAttendanceStatus,
  sessionNotes,
  setSessionNotes,
  onSave,
  saving
}: AttendanceTabProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-gray-700/50 border-orange-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            Attendance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="attendance" className="text-gray-300">Attendance Status</Label>
            <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
              <SelectTrigger className="bg-gray-600 border-orange-900/20 text-white">
                <SelectValue placeholder="Select attendance status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-notes" className="text-gray-300">Session Notes</Label>
            <Textarea
              id="session-notes"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add session notes, progress, observations..."
              className="bg-gray-600 border-orange-900/20 text-white"
              rows={4}
            />
          </div>

          <Button onClick={onSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
            <Save className="w-4 h-4 mr-2" />
            Save Attendance & Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
