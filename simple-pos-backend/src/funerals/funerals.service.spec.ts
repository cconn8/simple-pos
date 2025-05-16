import { Test, TestingModule } from '@nestjs/testing';
import { FuneralsService } from './funerals.service';

describe('FuneralsService', () => {
  let service: FuneralsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuneralsService],
    }).compile();

    service = module.get<FuneralsService>(FuneralsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
