
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
  const getStats = () => {
    const totalScrapped = documents.length;
    const totalPlanned = 150; // Nombre planifié (exemple)
    const totalInReextraction = 25; // Total de documents mis en réextraction
    const inProgress = 12; // Documents actuellement en cours de scrapping par rapport au total en réextraction
    const completed = documents.filter(doc => doc.status === 'completed').length;
    const rejected = 8; // Documents refusés (exemple)
    const rescrapping = 3; // Documents en cours de rescrapping par rapport au total à réextraire
    
    return { 
      totalScrapped, 
      totalPlanned, 
      inProgress, 
      completed, 
      rejected, 
      rescrapping,
      totalInReextraction
    };
  };

  const stats = getStats();

  // Données pour l'histogramme des KPIs avec couleurs IA professionnelles
  const kpiData = [
    {
      name: 'Documents',
      'Planifiés': stats.totalPlanned,
      'Scrappés': stats.totalScrapped,
      'Terminés': stats.completed,
      'En cours': stats.inProgress
    }
  ];

  // Données pour l'histogramme des tâches assignées avec couleurs IA
  const taskData = [
    { name: 'Extraction', value: 15, color: '#E91E63' }, // Rose IA
    { name: 'Validation', value: 8, color: '#9C27B0' }, // Violet IA
    { name: 'Annotation', value: 12, color: '#2196F3' }, // Bleu IA
    { name: 'Correction', value: 5, color: '#FF6B35' }, // Orange IA
    { name: 'Finalisation', value: 3, color: '#00BCD4' } // Cyan IA
  ];

  const TASK_COLORS = ['#E91E63', '#9C27B0', '#2196F3', '#FF6B35', '#00BCD4'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-800">Documents Scrappés / Planifiés</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats.totalScrapped} / {stats.totalPlanned}
              </p>
              <p className="text-xs text-blue-600">
                {Math.round((stats.totalScrapped / stats.totalPlanned) * 100)}% réalisé
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-800">En cours / Total en réextraction</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.inProgress} / {stats.totalInReextraction}
              </p>
              <p className="text-xs text-purple-600">
                {Math.round((stats.inProgress / stats.totalInReextraction) * 100)}% en cours
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-emerald-800">Terminés / Total scrappé</p>
              <p className="text-2xl font-bold text-emerald-900">
                {stats.completed} / {stats.totalScrapped}
              </p>
              <p className="text-xs text-emerald-600">
                {Math.round((stats.completed / stats.totalScrapped) * 100)}% terminé
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-100 border-red-200">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-red-800">Documents Refusés</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-teal-100 border-cyan-200">
          <div className="flex items-center">
            <RefreshCw className="h-8 w-8 text-cyan-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-cyan-800">Rescrapping / Total à réextraire</p>
              <p className="text-2xl font-bold text-cyan-900">{stats.rescrapping} / {stats.totalInReextraction}</p>
              <p className="text-xs text-cyan-600">
                {Math.round((stats.rescrapping / stats.totalInReextraction) * 100)}% en rescrapping
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Histogrammes avec couleurs IA professionnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              KPIs des Documents
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#475569' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#475569' }}
                  axisLine={{ stroke: '#CBD5E1' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="Planifiés" fill="#F1F5F9" name="Planifiés" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Scrappés" fill="#2196F3" name="Scrappés" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Terminés" fill="#9C27B0" name="Terminés" radius={[4, 4, 0, 0]} />
                <Bar dataKey="En cours" fill="#E91E63" name="En cours" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-100">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tâches Assignées
            </h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="#FFFFFF"
                  strokeWidth={3}
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
