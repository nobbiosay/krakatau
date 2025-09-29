import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password wajib diisi');
      return;
    }

    const success = await login(username, password);
    
    if (success) {
      toast({
        title: 'Login berhasil!',
        description: 'Selamat datang di Dashboard Operasional',
      });
      navigate(from, { replace: true });
    } else {
      setError('Username atau password salah');
      toast({
        title: 'Login gagal',
        description: 'Periksa kembali username dan password Anda',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, nextField?: string) => {
    if (e.key === 'Enter') {
      if (nextField) {
        const field = document.getElementById(nextField) as HTMLInputElement;
        field?.focus();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Brand Bar */}
      <div className="fixed top-0 left-0 right-0 z-10 glass border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Krakatau Water Solution</h1>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Divisi Produksi
            </Badge>
          </div>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Masuk Dashboard</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses sistem operasional
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center space-x-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'password')}
                  className="focus-ring"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan username yang telah diberikan
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                  className="focus-ring"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Password minimal 8 karakter
                </p>
              </div>

              <Button
                type="submit"
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Masuk...</span>
                  </div>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">Demo Credentials:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><strong>Username:</strong> operator</p>
                <p><strong>Password:</strong> operator123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;