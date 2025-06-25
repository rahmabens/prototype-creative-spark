import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, FileText, Clock, User } from 'lucide-react';

interface ExpertDashboardProps {
  documents: Document[];
  currentUser: any;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ documents, currentUser }) => {
  const navigate = useNavigate();
  const [showAuditTrail, setShowAuditTrail] = useState<{ [key: string]: boolean }>({});

  const expertDocs = documents.filter(doc => 
    doc.status === 'annotated' || doc.status === 'expert_validated'
  );

  const getContextBadge = (category: string) => {
    switch (category) {
      case 'Guideline':
        return <Badge className="bg-cyan-100 text-cyan-800">Pharmaceutique</Badge>;
      case 'Rapport interne':
        return <Badge className="bg-purple-100 text-purple-800">Technique</Badge>;
      case 'Image':
        return <Badge className="bg-green-100 text-green-800">Biologie</Badge>;
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

  const handleViewDocument = (doc: Document) => {
    navigate(`/expert?docId=${doc.id}`);
  };

  const toggleAuditTrail = (docId: string) => {
    setShowAuditTrail(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const getRecentAuditEntries = (doc: Document) => {
    return doc.auditTrail.slice(0, 3).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Documents pour validation finale</CardTitle>
        </CardHeader>
        <CardContent>
          {expertDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun document disponible pour validation finale.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type de document</TableHead>
                    <TableHead>Contexte</TableHead>
                    <TableHead>Type de fichier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expertDocs.map((doc) => (
                    <React.Fragment key={doc.id}>
                      <TableRow className="hover:bg-gray-50">
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
                          <Badge className="bg-blue-100 text-blue-800">
                            {doc.metadata.category || 'Non défini'}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          {getContextBadge(doc.metadata.category || 'Général')}
                        </TableCell>
                        
                        <TableCell>
                          {getFileTypeBadge(doc.filename)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Valider
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleAuditTrail(doc.id)}
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Audit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {showAuditTrail[doc.id] && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50">
                            <div className="p-4">
                              <h4 className="font-semibold mb-3 text-gray-800">Historique récent</h4>
                              <div className="space-y-2">
                                {getRecentAuditEntries(doc).map((entry) => (
                                  <div key={entry.id} className="flex items-center space-x-3 text-sm">
                                    <Badge className="bg-blue-100 text-blue-800">
                                      {entry.action}
                                    </Badge>
                                    <div className="flex items-center space-x-1 text-gray-600">
                                      <User className="h-3 w-3" />
                                      <span>{entry.userName}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-gray-600">
                                      <Clock className="h-3 w-3" />
                                      <span>{new Date(entry.timestamp).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                    <span className="text-gray-700">{entry.details}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  function getContextBadge(category: string) {
    switch (category) {
      case 'Guideline':
        return <Badge className="bg-cyan-100 text-cyan-800">Pharmaceutique</Badge>;
      case 'Rapport interne':
        return <Badge className="bg-purple-100 text-purple-800">Technique</Badge>;
      case 'Image':
        return <Badge className="bg-green-100 text-green-800">Biologie</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Général</Badge>;
    }
  }

  function getFileTypeBadge(filename: string) {
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
  }

  function handleViewDocument(doc: Document) {
    navigate(`/expert?docId=${doc.id}`);
  }

  function toggleAuditTrail(docId: string) {
    setShowAuditTrail(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  }

  function getRecentAuditEntries(doc: Document) {
    return doc.auditTrail.slice(0, 3).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
};

export default ExpertDashboard;
