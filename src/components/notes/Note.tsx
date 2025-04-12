
import { useState } from 'react';
import { Note as NoteType } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin, Tag, Lock, Share2, Image } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { formatDistanceToNow } from 'date-fns';
import NoteEditor from './NoteEditor';

interface NoteProps {
  note: NoteType;
}

const Note = ({ note }: NoteProps) => {
  const { labels, togglePin } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  
  const noteLabels = labels.filter(label => note.labelIds.includes(label.id));
  const isShared = note.sharedWith && note.sharedWith.length > 0;
  
  const handleNoteClick = () => {
    setIsEditing(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditing(false);
  };
  
  return (
    <>
      <Card 
        className="note-card" 
        style={{ backgroundColor: note.color }} 
        onClick={handleNoteClick}
      >
        <CardContent className="note-card-content">
          {note.title && <h3 className="font-medium mb-2">{note.title}</h3>}
          <div className="text-sm whitespace-pre-line">{note.content}</div>
          
          {/* Display attached images */}
          {note.images && note.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {note.images.slice(0, 3).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt="Note attachment" 
                  className="h-16 w-16 object-cover rounded-md"
                />
              ))}
              {note.images.length > 3 && (
                <div className="h-16 w-16 bg-muted/40 rounded-md flex items-center justify-center text-muted-foreground">
                  +{note.images.length - 3}
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="note-card-footer">
          <div className="flex items-center gap-1 flex-wrap">
            {noteLabels.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                {noteLabels.slice(0, 2).map(label => (
                  <Badge key={label.id} variant="outline" className="px-1.5 py-0 text-xs">
                    {label.name}
                  </Badge>
                ))}
                {noteLabels.length > 2 && <Badge variant="outline" className="px-1.5 py-0 text-xs">+{noteLabels.length - 2}</Badge>}
              </div>
            )}
            {note.images && note.images.length > 0 && (
              <div className="flex items-center gap-1">
                <Image className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{note.images.length}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {note.isPasswordProtected && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
            {isShared && (
              <div className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{note.sharedWith!.length}</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note.id);
              }}
            >
              <Pin className={`h-3.5 w-3.5 ${note.isPinned ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
            </Button>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {isEditing && (
        <NoteEditor note={note} onClose={handleCloseEditor} />
      )}
    </>
  );
};

export default Note;
