import { Module } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Module({
  providers: [GoogleAuthService],
  exports: [GoogleAuthService], // ✅ Needed to make it available to other modules
})
export class GoogleModule {}
