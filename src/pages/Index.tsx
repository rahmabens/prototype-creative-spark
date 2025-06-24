
import React, { useState } from 'react';
import { User } from '../types';
import { mockDocuments } from '../data/mockData';
import LoginForm from '../components/LoginForm';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import AuditTrail from '../components/AuditTrail';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard documents={mockDocuments} currentUser={currentUser} />;
      case 'audit':
        return <AuditTrail documents={mockDocuments} />;
      case 'metadata':
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Module de validation des métadonnées</h2>
            <p className="text-gray-600">Interface spécialisée pour les métadonneurs - En développement</p>
          </div>
        );
      case 'annotation':
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Module d'annotation et correction</h2>
            <p className="text-gray-600">Interface spécialisée pour les annotateurs - En développement</p>
          </div>
        );
      case 'validation':
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Module de validation finale</h2>
            <p className="text-gray-600">Interface spécialisée pour les experts métier - En développement</p>
          </div>
        );
      default:
        return <Dashboard documents={mockDocuments} currentUser={currentUser} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </Layout>
  );
};

export default Index;
