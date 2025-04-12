
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { UserPreferences } from '@/types';
import { Moon, Sun } from 'lucide-react';

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const colorOptions = [
  { value: '#FEF7CD', name: 'Yellow' },
  { value: '#D3E4FD', name: 'Blue' },
  { value: '#F2FCE2', name: 'Green' },
  { value: '#FFDEE2', name: 'Pink' },
  { value: '#E5DEFF', name: 'Purple' },
  { value: '#FDE1D3', name: 'Peach' },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  if (!user) {
    return null;
  }
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    const updatedPreferences: UserPreferences = {
      ...user.preferences,
      fontSize: size
    };
    
    updateUser({ preferences: updatedPreferences });
    toast({
      title: "Font Size Updated",
      description: `Font size has been set to ${size}.`
    });
  };
  
  const handleDefaultColorChange = (color: string) => {
    const updatedPreferences: UserPreferences = {
      ...user.preferences,
      defaultNoteColor: color
    };
    
    updateUser({ preferences: updatedPreferences });
    toast({
      title: "Default Color Updated",
      description: "Default note color has been changed."
    });
  };

  return (
    <MainLayout>
      <div className="container py-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how your notes look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Toggle */}
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => theme === 'dark' && toggleTheme()}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => theme === 'light' && toggleTheme()}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                </div>
              </div>
              
              {/* Font Size */}
              <div className="space-y-2">
                <Label>Font Size</Label>
                <RadioGroup
                  defaultValue={user.preferences.fontSize}
                  onValueChange={(value) => handleFontSizeChange(value as 'small' | 'medium' | 'large')}
                  className="flex gap-4"
                >
                  {fontSizeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Default Note Color */}
              <div className="space-y-2">
                <Label>Default Note Color</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleDefaultColorChange(option.value)}
                      className={`rounded-md h-12 border-2 ${
                        user.preferences.defaultNoteColor === option.value
                          ? 'border-primary ring-2 ring-primary/50'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    >
                      <span className="sr-only">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
