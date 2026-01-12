import { Module } from '@nestjs/common';
import { CarbonCalculatorService } from './application/carbon-calculator.service';
import { CARBON_REPORT_REPOSITORY } from './application/tokens';
import { CarbonReportController } from './adapters/http/carbon-report.controller';
import { FugitiveEmissionsStrategy } from './domain/strategies/fugitive-emissions.strategy';
import { MaterialLifecycleStrategy } from './domain/strategies/material-lifecycle.strategy';
import { PurchasedEnergyStrategy } from './domain/strategies/purchased-energy.strategy';
import { StationaryCombustionStrategy } from './domain/strategies/stationary-combustion.strategy';
import { TransportStrategy } from './domain/strategies/transport.strategy';
import { PrismaCarbonReportRepository } from './infrastructure/repositories/prisma-carbon-report.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarbonReportController],
  providers: [
    CarbonCalculatorService,
    {
      provide: CARBON_REPORT_REPOSITORY,
      useClass: PrismaCarbonReportRepository,
    },
    StationaryCombustionStrategy,
    PurchasedEnergyStrategy,
    FugitiveEmissionsStrategy,
    TransportStrategy,
    MaterialLifecycleStrategy,
  ],
  exports: [CarbonCalculatorService, CARBON_REPORT_REPOSITORY],
})
export class CarbonCalculatorModule {}
