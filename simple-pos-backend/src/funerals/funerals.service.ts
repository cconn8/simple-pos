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

  async findAll() {
    const funerals = await this.funeralModel
      .find()
      .sort({ createdAt: -1 }) // newest first
      .exec();

    if (!funerals || funerals.length === 0) {
      throw new NotFoundException(`No funerals found!`);
    }

    return funerals;
  }

  async findOneById(id: string) {
    console.log('funerals service findOneById called')
    const funeral = await this.funeralModel.findById(id).exec();
    if (!funeral) throw new NotFoundException(`Funeral with id ${id} not found`);
    return funeral;
  }

  async findByIdAndUpdate(id: string, updateFuneralDto: UpdateFuneralDto) : Promise<any>{
    console.log('funerals service updateFuneralById called')
    return this.funeralModel.findByIdAndUpdate(id, updateFuneralDto, { new: true });
  }

  async deleteById(id: number) {
    return this.funeralModel.findByIdAndDelete(id);
  }
}
