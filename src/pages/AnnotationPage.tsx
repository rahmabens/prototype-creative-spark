
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Document } from '../types';
import { mockDocuments } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, User, Clock, Plus, X, Check } from 'lucide-react';

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

  const entityTypes = [
    { name: 'FACTOR', color: 'bg-blue-500 text-white', label: 'Facteur' },
    { name: 'CONDITION', color: 'bg-orange-400 text-white', label: 'Condition' },
    { name: 'METHOD', color: 'bg-purple-500 text-white', label: 'Méthode' },
    { name: 'EFFECT', color: 'bg-green-500 text-white', label: 'Effet' }
  ];

  const renderDocumentContent = () => {
    if (document.metadata.category === 'Image') {
      return (
        <div className="bg-white p-6 border rounded-lg max-h-96 overflow-y-auto">
          <img 
            src={document.content}
            alt={document.metadata.title}
            className="w-full max-w-md mx-auto rounded-lg"
          />
        </div>
      );
    } else {
      return (
        <div className="bg-white p-6 border rounded-lg max-h-96 overflow-y-auto">
          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              {document.content.includes('Multivariate analysis') ? (
                <>
                  Multivariate analysis revealed that{' '}
                  <span className="bg-orange-400 text-white px-1 rounded cursor-pointer hover:opacity-80" title="CONDITION">
                    septic shock
                  </span>
                  {' '}and{' '}
                  <span className="bg-orange-400 text-white px-1 rounded cursor-pointer hover:opacity-80" title="CONDITION">
                    bacteremia
                  </span>
                  {' '}originating from{' '}
                  <span className="bg-orange-400 text-white px-1 rounded cursor-pointer hover:opacity-80" title="CONDITION">
                    lower respiratory tract infection
                  </span>
                  {' '}were two independent{' '}
                  <span className="bg-blue-500 text-white px-1 rounded cursor-pointer hover:opacity-80" title="FACTOR">
                    risk factors
                  </span>
                  {' '}for{' '}
                  <span className="bg-green-500 text-white px-1 rounded cursor-pointer hover:opacity-80" title="EFFECT">
                    30-day mortality
                  </span>
                  .
                </>
              ) : (
                document.content
              )}
            </p>
          </div>
        </div>
      );
    }
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
                  {getContextBadge(document.metadata.category || 'Général')}
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
                  {renderDocumentContent()}
                </div>

                {/* Panneau d'annotation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Outils d'annotation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Types d'entités</h4>
                        <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter nouvelles entités
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {entityTypes.map((type) => (
                          <button 
                            key={type.name}
                            className={`p-2 ${type.color} rounded text-sm hover:opacity-80 transition-opacity`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Annotations détectées</h4>
                        <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50">
                          <Plus className="w-3 h-3 mr-1" />
                          Ajouter annotation
                        </Button>
                      </div>
                      {document.metadata.category !== 'Image' && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>"septic shock" → CONDITION</span>
                            <span className="text-green-600">✓ Validé</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>"bacteremia" → CONDITION</span>
                            <span className="text-yellow-600">⚠ À valider</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>"risk factors" → FACTOR</span>
                            <span className="text-green-600">✓ Validé</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-white rounded border">
                            <span>"30-day mortality" → EFFECT</span>
                            <span className="text-green-600">✓ Validé</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check className="w-3 h-3 mr-1" />
                        Valider les annotations
                      </Button>
                      <Button size="sm" variant="destructive">
                        <X className="w-3 h-3 mr-1" />
                        Refuser annotation
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
