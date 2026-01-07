import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('funerals')
export class FuneralsController {
  constructor(
    private readonly funeralsService: FuneralsService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post()
  async create(@Body() createFuneralDto: CreateFuneralDto) {
    console.log('Data received on the server is: ', createFuneralDto);
    const funeral = await this.funeralsService.create(createFuneralDto);
    return { id: funeral._id, message: 'Funeral created successfully!' };
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
    return this.funeralsService.findByIdAndUpdate(id, updateFuneralDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body() body: { invoiceUrl: string }) {
    const { invoiceUrl } = body;
    console.log('DELETE request received for id & url : ', id, invoiceUrl);
    if (invoiceUrl) {
      await this.invoiceService.deleteFileGCS(invoiceUrl);
      console.log('invoice deleted');
    }

    return this.funeralsService.deleteById(id);
  }
}
