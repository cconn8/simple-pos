import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { Funeral } from './schemas/funeral.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FuneralsService {
  constructor(@InjectModel(Funeral.name) private funeralModel: Model<Funeral>) {}


  async create(data: CreateFuneralDto) : Promise<Funeral> {
    const funeral = await this.funeralModel.create({formData : data})
    console.log("Saved funeral : ", funeral)
    return funeral
  }

  findAll() {
    return Response.json({ success: true, message: `This action returns all funerals`});
  }

  async findOneById(id: string) {
    const funeral = await this.funeralModel.findById(id).exec();
    if (!funeral) {
      throw new NotFoundException(`Funeral with id ${id} not found`);
    }
    return funeral;
  }

  update(id: number, updateFuneralDto: UpdateFuneralDto) {
    return `This action updates a #${id} funeral`;
  }

  remove(id: number) {
    return `This action removes a #${id} funeral`;
  }
}
