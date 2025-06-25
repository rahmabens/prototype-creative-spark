import React from 'react';
import { User, UserRole } from '../types';
import { Button } from './ui/button';
import { LogOut, FileText, Users, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  onLogout: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, activeTab, onTabChange }) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'metadonneur': return 'bg-blue-100 text-blue-800';
      case 'annotateur': return 'bg-green-100 text-green-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'metadonneur': return <FileText className="w-4 h-4" />;
      case 'annotateur': return <Users className="w-4 h-4" />;
      case 'expert': return <Shield className="w-4 h-4" />;
    }
  };

  const getTabsForRole = (role: UserRole) => {
    const commonTabs = [
      { id: 'dashboard', label: 'Tableau de bord' }
    ];

    switch (role) {
      case 'metadonneur':
        return [
          ...commonTabs,
          { id: 'metadata', label: 'Validation Métadonnées' }
        ];
      case 'annotateur':
        return [
          ...commonTabs,
          { id: 'annotation', label: 'Annotation & Correction' }
        ];
      case 'expert':
        return [
          ...commonTabs,
          { id: 'validation', label: 'Validation Finale' },
          { id: 'audit', label: 'Audit & Traçabilité' }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Plateforme d'Extraction & Validation
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getRoleColor(currentUser.role)}`}>
                {getRoleIcon(currentUser.role)}
                <span className="capitalize">{currentUser.role}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{currentUser.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {getTabsForRole(currentUser.role).map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
