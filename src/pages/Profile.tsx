
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast({
        title: "Error",
        description: "Display name cannot be empty.",
        variant: "destructive"
      });
      return;
    }
    
    if (user) {
      updateUser({ displayName: displayName.trim() });
      toast({
        title: "Success",
        description: "Your profile has been updated."
      });
    }
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All password fields are required.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    // This would be an API call in a real app
    toast({
      title: "Success",
      description: "Your password has been changed."
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordDialogOpen(false);
  };
  
  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account's profile information
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback className="text-2xl">
                        {user.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      type="button"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                
                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    readOnly
                    disabled
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit">Save Changes</Button>
                <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setChangePasswordDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </form>
          </Card>
          
          {/* Account Verification */}
          {!user.isVerified && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
              <CardHeader>
                <CardTitle className="text-orange-800 dark:text-orange-300">
                  Verify Your Email
                </CardTitle>
                <CardDescription className="text-orange-700 dark:text-orange-400">
                  Your email address is not verified. Please check your inbox for a verification link.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="bg-orange-100 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:hover:bg-orange-900/50">
                  Resend Verification Email
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
