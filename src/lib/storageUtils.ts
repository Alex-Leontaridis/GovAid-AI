import { v4 as uuidv4 } from 'uuid';
import { SavedAnalysis, AnalysisResult } from './api';

const STORAGE_KEY = 'govaid_analyses';
const SHARE_STORAGE_KEY = 'govaid_shared_analyses';

export class AnalysisStorage {
  private static getStoredAnalyses(): SavedAnalysis[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored analyses:', error);
      return [];
    }
  }

  private static setStoredAnalyses(analyses: SavedAnalysis[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
    } catch (error) {
      console.error('Error saving analyses:', error);
    }
  }

  private static getSharedAnalyses(): Record<string, SavedAnalysis> {
    try {
      const stored = localStorage.getItem(SHARE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading shared analyses:', error);
      return {};
    }
  }

  private static setSharedAnalyses(shared: Record<string, SavedAnalysis>): void {
    try {
      localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shared));
    } catch (error) {
      console.error('Error saving shared analyses:', error);
    }
  }

  static saveAnalysis(
    analysisResult: AnalysisResult,
    documentTitle: string,
    documentUrl?: string,
    documentFile?: string
  ): SavedAnalysis {
    const analyses = this.getStoredAnalyses();
    
    const newAnalysis: SavedAnalysis = {
      id: uuidv4(),
      title: documentTitle || 'Untitled Analysis',
      documentTitle,
      documentUrl,
      documentFile,
      analysisResult,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    analyses.unshift(newAnalysis); // Add to beginning
    
    // Keep only last 50 analyses
    if (analyses.length > 50) {
      analyses.splice(50);
    }

    this.setStoredAnalyses(analyses);
    return newAnalysis;
  }

  static getAllAnalyses(): SavedAnalysis[] {
    return this.getStoredAnalyses();
  }

  static getAnalysisById(id: string): SavedAnalysis | null {
    const analyses = this.getStoredAnalyses();
    return analyses.find(analysis => analysis.id === id) || null;
  }

  static deleteAnalysis(id: string): boolean {
    const analyses = this.getStoredAnalyses();
    const initialLength = analyses.length;
    const filtered = analyses.filter(analysis => analysis.id !== id);
    
    if (filtered.length !== initialLength) {
      this.setStoredAnalyses(filtered);
      return true;
    }
    return false;
  }

  static updateAnalysis(id: string, updates: Partial<SavedAnalysis>): SavedAnalysis | null {
    const analyses = this.getStoredAnalyses();
    const index = analyses.findIndex(analysis => analysis.id === id);
    
    if (index !== -1) {
      analyses[index] = {
        ...analyses[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.setStoredAnalyses(analyses);
      return analyses[index];
    }
    return null;
  }

  static createShareableLink(analysisId: string): string | null {
    const analysis = this.getAnalysisById(analysisId);
    if (!analysis) return null;

    const shareId = uuidv4();
    const sharedAnalyses = this.getSharedAnalyses();
    
    sharedAnalyses[shareId] = {
      ...analysis,
      shareId,
    };

    this.setSharedAnalyses(sharedAnalyses);
    
    // Update the original analysis with shareId
    this.updateAnalysis(analysisId, { shareId });
    
    return shareId;
  }

  static getSharedAnalysis(shareId: string): SavedAnalysis | null {
    const sharedAnalyses = this.getSharedAnalyses();
    return sharedAnalyses[shareId] || null;
  }

  static deleteSharedAnalysis(shareId: string): boolean {
    const sharedAnalyses = this.getSharedAnalyses();
    if (sharedAnalyses[shareId]) {
      delete sharedAnalyses[shareId];
      this.setSharedAnalyses(sharedAnalyses);
      return true;
    }
    return false;
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SHARE_STORAGE_KEY);
  }

  static getStorageStats(): {
    totalAnalyses: number;
    totalShared: number;
    storageUsed: number;
  } {
    const analyses = this.getStoredAnalyses();
    const shared = this.getSharedAnalyses();
    
    let storageUsed = 0;
    try {
      storageUsed = new Blob([JSON.stringify(analyses)]).size + 
                   new Blob([JSON.stringify(shared)]).size;
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }

    return {
      totalAnalyses: analyses.length,
      totalShared: Object.keys(shared).length,
      storageUsed,
    };
  }
} 