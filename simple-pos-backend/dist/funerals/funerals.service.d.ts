import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { Funeral } from './schemas/funeral.schema';
import { Model } from 'mongoose';
export declare class FuneralsService {
    private funeralModel;
    constructor(funeralModel: Model<Funeral>);
    create(data: CreateFuneralDto): Promise<Funeral>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Funeral, {}> & Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, {}, Funeral, {}> & Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: number, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: number): string;
}
