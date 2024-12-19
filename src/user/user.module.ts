import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserEntity } from './models/user.enetity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),AuthModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
