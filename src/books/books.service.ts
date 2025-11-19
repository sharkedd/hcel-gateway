import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOKS_SERVICE') private readonly client: ClientProxy) {}

  async createBook(dto: { title: string; createdBy: string; content: string }) {
    return firstValueFrom(this.client.send({ cmd: 'create-book' }, dto));
  }

  async getAllBooks() {
    return firstValueFrom(this.client.send({ cmd: 'books-get-all' }, {}));
  }

  async getBook(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'books-get-by-id' }, id));
  }

  async getContent(bookId: string) {
    return firstValueFrom(this.client.send({ cmd: 'get-content' }, bookId));
  }

  async getFullBook(id: string) {
    return firstValueFrom(this.client.send({ cmd: 'get-full-book' }, id));
  }

  async updateContent(dto: { bookId: string; body: string }) {
    return firstValueFrom(this.client.send({ cmd: 'update-content' }, dto));
  }
}
