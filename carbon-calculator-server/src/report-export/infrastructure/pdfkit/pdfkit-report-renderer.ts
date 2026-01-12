import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { CarbonReport } from '../../../carbon-calculator/domain/models/carbon-report.model';
import type { PdfReportRenderer } from '../../domain/ports/pdf-report-renderer.port';

@Injectable()
export class PdfKitReportRenderer implements PdfReportRenderer {
  render(report: CarbonReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 48 });
        const chunks: Buffer[] = [];

        doc.on('data', (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(d)));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc
          .fontSize(18)
          .text('Carbon Report', { align: 'left' })
          .moveDown(0.5);

        doc.fontSize(10).fillColor('gray');
        doc.text(`Report ID: ${report.id}`);
        doc.text(`Created at: ${report.createdAt}`);
        doc.moveDown();

        doc.fillColor('black').fontSize(14).text('Totals').moveDown(0.5);
        doc.fontSize(11);
        doc.text(`Total: ${fmt(report.totals.totalKgCO2e)} kgCO2e`);
        doc.text(`Scope 1: ${fmt(report.totals.scope1.totalKgCO2e)} kgCO2e`);
        doc.text(`- Stationary combustion: ${fmt(report.totals.scope1.stationaryCombustionKgCO2e)} kgCO2e`);
        doc.text(`- Refrigerants: ${fmt(report.totals.scope1.refrigerantsKgCO2e)} kgCO2e`);
        doc.text(`Scope 2: ${fmt(report.totals.scope2.totalKgCO2e)} kgCO2e`);
        doc.text(`Scope 3: ${fmt(report.totals.scope3.totalKgCO2e)} kgCO2e`);
        doc.text(`- Category 1: ${fmt(report.totals.scope3.category1KgCO2e)} kgCO2e`);
        doc.text(`- Category 5: ${fmt(report.totals.scope3.category5KgCO2e)} kgCO2e`);
        doc.text(`- Category 6: ${fmt(report.totals.scope3.category6KgCO2e)} kgCO2e`);
        doc.moveDown();

        doc.fontSize(14).text('Input (raw JSON)').moveDown(0.5);
        doc.fontSize(9).fillColor('black');
        doc.text(JSON.stringify(report.input, null, 2), {
          width: 500,
        });

        doc.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '0';
  return Math.round(n * 100) / 100 + '';
}

