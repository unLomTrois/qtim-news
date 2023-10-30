import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiOperation({ deprecated: true })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ deprecated: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  @ApiOperation({ deprecated: true })
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneBy({ id });
  }

  @Get('email/:email')
  @ApiOperation({ deprecated: true })
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneBy({ email });
  }

  @Patch(':id')
  @ApiOperation({ deprecated: true })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ deprecated: true })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
