import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AnalysisResult } from './api';

export interface PDFOptions {
  title?: string;
  documentTitle?: string;
  includeRawText?: boolean;
  fontSize?: number;
  lineHeight?: number;
}

export class PDFGenerator {
  private static async captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
    return await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
  }

  private static async addPageToPDF(pdf: jsPDF, canvas: HTMLCanvasElement, yOffset: number = 0): Promise<number> {
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = yOffset;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return heightLeft < 0 ? Math.abs(heightLeft) : 0;
  }

  static async generateAnalysisPDF(
    analysisResult: AnalysisResult,
    options: PDFOptions = {}
  ): Promise<Blob> {
    const {
      title = 'Policy Analysis Report',
      documentTitle = 'Document Analysis',
      includeRawText = false,
      fontSize = 12,
      lineHeight = 1.5
    } = options;

    // Create a temporary container for the PDF content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = `${fontSize}px`;
    container.style.lineHeight = `${lineHeight}`;
    container.style.color = '#333333';

    // Add content to container
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #2563eb; font-size: 28px; margin-bottom: 10px;">${title}</h1>
        <p style="color: #6b7280; font-size: 16px;">Generated on ${new Date().toLocaleDateString()}</p>
        ${documentTitle ? `<p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Document: ${documentTitle}</p>` : ''}
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
          📋 Executive Summary
        </h2>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; line-height: 1.6;">${analysisResult.summary}</p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
          ✅ Eligibility Requirements
        </h2>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
          ${analysisResult.checklist.length > 0 ? 
            analysisResult.checklist.map((item, index) => `
              <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                <span style="color: #16a34a; font-weight: bold; margin-right: 10px; font-size: 16px;">✓</span>
                <span style="flex: 1;">${item}</span>
              </div>
            `).join('') : 
            '<p style="margin: 0; color: #6b7280;">No specific eligibility requirements found in this document.</p>'
          }
        </div>
      </div>

      ${analysisResult.metadata ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            📊 Analysis Statistics
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div>
                <strong>Text Length:</strong> ${analysisResult.metadata.textLength.toLocaleString()} characters
              </div>
              <div>
                <strong>Summary Length:</strong> ${analysisResult.metadata.summaryLength.toLocaleString()} characters
              </div>
              <div>
                <strong>Requirements Found:</strong> ${analysisResult.metadata.checklistCount} items
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      ${includeRawText && analysisResult.rawText ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            📄 Original Document Text
          </h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 11px; line-height: 1.4; max-height: 400px; overflow-y: auto;">
            <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${analysisResult.rawText}</pre>
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Generated by GovAid-AI - Making government policies accessible to everyone</p>
        <p>Visit our platform for interactive analysis and Q&A features</p>
      </div>
    `;

    // Add container to DOM temporarily
    document.body.appendChild(container);

    try {
      // Capture the container as canvas
      const canvas = await this.captureElement(container);
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add content to PDF
      await this.addPageToPDF(pdf, canvas);
      
      // Generate blob
      const blob = pdf.output('blob');
      
      return blob;
    } finally {
      // Clean up
      document.body.removeChild(container);
    }
  }

  static downloadPDF(blob: Blob, filename: string = 'policy-analysis.pdf'): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 