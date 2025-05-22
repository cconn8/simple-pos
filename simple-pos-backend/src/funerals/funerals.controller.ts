import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';

@Controller('funerals')
export class FuneralsController {
  constructor(private readonly funeralsService: FuneralsService) {}

  @Post()
  async create(@Body() createFuneralDto: CreateFuneralDto) {
    const funeral = await this.funeralsService.create(createFuneralDto);
    return { id: funeral._id, message: 'Funeral created successfully!'}
  }

  @Get()
  findAll() {
    return this.funeralsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funeralsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuneralDto: UpdateFuneralDto) {
    return this.funeralsService.update(+id, updateFuneralDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funeralsService.remove(+id);
  }
}
