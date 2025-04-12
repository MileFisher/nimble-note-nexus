
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, Tag, Edit, X, Home, Archive, Trash } from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { labels, selectedLabels, toggleLabelFilter, addLabel, updateLabel, deleteLabel } = useNotes();
  const [newLabelName, setNewLabelName] = useState('');
  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
  const [editingLabelName, setEditingLabelName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleCreateLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      addLabel(newLabelName.trim());
      setNewLabelName('');
      setIsOpen(false);
    }
  };
  
  const handleSaveLabel = (id: string) => {
    if (editingLabelName.trim()) {
      updateLabel(id, editingLabelName.trim());
      setEditingLabelId(null);
      setEditingLabelName('');
    }
  };
  
  const handleStartEditing = (id: string, name: string) => {
    setEditingLabelId(id);
    setEditingLabelName(name);
  };
  
  const handleCancelEditing = () => {
    setEditingLabelId(null);
    setEditingLabelName('');
  };
  
  const handleDeleteLabel = (id: string) => {
    deleteLabel(id);
  };

  return (
    <aside className="w-64 bg-sidebar border-r h-full hidden md:flex md:flex-col">
      <div className="p-4 flex flex-col gap-2">
        <Link to="/" className="text-xl font-bold px-2 mb-4">
          NimbleNotes
        </Link>
        
        <Button asChild variant="ghost" className="justify-start">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Home
          </Link>
        </Button>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2 w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Note
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Labels</h3>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Label</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateLabel} className="space-y-4">
                <Input
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Enter label name"
                />
                <Button type="submit" className="w-full">Create Label</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-1">
          {labels.map((label) => (
            <div key={label.id} className="flex items-center gap-1">
              {editingLabelId === label.id ? (
                <div className="flex items-center w-full gap-1">
                  <Input
                    value={editingLabelName}
                    onChange={(e) => setEditingLabelName(e.target.value)}
                    className="h-7 py-1 text-xs"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleSaveLabel(label.id)}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={handleCancelEditing}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent flex-grow",
                      selectedLabels.includes(label.id) && "bg-primary/10"
                    )}
                    onClick={() => toggleLabelFilter(label.id)}
                  >
                    <Tag className="h-3 w-3" />
                    <span className="truncate">{label.name}</span>
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleStartEditing(label.id, label.name)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleDeleteLabel(label.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto border-t">
        <Button asChild variant="ghost" className="justify-start w-full rounded-none">
          <Link to="/archive">
            <Archive className="mr-2 h-4 w-4" /> Archive
          </Link>
        </Button>
        <Button asChild variant="ghost" className="justify-start w-full rounded-none">
          <Link to="/trash">
            <Trash className="mr-2 h-4 w-4" /> Trash
          </Link>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
