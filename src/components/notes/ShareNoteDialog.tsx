
import { useState } from 'react';
import { Note, SharedUser } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Send, UserPlus } from 'lucide-react';

interface ShareNoteDialogProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShareNote: (noteId: string, email: string, permission: 'read' | 'edit') => void;
  onRemoveSharedUser: (noteId: string, userId: string) => void;
}

const ShareNoteDialog = ({ 
  note, 
  open, 
  onOpenChange, 
  onShareNote,
  onRemoveSharedUser 
}: ShareNoteDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'read' | 'edit'>('read');

  const handleShare = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Check if already shared with this email
    if (note.sharedWith?.some(user => user.email === email)) {
      toast({
        title: "Already shared",
        description: "This note is already shared with this email",
        variant: "destructive"
      });
      return;
    }

    onShareNote(note.id, email, permission);
    setEmail('');
    
    toast({
      title: "Note shared",
      description: `Note shared with ${email} successfully`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share "{note.title || 'Untitled Note'}"</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="permission">Permission</Label>
              <Select value={permission} onValueChange={(value) => setPermission(value as 'read' | 'edit')}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleShare} className="mb-0.5 gap-1">
              <Send className="h-4 w-4" />
              Share
            </Button>
          </div>

          {note.sharedWith && note.sharedWith.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">People with access</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Permission</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {note.sharedWith.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.permission === 'edit' ? 'default' : 'secondary'}>
                          {user.permission === 'edit' ? 'Can edit' : 'Can view'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => onRemoveSharedUser(note.id, user.userId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>This note is not shared with anyone yet</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareNoteDialog;
