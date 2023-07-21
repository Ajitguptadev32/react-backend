import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.schema';
import { UserUpdateDto } from './userUpdate.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createuser')
  @UseInterceptors(FilesInterceptor('file'))
  async createUser(
    @Body() userDto: User,
    @UploadedFiles() file: Express.Multer.File,
  ) {
    return this.appService.createUser(userDto, file);
  }
  @Post('login')
  async login(@Body() userDto: User) {
    return this.appService.login(userDto.email, userDto.password);
  }
  @Get()
  readUser() {
    return this.appService.readUser();
  }
  @Get('profile') // Route to get a single user by ID
  async getUserById(@Param('id') id: string) {
    return this.appService.getUserById(id);
  }
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UserUpdateDto,
  ): Promise<User> {
    return this.appService.updateUser(id, updateData);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(id);
  }

  async uploadImage(@UploadedFile() file: Express.Multer.File) {}
}
