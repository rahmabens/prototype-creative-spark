
import React, { useState } from 'react';
import { User } from '../types';
import { mockDocuments } from '../data/mockData';
import LandingPage from '../components/LandingPage';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import AuditTrail from '../components/AuditTrail';
import MetadataValidation from '../components/MetadataValidation';
import AnnotationDashboard from '../components/AnnotationDashboard';
import ExpertDashboard from '../components/ExpertDashboard';

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
    return <LandingPage onLogin={handleLogin} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard documents={mockDocuments} currentUser={currentUser} />;
      case 'audit':
        return <AuditTrail documents={mockDocuments} />;
      case 'metadata':
        return <MetadataValidation documents={mockDocuments} currentUser={currentUser} />;
      case 'annotation':
        return <AnnotationDashboard documents={mockDocuments} currentUser={currentUser} />;
      case 'validation':
        return <ExpertDashboard documents={mockDocuments} currentUser={currentUser} />;
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
