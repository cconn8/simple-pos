import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';

@Controller('funerals')
export class FuneralsController {
  constructor(private readonly funeralsService: FuneralsService) {}

  @Post()
  create(@Body() createFuneralDto: CreateFuneralDto) {
    console.log('Server here! - Post Funerals api hit! Calling funeral service!')
    return this.funeralsService.create(createFuneralDto);
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
