import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { Funeral } from './schemas/funeral.schema';
import { Model } from 'mongoose';
export declare class FuneralsService {
    private funeralModel;
    constructor(funeralModel: Model<Funeral>);
    create(data: CreateFuneralDto): Promise<Funeral>;
    findAll(): Response;
    findOne(id: number): string;
    update(id: number, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: number): string;
}
