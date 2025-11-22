import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // 1️⃣ Crear libro
  @UseGuards(JwtAuthGuard)
  @Post()
  createBook(@Body() dto: { title: string; content: string }, @User() user) {
    console.log('Creando un libro nuevo para el usuario:', user);
    return this.booksService.createBook({
      title: dto.title,
      createdBy: user.userId, // o user.id, depende de tu JWT
      content: dto.content,
    });
  }

  @Get()
  obtainBooks() {
    console.log('Obteniendo todos los libros del microservicio');
    return this.booksService.getAllBooks();
  }

  // 3️⃣ Obtener metadata del libro
  @Get(':id')
  getBook(@Param('id') id: string) {
    console.log('Obteniendo metadata del libro ID:', id);
    return this.booksService.getBook(id);
  }

  // 4️⃣ Obtener solo el contenido del libro
  @Get(':id/content')
  getBookContent(@Param('id') id: string) {
    console.log('Obteniendo contenido del libro ID:', id);
    return this.booksService.getContent(id);
  }

  // 5️⃣ Obtener metadata + contenido
  @Get(':id/full')
  getFull(@Param('id') id: string) {
    console.log('Obteniendo libro completo (metadata + contenido) ID:', id);
    return this.booksService.getFullBook(id);
  }

  // 6️⃣ Actualizar contenido — solo el creador puede modificarlo
  @Patch(':id/content')
  async updateContent(
    @Param('id') bookId: string,
    @Body() dto: UpdateContentDto,
    @User() user: any,
  ) {
    console.log('Actualizando contenido del libro ID:', bookId);
    // 1. Obtener metadatos del libro
    const book = await this.booksService.getBook(bookId);

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // 2. Seguridad: solo el creador puede modificarlo
    if (book.createdBy !== user.sub) {
      throw new ForbiddenException(
        'You do not have permission to edit this book',
      );
    }

    // 3. Actualizar contenido
    return this.booksService.updateContent({
      bookId,
      body: dto.body,
    });
  }
}
