import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtModule } from '@nestjs/jwt';
//import { PassportModule } from '@nestjs/passport'; // Import PassportModule
import { createCipheriv, randomBytes, scrypt } from 'crypto';
const iv = randomBytes(16);
const password = 'Password used to generate key';
const textToEncrypt = 'Nest';

import { promisify } from 'util';

import * as bcrypt from 'bcrypt';
@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}
  //login
  // Login
  async login(email, pass) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      Token: await this.jwtService.signAsync(payload),
    };
  }

  // creating a user
  async createUser(user: User): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
    const newUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });
    return newUser.save();
  }

  // get users
  async readUser() {
    return this.userModel
      .find({})
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }

  //update data
  async updateUser(id, data): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id) {
    return this.userModel.findByIdAndDelete(id);
  }
  // Get user by ID
  async getUserById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }
}
