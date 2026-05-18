import { Evidence, EvidenceStatus } from '../types';

export const verifyEvidence = (evidence: Evidence): Evidence => {
  return { ...evidence, status: EvidenceStatus.VERIFIED };
};

export const certifyEvidence = (evidence: Evidence): Evidence => {
  return { ...evidence, status: EvidenceStatus.CERTIFIED, hasBSACertificate: true };
};

export const checkContradictions = (selectedEvidence: Evidence, inventory: Evidence[]): string[] => {
  if (!selectedEvidence.contradicts) return [];
  
  return selectedEvidence.contradicts.filter(id => 
    inventory.some(e => e.id === id)
  );
};

export const isEvidenceAdmissible = (evidence: Evidence): boolean => {
  if (evidence.type === 'DIGITAL') {
    return evidence.hasBSACertificate;
  }
  return evidence.status !== 'UNVERIFIED';
};
