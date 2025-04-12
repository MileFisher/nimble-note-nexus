
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      toast({
        title: "Success",
        description: "If your email is registered, you will receive a password reset link."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we will send you a link to reset your password
          </CardDescription>
        </CardHeader>
        
        {isSubmitted ? (
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <h3 className="font-medium mb-2">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                If an account exists with the email you entered, we've sent a password reset link.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/login">Return to Login</Link>
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Send Reset Link"}
              </Button>
              <Button variant="link" asChild className="mt-2">
                <Link to="/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
