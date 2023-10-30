import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtGuard } from 'src/auth/guards/JwtGuard';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(
    @Body() createNewsDto: CreateNewsDto,
    @Req() request: Request & { user: User },
  ) {
    const { user } = request;
    return this.newsService.create(user, createNewsDto);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOneBy({ id });
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @Req() request: Request & { user: User },
  ) {
    // todo: чекнуть на авторство
    const { user } = request;

    return this.newsService.update(id, updateNewsDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() request: Request & { user: User }) {
    const { user } = request;

    return this.newsService.remove(id, user);
  }
}
