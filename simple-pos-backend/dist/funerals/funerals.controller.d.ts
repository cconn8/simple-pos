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
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/funeral.schema").Funeral, {}> & import("./schemas/funeral.schema").Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/funeral.schema").Funeral, {}> & import("./schemas/funeral.schema").Funeral & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, updateFuneralDto: UpdateFuneralDto): string;
    remove(id: string): string;
}
