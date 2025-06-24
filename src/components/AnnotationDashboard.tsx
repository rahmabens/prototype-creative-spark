
import React, { useState } from 'react';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, Clock, FileText } from 'lucide-react';

interface AnnotationDashboardProps {
  documents: Document[];
  currentUser: any;
}

const AnnotationDashboard: React.FC<AnnotationDashboardProps> = ({ documents, currentUser }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const annotationDocs = documents.filter(doc => 
    doc.status === 'metadata_validated' || doc.status === 'annotated'
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'metadata_validated':
        return <Badge className="bg-green-100 text-green-800">✓ Réussi</Badge>;
      case 'annotated':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContextBadge = (category: string) => {
    switch (category) {
      case 'Contrat commercial':
        return <Badge className="bg-cyan-100 text-cyan-800">Pharmaceutique</Badge>;
      case 'Rapport interne':
        return <Badge className="bg-purple-100 text-purple-800">Technique</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Général</Badge>;
    }
  };

  const getFileTypeBadge = (filename: string) => {
    const extension = filename.split('.').pop()?.toUpperCase();
    return (
      <div className="flex items-center space-x-1">
        <Badge variant="outline" className="bg-gray-100">
          {extension}
        </Badge>
        <Badge variant="outline" className="text-blue-600">
          📎 URL
        </Badge>
      </div>
    );
  };

  const formatExtractionTime = (date: string) => {
    const extractionDate = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - extractionDate.getTime()) / (1000 * 60 * 60));
    const diffMinutes = Math.floor(((now.getTime() - extractionDate.getTime()) % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours} hours, ${diffMinutes} minutes ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents pour annotation et correction</CardTitle>
        </CardHeader>
        <CardContent>
          {annotationDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun document disponible pour annotation.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Date d'extraction</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Contexte</TableHead>
                  <TableHead>Type de fichier</TableHead>
                  <TableHead>Métadonnées extraites</TableHead>
                  <TableHead>Temps</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annotationDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium text-blue-600 hover:underline cursor-pointer">
                          {doc.metadata.title || doc.filename}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {doc.id.split('-')[1]}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {new Date(doc.metadata.extractedAt).toLocaleDateString('fr-FR')} {new Date(doc.metadata.extractedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatExtractionTime(doc.metadata.extractedAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(doc.status)}
                    </TableCell>
                    
                    <TableCell>
                      {getContextBadge(doc.metadata.category || 'Général')}
                    </TableCell>
                    
                    <TableCell>
                      {getFileTypeBadge(doc.filename)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {doc.metadata.title && (
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              📝 {doc.metadata.title.substring(0, 20)}... ({Math.round(doc.metadata.extractionConfidence * 100)}%)
                            </Badge>
                          </div>
                        )}
                        {doc.metadata.extractedAt && (
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              📅 {new Date(doc.metadata.extractedAt).toLocaleDateString('fr-FR')} (100%)
                            </Badge>
                          </div>
                        )}
                        {doc.metadata.tags && (
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-cyan-100 text-cyan-800 text-xs">
                              🏷️ {doc.metadata.tags[0]} (90%)
                            </Badge>
                          </div>
                        )}
                        {doc.metadata.author && (
                          <div className="flex items-center space-x-1">
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              👤 {doc.metadata.author} (95%)
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm font-medium">1.33s</div>
                    </TableCell>
                    
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnotationDashboard;
