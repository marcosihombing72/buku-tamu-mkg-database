import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PengunjungModule } from './pengunjung/pengunjung.module';

@Module({
  imports: [AdminModule, PengunjungModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
