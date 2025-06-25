
import { Document, User, AuditEntry } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Marie Dubois', email: 'marie@company.com', role: 'metadonneur' },
  { id: '2', name: 'Jean Martin', email: 'jean@company.com', role: 'annotateur' },
  { id: '3', name: 'Dr. Sophie Lambert', email: 'sophie@company.com', role: 'expert' }
];

export const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    filename: 'guideline_france.pdf',
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'metadata_validated',
    content: 'Multivariate analysis revealed that septic shock and bacteremia originating from lower respiratory tract infection were two independent risk factors for 30-day mortality.',
    metadata: {
      title: 'Guideline France',
      author: 'Service médical',
      category: 'Guideline',
      tags: ['pharmaceutique', 'guideline', 'médical'],
      extractionConfidence: 0.92,
      validatedBy: 'Marie Dubois',
      validatedAt: '2024-01-15T14:20:00Z',
      extractedAt: '2024-01-15T10:35:00Z'
    },
    annotations: [
      {
        id: 'ann-001',
        text: 'septic shock',
        start: 50,
        end: 62,
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
        details: 'Fichier guideline_france.pdf uploadé'
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
    content: 'Rapport technique Q1 2024 - Performance des services informatiques. Notre équipe technique a analysé les performances des différents services déployés au premier trimestre. Les services web ont montré une amélioration de 15% en termes de temps de réponse. Les bases de données ont été optimisées pour supporter une charge accrue. Les serveurs cloud ont été mis à jour avec les dernières technologies. L\'infrastructure réseau a été renforcée pour améliorer la sécurité et la disponibilité des services.',
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
        text: 'services informatiques',
        start: 45,
        end: 67,
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
  },
  {
    id: 'doc-003',
    filename: 'pcr_image_resultat_30279.png',
    uploadDate: '2024-01-17T14:20:00Z',
    status: 'metadata_validated',
    content: '/lovable-uploads/38bd1e00-3e4b-4f94-9871-4d368d6f3833.png',
    metadata: {
      title: 'PCR Image resultat 30279',
      author: 'Laboratoire biologie',
      category: 'Image',
      tags: ['biologie', 'PCR', 'analyse'],
      extractionConfidence: 0.89,
      validatedBy: 'Marie Dubois',
      validatedAt: '2024-01-17T15:10:00Z',
      extractedAt: '2024-01-17T14:25:00Z'
    },
    annotations: [],
    auditTrail: [
      {
        id: 'audit-005',
        action: 'Document uploadé',
        userId: 'system',
        userName: 'Système',
        timestamp: '2024-01-17T14:20:00Z',
        details: 'Fichier pcr_image_resultat_30279.png uploadé'
      },
      {
        id: 'audit-006',
        action: 'Métadonnées extraites',
        userId: 'system',
        userName: 'IA Extraction',
        timestamp: '2024-01-17T14:25:00Z',
        details: 'Extraction automatique des métadonnées (confiance: 89%)'
      },
      {
        id: 'audit-007',
        action: 'Métadonnées validées',
        userId: '1',
        userName: 'Marie Dubois',
        timestamp: '2024-01-17T15:10:00Z',
        details: 'Validation des métadonnées par le métadonneur'
      }
    ]
  }
];
