import { Test, TestingModule } from '@nestjs/testing';
import { FuneralsController } from './funerals.controller';
import { FuneralsService } from './funerals.service';

describe('FuneralsController', () => {
  let controller: FuneralsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuneralsController],
      providers: [FuneralsService],
    }).compile();

    controller = module.get<FuneralsController>(FuneralsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
