
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, Label, ViewMode, SharedUser } from '../types';
import { useAuth } from './AuthContext';

interface NotesContextType {
  notes: Note[];
  labels: Label[];
  viewMode: ViewMode;
  selectedLabels: string[];
  searchQuery: string;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, noteData: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  addLabel: (name: string) => void;
  updateLabel: (id: string, name: string) => void;
  deleteLabel: (id: string) => void;
  toggleViewMode: () => void;
  toggleLabelFilter: (labelId: string) => void;
  clearLabelFilters: () => void;
  setSearchQuery: (query: string) => void;
  shareNote: (noteId: string, email: string, permission: 'read' | 'edit') => void;
  removeSharedUser: (noteId: string, userId: string) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  labels: [],
  viewMode: 'grid',
  selectedLabels: [],
  searchQuery: '',
  addNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  togglePin: () => {},
  addLabel: () => {},
  updateLabel: () => {},
  deleteLabel: () => {},
  toggleViewMode: () => {},
  toggleLabelFilter: () => {},
  clearLabelFilters: () => {},
  setSearchQuery: () => {},
  shareNote: () => {},
  removeSharedUser: () => {}
});

export const useNotes = () => useContext(NotesContext);

interface NotesProviderProps {
  children: ReactNode;
}

// Mock data for development
const mockLabels: Label[] = [
  { id: '1', name: 'Personal', userId: '1' },
  { id: '2', name: 'Work', userId: '1' },
  { id: '3', name: 'Ideas', userId: '1' }
];

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to AKP Note App!',
    content: 'This is your first note. You can edit it, pin it, add labels, and more!',
    isPinned: true,
    isPasswordProtected: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    color: '#FEF7CD',
    userId: '1',
    labelIds: ['1']
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: '1. Build a personal website\n2. Learn a new programming language\n3. Start a blog',
    isPinned: false,
    isPasswordProtected: false,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
    color: '#D3E4FD',
    userId: '1',
    labelIds: ['2', '3']
  },
  {
    id: '3',
    title: 'Shopping List',
    content: '- Milk\n- Eggs\n- Bread\n- Fruits',
    isPinned: false,
    isPasswordProtected: false,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000),
    color: '#F2FCE2',
    userId: '1',
    labelIds: ['1']
  }
];

export const NotesProvider = ({ children }: NotesProviderProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load notes and labels when user changes
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from an API
      setNotes(mockNotes);
      setLabels(mockLabels);
      
      // Try to get saved view mode
      const savedViewMode = localStorage.getItem('viewMode');
      if (savedViewMode === 'list' || savedViewMode === 'grid') {
        setViewMode(savedViewMode);
      }
    } else {
      setNotes([]);
      setLabels([]);
    }
  }, [user]);
  
  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);
  
  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newNote: Note = {
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      ...noteData
    };
    
    setNotes([newNote, ...notes]);
  };
  
  const updateNote = (id: string, noteData: Partial<Note>) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, ...noteData, updatedAt: new Date() }
        : note
    ));
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const togglePin = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
        : note
    ));
  };
  
  const addLabel = (name: string) => {
    if (!user) return;
    
    const newLabel: Label = {
      id: Date.now().toString(),
      name,
      userId: user.id
    };
    
    setLabels([...labels, newLabel]);
  };
  
  const updateLabel = (id: string, name: string) => {
    // Update the label
    setLabels(labels.map(label => 
      label.id === id ? { ...label, name } : label
    ));
  };
  
  const deleteLabel = (id: string) => {
    // Delete the label
    setLabels(labels.filter(label => label.id !== id));
    
    // Remove the label from any notes that have it
    setNotes(notes.map(note => ({
      ...note,
      labelIds: note.labelIds.filter(labelId => labelId !== id)
    })));
  };
  
  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  };
  
  const toggleLabelFilter = (labelId: string) => {
    setSelectedLabels(prev => 
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    );
  };
  
  const clearLabelFilters = () => {
    setSelectedLabels([]);
  };
  
  const shareNote = (noteId: string, email: string, permission: 'read' | 'edit') => {
    if (!user) return;
    
    setNotes(notes.map(note => {
      if (note.id === noteId) {
        const sharedWith = note.sharedWith || [];
        
        // Generate a fake userId for demo purposes
        const sharedUser: SharedUser = {
          userId: `shared-${Date.now()}`,
          email,
          displayName: email.split('@')[0], // Simple display name from email
          permission
        };
        
        return {
          ...note,
          sharedWith: [...sharedWith, sharedUser],
          updatedAt: new Date()
        };
      }
      return note;
    }));
  };
  
  const removeSharedUser = (noteId: string, userId: string) => {
    setNotes(notes.map(note => {
      if (note.id === noteId && note.sharedWith) {
        return {
          ...note,
          sharedWith: note.sharedWith.filter(user => user.userId !== userId),
          updatedAt: new Date()
        };
      }
      return note;
    }));
  };
  
  return (
    <NotesContext.Provider
      value={{
        notes,
        labels,
        viewMode,
        selectedLabels,
        searchQuery,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
        addLabel,
        updateLabel,
        deleteLabel,
        toggleViewMode,
        toggleLabelFilter,
        clearLabelFilters,
        setSearchQuery,
        shareNote,
        removeSharedUser
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
