import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportExportService } from '../../application/report-export.service';

@Controller('carbon-reports')
export class ReportExportController {
  constructor(private readonly exports: ReportExportService) {}

  @Get(':id/pdf')
  async exportPdf(@Param('id') id: string, @Res() res: Response) {
    const pdf = await this.exports.exportCarbonReportPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdf.length);
    res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`);
    res.send(pdf);
  }
}

