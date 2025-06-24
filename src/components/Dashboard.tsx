
import React from 'react';
import { Document, User } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle, XCircle, RefreshCw, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  documents: Document[];
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, currentUser }) => {
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'uploaded': return 'bg-gray-100 text-gray-800';
      case 'metadata_extracted': return 'bg-yellow-100 text-yellow-800';
      case 'metadata_validated': return 'bg-blue-100 text-blue-800';
      case 'annotated': return 'bg-green-100 text-green-800';
      case 'expert_validated': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'uploaded': return 'Uploadé';
      case 'metadata_extracted': return 'Métadonnées extraites';
      case 'metadata_validated': return 'Métadonnées validées';
      case 'annotated': return 'Annoté';
      case 'expert_validated': return 'Validé par expert';
      case 'completed': return 'Terminé';
    }
  };

  const getStats = () => {
    const totalScrapped = documents.length;
    const totalPlanned = 150; // Nombre planifié (exemple)
    const inProgress = documents.filter(doc => doc.status !== 'completed').length;
    const completed = documents.filter(doc => doc.status === 'completed').length;
    const rejected = 8; // Documents refusés (exemple)
    const rescrapping = 3; // Documents en cours de rescrapping (exemple)
    
    return { 
      totalScrapped, 
      totalPlanned, 
      inProgress, 
      completed, 
      rejected, 
      rescrapping 
    };
  };

  const stats = getStats();

  // Données pour l'histogramme des KPIs
  const kpiData = [
    {
      name: 'Documents',
      scrapped: stats.totalScrapped,
      planned: stats.totalPlanned,
      completed: stats.completed,
      inProgress: stats.inProgress
    }
  ];

  // Données pour l'histogramme des tâches assignées
  const taskData = [
    { name: 'Extraction', value: 15, color: '#8884d8' },
    { name: 'Validation', value: 8, color: '#82ca9d' },
    { name: 'Annotation', value: 12, color: '#ffc658' },
    { name: 'Correction', value: 5, color: '#ff7300' },
    { name: 'Finalisation', value: 3, color: '#00ff00' }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents Scrappés / Planifiés</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalScrapped} / {stats.totalPlanned}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((stats.totalScrapped / stats.totalPlanned) * 100)}% réalisé
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours / Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.inProgress} / {stats.totalScrapped}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((stats.inProgress / stats.totalScrapped) * 100)}% en cours
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés / Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed} / {stats.totalScrapped}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round((stats.completed / stats.totalScrapped) * 100)}% terminé
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents Refusés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours de Rescrapping</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rescrapping}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Histogramme des KPIs et Tâches Assignées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              KPIs des Documents
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="planned" fill="#e5e7eb" name="Planifiés" />
                <Bar dataKey="scrapped" fill="#3b82f6" name="Scrappés" />
                <Bar dataKey="completed" fill="#10b981" name="Terminés" />
                <Bar dataKey="inProgress" fill="#f59e0b" name="En cours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tâches Assignées
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
