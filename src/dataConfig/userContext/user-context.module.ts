import { Module } from '@nestjs/common';
import { UserContextService } from './user-context.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  providers: [UserContextService],
  exports: [UserContextService],
})
export class UserContextModule {}
