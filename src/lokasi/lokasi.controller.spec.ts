import { Test, TestingModule } from '@nestjs/testing';
import { LokasiController } from './lokasi.controller';

describe('LokasiController', () => {
  let controller: LokasiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LokasiController],
    }).compile();

    controller = module.get<LokasiController>(LokasiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
