import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
export declare class FuneralsService {
    create(createFuneralDto: CreateFuneralDto): Response;
    findAll(): Response;
    findOne(id: number): string;
    update(id: number, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: number): string;
}
