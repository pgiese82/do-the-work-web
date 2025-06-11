
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
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Attendance Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="attendance" className="text-foreground">Attendance Status</Label>
            <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select attendance status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-notes" className="text-foreground">Session Notes</Label>
            <Textarea
              id="session-notes"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add session notes, progress, observations..."
              className="bg-background border-border text-foreground"
              rows={4}
            />
          </div>

          <Button onClick={onSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            Save Attendance & Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
