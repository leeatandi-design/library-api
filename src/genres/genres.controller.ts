import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@ApiTags('genres')
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new genre' })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres with their books' })
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single genre by ID' })
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genresService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre by ID' })
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
