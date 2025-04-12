
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Note, Label } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { X, PlusCircle, Trash, Palette, Tag, Pin, Image } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
}

const COLORS = [
  { value: '#FEF7CD', name: 'Yellow' },
  { value: '#D3E4FD', name: 'Blue' },
  { value: '#F2FCE2', name: 'Green' },
  { value: '#FFDEE2', name: 'Pink' },
  { value: '#E5DEFF', name: 'Purple' },
  { value: '#FDE1D3', name: 'Peach' },
];

const NoteEditor = ({ note, onClose }: NoteEditorProps) => {
  const { addNote, updateNote, deleteNote, togglePin, labels } = useNotes();
  const { toast } = useToast();
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [color, setColor] = useState(note?.color || '#FEF7CD');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(note?.labelIds || []);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [images, setImages] = useState<string[]>(note?.images || []);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const titleRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Focus the title input when the editor opens
  useEffect(() => {
    setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
  }, []);
  
  // Check for changes
  useEffect(() => {
    if (note) {
      const hasChanged = 
        title !== note.title ||
        content !== note.content ||
        color !== note.color ||
        isPinned !== note.isPinned ||
        JSON.stringify(selectedLabelIds.sort()) !== JSON.stringify(note.labelIds.sort()) ||
        JSON.stringify(images) !== JSON.stringify(note.images || []);
      
      setIsDirty(hasChanged);
      
      // Auto-save if changes detected
      if (hasChanged) {
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current);
        }
        
        autoSaveTimerRef.current = setTimeout(() => {
          handleSave();
        }, 1000);
      }
    }
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, color, isPinned, selectedLabelIds, images]);
  
  const handleSave = () => {
    // Don't save if both title and content are empty
    if (!title.trim() && !content.trim() && images.length === 0) {
      onClose();
      return;
    }
    
    if (note) {
      // Update existing note
      updateNote(note.id, {
        title,
        content,
        color,
        isPinned,
        labelIds: selectedLabelIds,
        images,
      });
      
      toast({
        title: "Note updated",
        description: "Your changes have been saved."
      });
    } else {
      // Create new note
      addNote({
        title,
        content,
        isPinned,
        isPasswordProtected: false,
        color,
        userId: '1', // In a real app, this would be the actual user ID
        labelIds: selectedLabelIds,
        images,
      });
      
      toast({
        title: "Note created",
        description: "Your note has been created."
      });
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (note) {
      deleteNote(note.id);
      toast({
        title: "Note deleted",
        description: "Your note has been deleted."
      });
      onClose();
    }
  };
  
  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    if (note) {
      togglePin(note.id);
    }
  };
  
  const handleLabelToggle = (labelId: string) => {
    setSelectedLabelIds((prev) => {
      if (prev.includes(labelId)) {
        return prev.filter((id) => id !== labelId);
      } else {
        return [...prev, labelId];
      }
    });
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setImages(prevImages => [...prevImages, event.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the file input to allow uploading the same file again
    e.target.value = '';
  };
  
  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter(image => image !== imageToRemove));
  };
  
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" style={{ backgroundColor: color }}>
        <div className="p-4 space-y-4">
          {/* Title input */}
          <Input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="text-lg font-medium bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
          
          {/* Content textarea */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Take a note..."
            className="min-h-[200px] resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          />
          
          {/* Attached images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt="Note attachment" 
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-1 right-1 bg-foreground/30 hover:bg-foreground/50 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-background" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Selected labels */}
          {selectedLabelIds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedLabelIds.map((labelId) => {
                const label = labels.find((l) => l.id === labelId);
                if (!label) return null;
                return (
                  <Badge key={labelId} variant="secondary" className="px-2 py-1">
                    {label.name}
                    <button
                      onClick={() => handleLabelToggle(labelId)}
                      className="ml-1 rounded-full hover:bg-muted/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Actions footer */}
        <div className="flex items-center justify-between p-2 border-t bg-muted/20">
          <div className="flex items-center gap-1">
            {/* Color picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <div className="grid grid-cols-3 gap-1 p-1">
                  {COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className="h-8 w-8 rounded-full cursor-pointer border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {color === c.value && (
                        <div className="flex items-center justify-center h-full">
                          <div className="h-2 w-2 rounded-full bg-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Image upload button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 p-2 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              title="Attach image"
            >
              <Image className="h-4 w-4" />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
            </Button>
            
            {/* Labels dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 p-2 rounded-full">
                  <Tag className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="font-medium text-sm px-2 py-1.5">Labels</div>
                {labels.length === 0 ? (
                  <div className="px-2 py-4 text-center text-muted-foreground">
                    No labels yet
                  </div>
                ) : (
                  labels.map((label) => (
                    <DropdownMenuCheckboxItem
                      key={label.id}
                      checked={selectedLabelIds.includes(label.id)}
                      onCheckedChange={() => handleLabelToggle(label.id)}
                    >
                      {label.name}
                    </DropdownMenuCheckboxItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Pin button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={handleTogglePin}
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'fill-primary' : ''}`} />
            </Button>
            
            {/* Delete button (only for existing notes) */}
            {note && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                
                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Note</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this note? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;
