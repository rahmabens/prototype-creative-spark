
import React from 'react';
import { Document, User } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

  const getDocumentsForRole = () => {
    switch (currentUser.role) {
      case 'metadonneur':
        return documents.filter(doc => 
          doc.status === 'metadata_extracted' || doc.status === 'metadata_validated'
        );
      case 'annotateur':
        return documents.filter(doc => 
          doc.status === 'metadata_validated' || doc.status === 'annotated'
        );
      case 'expert':
        return documents.filter(doc => 
          doc.status === 'annotated' || doc.status === 'expert_validated'
        );
      default:
        return documents;
    }
  };

  const getStats = () => {
    const total = documents.length;
    const pending = documents.filter(doc => doc.status !== 'completed').length;
    const completed = documents.filter(doc => doc.status === 'completed').length;
    
    return { total, pending, completed };
  };

  const stats = getStats();
  const relevantDocs = getDocumentsForRole();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Documents nécessitant votre attention
        </h2>
        
        {relevantDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Aucun document ne nécessite votre attention pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {relevantDocs.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{doc.filename}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Uploadé le {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                    </p>
                    {doc.metadata.title && (
                      <p className="text-sm text-gray-800 mt-1">
                        Titre: {doc.metadata.title}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(doc.status)}>
                      {getStatusLabel(doc.status)}
                    </Badge>
                    {doc.metadata.extractionConfidence && (
                      <Badge variant="outline">
                        Confiance: {Math.round(doc.metadata.extractionConfidence * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
