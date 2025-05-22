import { FuneralsService } from './funerals.service';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
export declare class FuneralsController {
    private readonly funeralsService;
    constructor(funeralsService: FuneralsService);
    create(createFuneralDto: CreateFuneralDto): Promise<{
        id: unknown;
        message: string;
    }>;
    findAll(): Response;
    findOne(id: string): string;
    update(id: string, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: string): string;
}
