
import { Document, User, AuditEntry } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Marie Dubois', email: 'marie@company.com', role: 'metadonneur' },
  { id: '2', name: 'Jean Martin', email: 'jean@company.com', role: 'annotateur' },
  { id: '3', name: 'Dr. Sophie Lambert', email: 'sophie@company.com', role: 'expert' }
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    filename: 'contrat_service_2024.pdf',
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'metadata_validated',
    content: 'Contrat de prestation de services informatiques entre la société Alpha et la société Beta. Article 1: Objet du contrat. Le présent contrat a pour objet la fourniture de services de développement logiciel...',
    metadata: {
      title: 'Contrat de prestation de services informatiques',
      author: 'Service juridique Alpha',
      category: 'Contrat commercial',
      tags: ['informatique', 'prestation', 'développement'],
      extractionConfidence: 0.92,
      validatedBy: 'Marie Dubois',
      validatedAt: '2024-01-15T14:20:00Z',
      extractedAt: '2024-01-15T10:35:00Z'
    },
    annotations: [
      {
        id: 'ann-001',
        text: 'services de développement logiciel',
        start: 180,
        end: 215,
        type: 'concept',
        confidence: 0.88,
        aiGenerated: true,
        validatedBy: 'Jean Martin',
        validatedAt: '2024-01-15T16:10:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'audit-001',
        action: 'Document uploadé',
        userId: 'system',
        userName: 'Système',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Fichier contrat_service_2024.pdf uploadé'
      },
      {
        id: 'audit-002',
        action: 'Métadonnées extraites',
        userId: 'system',
        userName: 'IA Extraction',
        timestamp: '2024-01-15T10:35:00Z',
        details: 'Extraction automatique des métadonnées (confiance: 92%)'
      },
      {
        id: 'audit-003',
        action: 'Métadonnées validées',
        userId: '1',
        userName: 'Marie Dubois',
        timestamp: '2024-01-15T14:20:00Z',
        details: 'Validation des métadonnées par le métadonneur'
      }
    ]
  },
  {
    id: 'doc-002',
    filename: 'rapport_technique_q1.docx',
    uploadDate: '2024-01-16T09:15:00Z',
    status: 'annotated',
    content: 'Rapport technique trimestriel Q1 2024. Synthèse des développements réalisés et des performances système...',
    metadata: {
      title: 'Rapport technique Q1 2024',
      author: 'Équipe technique',
      category: 'Rapport interne',
      tags: ['technique', 'performance', 'Q1'],
      extractionConfidence: 0.95,
      validatedBy: 'Marie Dubois',
      validatedAt: '2024-01-16T11:30:00Z',
      extractedAt: '2024-01-16T09:20:00Z'
    },
    annotations: [
      {
        id: 'ann-002',
        text: 'performances système',
        start: 120,
        end: 140,
        type: 'concept',
        confidence: 0.91,
        aiGenerated: true,
        correctedBy: 'Jean Martin',
        correctedAt: '2024-01-16T15:45:00Z'
      }
    ],
    auditTrail: [
      {
        id: 'audit-004',
        action: 'Document uploadé',
        userId: 'system',
        userName: 'Système',
        timestamp: '2024-01-16T09:15:00Z',
        details: 'Fichier rapport_technique_q1.docx uploadé'
      }
    ]
  }
];
