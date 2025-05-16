import { Injectable } from '@nestjs/common';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';

@Injectable()
export class FuneralsService {
  create(createFuneralDto: CreateFuneralDto) {
    console.log('Server here! Your funeral object was received : ', createFuneralDto)
    return Response.json({ success: true, message: "Funeral Service Added Successfully" });
  }

  findAll() {
    return Response.json({ success: true, message: `This action returns all funerals`});
  }

  findOne(id: number) {
    return `This action returns a #${id} funeral`;
  }

  update(id: number, updateFuneralDto: UpdateFuneralDto) {
    return `This action updates a #${id} funeral`;
  }

  remove(id: number) {
    return `This action removes a #${id} funeral`;
  }
}
