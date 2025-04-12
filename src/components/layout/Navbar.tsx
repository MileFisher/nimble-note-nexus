
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, Grid, List, Sun, Moon, Menu,
  User, Settings, LogOut
} from 'lucide-react';
import { useNotes } from '@/context/NotesContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { viewMode, toggleViewMode, searchQuery, setSearchQuery } = useNotes();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchInputVisible, setSearchInputVisible] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const toggleSearch = () => {
    setSearchInputVisible(!searchInputVisible);
    if (!searchInputVisible) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-background border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {!searchInputVisible && (
            <Link to="/" className="text-xl font-bold">
              NimbleNotes
            </Link>
          )}
        </div>
        
        <div className={`flex-1 mx-4 transition-all duration-300 ${searchInputVisible ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-100'}`}>
          {searchInputVisible || window.innerWidth >= 768 ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 w-full max-w-lg mx-auto rounded-full bg-muted/40"
              />
            </div>
          ) : null}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleViewMode}>
            {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-full" size="icon">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.displayName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
