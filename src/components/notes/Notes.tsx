
import { useState } from 'react';
import { useNotes } from '@/context/NotesContext';
import Note from './Note';
import NoteEditor from './NoteEditor';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Notes = () => {
  const { notes, viewMode, selectedLabels, searchQuery } = useNotes();
  const [isCreating, setIsCreating] = useState(false);
  
  // Filter notes based on selected labels and search query
  const filteredNotes = notes.filter(note => {
    // Filter by selected labels
    const matchesLabels = selectedLabels.length === 0 || selectedLabels.some(labelId => note.labelIds.includes(labelId));
    
    // Filter by search query
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesLabels && matchesSearch;
  });
  
  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);
  
  // Sort notes by updatedAt date (most recent first)
  const sortedPinnedNotes = [...pinnedNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  const sortedUnpinnedNotes = [...unpinnedNotes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  return (
    <div className="space-y-6">
      <Button
        onClick={() => setIsCreating(true)}
        variant="outline"
        className="w-full max-w-3xl mx-auto flex items-center justify-start pl-4 text-muted-foreground"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Take a note...
      </Button>
      
      {isCreating && (
        <NoteEditor onClose={() => setIsCreating(false)} />
      )}
      
      {sortedPinnedNotes.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-medium pl-2">Pinned</h2>
          <div className={cn(
            viewMode === 'grid' ? 'note-container' : 'note-list'
          )}>
            {sortedPinnedNotes.map(note => (
              <Note key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {sortedPinnedNotes.length > 0 && (
          <h2 className="text-lg font-medium pl-2">Others</h2>
        )}
        
        {sortedUnpinnedNotes.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' ? 'note-container' : 'note-list'
          )}>
            {sortedUnpinnedNotes.map(note => (
              <Note key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {selectedLabels.length > 0 || searchQuery ? 
              "No notes match your filters." : 
              "No notes yet. Create your first note!"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
