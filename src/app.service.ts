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
    const payload = { sub: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return { email: user.email, token };
  }

  // creating a user
  async createUser(user: User, files: Express.Multer.File): Promise<User> {
    const saltOrRounds = 10;

    if (!user.password) {
      throw new Error('Password is required.'); // Or handle the missing password case accordingly
    }

    try {
      const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);
      console.log('hashedPassword', hashedPassword);
      user.password = hashedPassword;

      // Rest of your code...

      const newUser = new this.userModel({
        ...user,
      });

      console.log('newUser', newUser);
      return newUser.save();
    } catch (err) {
      // Handle any errors that may occur during hashing
      throw new Error('Error creating user: ' + err.message);
    }
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
