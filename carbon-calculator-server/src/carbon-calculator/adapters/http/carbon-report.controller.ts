import { Body, Controller, Post } from '@nestjs/common';
import { CarbonCalculatorService } from '../../application/carbon-calculator.service';
import { CreateCarbonReportDto } from './create-carbon-report.dto';

@Controller('carbon-reports')
export class CarbonReportController {
  constructor(private readonly carbonCalculator: CarbonCalculatorService) {}

  @Post()
  create(@Body() dto: CreateCarbonReportDto) {
    return this.carbonCalculator.createReport(dto);
  }
}
