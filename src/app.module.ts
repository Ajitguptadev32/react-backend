import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { jwtConstants } from './token';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
//import { PassportModule } from '@nestjs/passport'; // Import PassportModule

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/mydatabase'),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
