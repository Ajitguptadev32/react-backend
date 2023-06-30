import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user.schema';
import { UserUpdateDto } from './userUpdate.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUser(@Body() userDto: User) {
    return this.appService.createUser(userDto);
  }
  @Post('login')
  async login(@Body() userDto: Record<string, any>) {
    return this.appService.login(userDto.email, userDto.password);
  }
  @Get()
  readUser() {
    return this.appService.readUser();
  }
  @Get(':id') // Route to get a single user by ID
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
}
