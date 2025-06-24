
import React, { useState } from 'react';
import { Document, AuditEntry } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Clock, User, FileText } from 'lucide-react';

interface AuditTrailProps {
  documents: Document[];
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<string>('all');

  const getAllAuditEntries = (): (AuditEntry & { documentId: string; documentName: string })[] => {
    const entries: (AuditEntry & { documentId: string; documentName: string })[] = [];
    
    documents.forEach(doc => {
      doc.auditTrail.forEach(entry => {
        entries.push({
          ...entry,
          documentId: doc.id,
          documentName: doc.filename
        });
      });
    });

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const filteredEntries = getAllAuditEntries().filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDocument = selectedDocument === 'all' || entry.documentId === selectedDocument;
    
    return matchesSearch && matchesDocument;
  });

  const getActionColor = (action: string) => {
    if (action.includes('uploadé')) return 'bg-blue-100 text-blue-800';
    if (action.includes('extraites') || action.includes('Extraction')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('validées') || action.includes('Validation')) return 'bg-green-100 text-green-800';
    if (action.includes('corrigées') || action.includes('Correction')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Journal d'audit et traçabilité
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les documents</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.filename}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucune entrée d'audit trouvée.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={`${entry.documentId}-${entry.id}`} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getActionColor(entry.action)}>
                        {entry.action}
                      </Badge>
                      <span className="text-sm text-gray-600">{entry.documentName}</span>
                    </div>
                    
                    <p className="text-gray-800 mb-2">{entry.details}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{entry.userName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(entry.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>

                    {(entry.previousValue || entry.newValue) && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                        {entry.previousValue && (
                          <div className="mb-2">
                            <span className="font-medium text-red-600">Avant: </span>
                            <span className="text-gray-700">{JSON.stringify(entry.previousValue)}</span>
                          </div>
                        )}
                        {entry.newValue && (
                          <div>
                            <span className="font-medium text-green-600">Après: </span>
                            <span className="text-gray-700">{JSON.stringify(entry.newValue)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuditTrail;
