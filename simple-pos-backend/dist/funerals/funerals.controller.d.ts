import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
export declare class FuneralsController {
    private readonly funeralsService;
    constructor(funeralsService: FuneralsService);
    create(createFuneralDto: CreateFuneralDto): Response;
    findAll(): Response;
    findOne(id: string): string;
    update(id: string, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: string): string;
}
