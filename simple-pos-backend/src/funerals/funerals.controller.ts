import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';

@Controller('funerals')
export class FuneralsController {
  constructor(private readonly funeralsService: FuneralsService) {}

  @Post()
  async create(@Body() createFuneralDto: CreateFuneralDto) {
    console.log('Data received on the server is: ', createFuneralDto);
    const funeral = await this.funeralsService.create(createFuneralDto);
    return { id: funeral._id, message: 'Funeral created successfully!'}
  }

  @Get()
  findAll() {
    return this.funeralsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.funeralsService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFuneralDto: UpdateFuneralDto) {
    // return this.funeralsService.update(+id, updateFuneralDto);
    return 'funeral update controller called'
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funeralsService.remove(+id);
  }
}
