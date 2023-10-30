import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepo: Repository<News>,
  ) {}

  create(user: User, createNewsDto: CreateNewsDto) {
    const newNews = this.newsRepo.create(createNewsDto);

    newNews.author = user;

    return this.newsRepo.save(newNews);
  }

  findAll() {
    return this.newsRepo.find({ relations: { author: true } });
  }

  findOneBy(where: FindOptionsWhere<News>) {
    return this.newsRepo.findOne({ where, relations: { author: true } });
  }

  async update(newsId: string, updateNewsDto: UpdateNewsDto, user: User) {
    const news = await this.findOneBy({ id: newsId });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    if (!news.author || news.author.id !== user.id) {
      throw new ForbiddenException('Вы не имеете доступа к изменению новости');
    }

    return this.newsRepo.update(newsId, updateNewsDto);
  }

  async remove(newsId: string, user: User) {
    const news = await this.findOneBy({ id: newsId });

    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    if (!news.author || news.author.id !== user.id) {
      throw new ForbiddenException('Вы не имеете доступа к изменению новости');
    }

    return this.newsRepo.delete(newsId);
  }
}
