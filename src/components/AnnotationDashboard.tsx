
import React, { useState } from 'react';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, FileText, Clock, User } from 'lucide-react';

interface AnnotationDashboardProps {
  documents: Document[];
  currentUser: any;
}

const AnnotationDashboard: React.FC<AnnotationDashboardProps> = ({ documents, currentUser }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showAuditTrail, setShowAuditTrail] = useState<{ [key: string]: boolean }>({});

  const annotationDocs = documents.filter(doc => 
    doc.status === 'metadata_validated' || doc.status === 'annotated'
  );

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

  const handleViewDocument = (doc: Document) => {
    setSelectedDoc(doc);
    console.log('Ouverture du document pour annotation:', doc);
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
          <CardTitle>Documents pour annotation et correction</CardTitle>
        </CardHeader>
        <CardContent>
          {annotationDocs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun document disponible pour annotation.</p>
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
                  {annotationDocs.map((doc) => (
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
                              Annoter
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

      {/* Interface d'annotation qui s'ouvre dans une section dédiée */}
      {selectedDoc && (
        <Card>
          <CardHeader>
            <CardTitle>Annotation du document: {selectedDoc.metadata.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Texte du document */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Document à annoter</h3>
                <div className="bg-white p-6 border rounded-lg max-h-96 overflow-y-auto">
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>
                      Contrat entre{' '}
                      <span className="bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300" title="Entité: Société">
                        Alpha Corporation
                      </span>
                      {' '}et la société{' '}
                      <span className="bg-green-200 px-1 rounded cursor-pointer hover:bg-green-300" title="Entité: Société">
                        Beta Industries
                      </span>
                      .
                    </p>
                    <p>
                      <strong>Article 1: Objet du contrat.</strong> Le présent contrat a pour objet la fourniture de{' '}
                      <span className="bg-blue-200 px-1 rounded cursor-pointer hover:bg-blue-300" title="Concept: Service">
                        services de développement logiciel
                      </span>
                      {' '}pour une durée de{' '}
                      <span className="bg-purple-200 px-1 rounded cursor-pointer hover:bg-purple-300" title="Durée: Temporelle">
                        24 mois
                      </span>
                      .
                    </p>
                    <p>
                      Le montant total du contrat s'élève à{' '}
                      <span className="bg-red-200 px-1 rounded cursor-pointer hover:bg-red-300" title="Montant: Financier">
                        500 000 euros
                      </span>
                      {' '}payable en{' '}
                      <span className="bg-orange-200 px-1 rounded cursor-pointer hover:bg-orange-300" title="Modalité: Paiement">
                        versements mensuels
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>

              {/* Panneau d'annotation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Outils d'annotation</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Types d'entités</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2 bg-yellow-200 text-yellow-800 rounded text-sm hover:bg-yellow-300">
                        Société
                      </button>
                      <button className="p-2 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300">
                        Organisation
                      </button>
                      <button className="p-2 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300">
                        Service
                      </button>
                      <button className="p-2 bg-purple-200 text-purple-800 rounded text-sm hover:bg-purple-300">
                        Durée
                      </button>
                      <button className="p-2 bg-red-200 text-red-800 rounded text-sm hover:bg-red-300">
                        Montant
                      </button>
                      <button className="p-2 bg-orange-200 text-orange-800 rounded text-sm hover:bg-orange-300">
                        Modalité
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Annotations détectées</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>"Alpha Corporation" → Société</span>
                        <span className="text-green-600">✓ Validé</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>"Beta Industries" → Société</span>
                        <span className="text-yellow-600">⚠ À valider</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>"500 000 euros" → Montant</span>
                        <span className="text-green-600">✓ Validé</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Valider les annotations
                    </Button>
                    <Button size="sm" variant="outline">
                      Exporter
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedDoc(null)}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnotationDashboard;
