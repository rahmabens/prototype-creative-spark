
export interface Document {
  id: string;
  filename: string;
  uploadDate: string;
  status: 'uploaded' | 'metadata_extracted' | 'metadata_validated' | 'annotated' | 'expert_validated' | 'completed';
  content: string;
  metadata: DocumentMetadata;
  annotations: Annotation[];
  auditTrail: AuditEntry[];
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  category?: string;
  tags?: string[];
  extractionConfidence: number;
  validatedBy?: string;
  validatedAt?: string;
  extractedAt: string;
}

export interface Annotation {
  id: string;
  text: string;
  start: number;
  end: number;
  type: 'entity' | 'concept' | 'relation';
  confidence: number;
  aiGenerated: boolean;
  validatedBy?: string;
  validatedAt?: string;
  correctedBy?: string;
  correctedAt?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
  previousValue?: any;
  newValue?: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'metadonneur' | 'annotateur' | 'expert';
}

export type UserRole = 'metadonneur' | 'annotateur' | 'expert';
