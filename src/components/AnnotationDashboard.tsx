
import React, { useState } from 'react';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Eye, FileText } from 'lucide-react';

interface AnnotationDashboardProps {
  documents: Document[];
  currentUser: any;
}

const AnnotationDashboard: React.FC<AnnotationDashboardProps> = ({ documents, currentUser }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

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
    // Simuler l'ouverture du document avec annotations type Prodigy/spaCy
    console.log('Ouverture du document pour annotation:', doc);
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
                  <TableHead>Type de document</TableHead>
                  <TableHead>Contexte</TableHead>
                  <TableHead>Type de fichier</TableHead>
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDocument(doc)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Annoter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Simulation d'interface d'annotation type Prodigy/spaCy */}
      {selectedDoc && (
        <Card>
          <CardHeader>
            <CardTitle>Annotation du document: {selectedDoc.metadata.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Document à l'état brut avec annotations suggérées:</h3>
              <div className="bg-white p-4 border rounded space-y-4">
                <div className="text-sm">
                  <span className="bg-yellow-200 px-1 rounded" title="Entité: Société">
                    {selectedDoc.content.includes('Alpha') ? 'Alpha' : 'Société Alpha'}
                  </span>
                  {' '}et la société{' '}
                  <span className="bg-green-200 px-1 rounded" title="Entité: Société">
                    Beta
                  </span>
                  . Article 1: Objet du contrat. Le présent contrat a pour objet la fourniture de{' '}
                  <span className="bg-blue-200 px-1 rounded" title="Concept: Service">
                    services de développement logiciel
                  </span>
                  ...
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Valider les annotations
                  </Button>
                  <Button size="sm" variant="outline">
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedDoc(null)}>
                    Fermer
                  </Button>
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
