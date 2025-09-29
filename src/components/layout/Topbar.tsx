import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Krakatau Water Solution</h1>
              <p className="text-xs text-muted-foreground">Divisi Produksi</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/input/kerenceng"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Input Kerenceng
            </NavLink>
            <NavLink
              to="/input/cidanau"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Input Cidanau
            </NavLink>
            <NavLink
              to="/data/kerenceng"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Data Kerenceng
            </NavLink>
            <NavLink
              to="/data/cidanau"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Data Cidanau
            </NavLink>
            <NavLink
              to="/rekap-data"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              Rekap Data
            </NavLink>
          </nav>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
                <span className="text-lg">👷</span>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;