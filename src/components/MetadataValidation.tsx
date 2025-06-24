
import React, { useState } from 'react';
import { Document } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { RefreshCw, Eye, Save, Calendar, Clock, User, FileText } from 'lucide-react';

interface MetadataValidationProps {
  documents: Document[];
  currentUser: any;
}

const MetadataValidation: React.FC<MetadataValidationProps> = ({ documents, currentUser }) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [formData, setFormData] = useState<any>({});

  const metadataFields = [
    { key: 'title', label: 'Titre du document', confidence: 98, autoExtracted: true },
    { key: 'documentType', label: 'Type de document', confidence: 70, autoExtracted: false },
    { key: 'documentContext', label: 'Contexte du document', confidence: 85, autoExtracted: false },
    { key: 'language', label: 'Langue', confidence: 90, autoExtracted: false },
    { key: 'publicationDate', label: 'Date de publication', confidence: 100, autoExtracted: true },
    { key: 'source', label: 'Source', confidence: 95, autoExtracted: true },
    { key: 'version', label: 'Version', confidence: 0, autoExtracted: false },
    { key: 'sourceUrl', label: 'URL source', confidence: 85, autoExtracted: true }
  ];

  const extractedFields = [
    { label: 'Title', value: 'Registration guide for UI and...', color: 'bg-blue-500' },
    { label: 'Date', value: '06/05/2025', color: 'bg-green-500' },
    { label: 'Language', value: 'EN', color: 'bg-cyan-500' },
    { label: 'Country', value: 'EU', color: 'bg-purple-500' },
    { label: 'Source', value: 'EMA', color: 'bg-orange-500' },
    { label: 'Version', value: '', color: 'bg-gray-500' }
  ];

  const docsToValidate = documents.filter(doc => 
    doc.status === 'metadata_extracted' || doc.status === 'metadata_validated'
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setFormData({
      title: 'Registration guide for UI and API users',
      documentType: 'Guideline',
      documentContext: 'Réglementation pharmaceutique',
      language: 'Anglais',
      publicationDate: '06/05/2025',
      source: 'EMA',
      version: '',
      sourceUrl: 'https://www.ema.europa.eu/en/documents/ot'
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('uploadé')) return 'bg-blue-100 text-blue-800';
    if (action.includes('extraites') || action.includes('Extraction')) return 'bg-yellow-100 text-yellow-800';
    if (action.includes('validées') || action.includes('Validation')) return 'bg-green-100 text-green-800';
    if (action.includes('corrigées') || action.includes('Correction')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {!selectedDoc ? (
        <Card>
          <CardHeader>
            <CardTitle>Documents nécessitant une validation des métadonnées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {docsToValidate.map((doc) => (
                <div 
                  key={doc.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectDocument(doc)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{doc.filename}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Extrait le {new Date(doc.metadata.extractedAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <Badge variant={doc.status === 'metadata_validated' ? 'default' : 'secondary'}>
                      Confiance: {Math.round(doc.metadata.extractionConfidence * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <CardTitle>Métadonnées du Document</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Réextraire
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir le document
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Métadonnées
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Titre du document
                      <Badge className="ml-2 bg-green-100 text-green-800">Auto-extrait</Badge>
                    </label>
                    <Input 
                      value={formData.title || ''} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      Extrait automatiquement: Registration guide for UI and API users
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Type de document
                        <Badge className="ml-2 bg-green-100 text-green-800">Auto-détecté</Badge>
                      </label>
                      <Select value={formData.documentType} onValueChange={(value) => setFormData({...formData, documentType: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Guideline">Guideline</SelectItem>
                          <SelectItem value="Rapport">Rapport</SelectItem>
                          <SelectItem value="Contrat">Contrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contexte du document
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800">Auto-détecté</Badge>
                      </label>
                      <Select value={formData.documentContext} onValueChange={(value) => setFormData({...formData, documentContext: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Réglementation pharmaceutique">Réglementation pharmaceutique</SelectItem>
                          <SelectItem value="Contrat commercial">Contrat commercial</SelectItem>
                          <SelectItem value="Documentation technique">Documentation technique</SelectItem>
                          <SelectItem value="Rapport d'étude">Rapport d'étude</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Langue
                        <Badge className="ml-2 bg-green-100 text-green-800">Auto-détecté</Badge>
                      </label>
                      <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Anglais">Anglais</SelectItem>
                          <SelectItem value="Français">Français</SelectItem>
                          <SelectItem value="Espagnol">Espagnol</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Détecté automatiquement: en
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date de publication
                        <Badge className="ml-2 bg-green-100 text-green-800">Auto-extrait</Badge>
                      </label>
                      <div className="relative">
                        <Input 
                          value={formData.publicationDate || ''} 
                          onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
                        />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Extrait automatiquement: 2025-05-06
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Version</label>
                      <Input 
                        value={formData.version || ''} 
                        onChange={(e) => setFormData({...formData, version: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Source
                        <Badge className="ml-2 bg-green-100 text-green-800">Auto-extrait</Badge>
                      </label>
                      <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMA">EMA</SelectItem>
                          <SelectItem value="FDA">FDA</SelectItem>
                          <SelectItem value="Other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                        Extrait automatiquement: EMA
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL source</label>
                    <Input 
                      value={formData.sourceUrl || ''} 
                      onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button onClick={() => setSelectedDoc(null)} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retour
                  </Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Audit Trail & Traçabilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDoc.auditTrail.map((entry) => (
                    <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getActionColor(entry.action)}>
                              {entry.action}
                            </Badge>
                            <span className="text-sm font-medium">Version V{entry.id.split('-')[1] || '0'}</span>
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Qualité d'Extraction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Taux d'extraction:</span>
                    <span className="text-2xl font-bold">83%</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Champs extraits automatiquement:</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedFields.map((field, index) => (
                      <Badge key={index} className={`${field.color} text-white`}>
                        {field.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Scores de confiance:</p>
                  <div className="space-y-2 text-sm">
                    {metadataFields.map((field) => (
                      <div key={field.key} className="flex justify-between">
                        <span>{field.label}:</span>
                        <span className={getConfidenceColor(field.confidence)}>
                          {field.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Extraction Automatique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Titre:</span>
                    <span>Registration guide for UI and...</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>06/05/2025</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Langue:</span>
                    <span>EN</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetadataValidation;
