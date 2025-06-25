
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Document } from '../types';
import { mockDocuments } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, User, Clock } from 'lucide-react';

const AnnotationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('docId');
  
  const document = mockDocuments.find(doc => doc.id === docId);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <h1 className="text-2xl font-semibold mb-4">Document non trouvé</h1>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getRecentAuditEntries = (doc: Document) => {
    return doc.auditTrail.slice(0, 3).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Annotation du document
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAuditTrail(!showAuditTrail)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {showAuditTrail ? 'Masquer' : 'Afficher'} l'audit
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Informations du document */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{document.metadata.title || document.filename}</span>
                <div className="flex space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    {document.metadata.category || 'Non défini'}
                  </Badge>
                  <Badge variant="outline">
                    ID: {document.id.split('-')[1]}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Audit Trail (optionnel) */}
          {showAuditTrail && (
            <Card>
              <CardHeader>
                <CardTitle>Historique des modifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getRecentAuditEntries(document).map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-3 text-sm p-3 bg-gray-50 rounded">
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
              </CardContent>
            </Card>
          )}

          {/* Interface d'annotation */}
          <Card>
            <CardContent className="p-6">
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
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnnotationPage;
