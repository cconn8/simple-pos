import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): string;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}> & import("./schemas/inventory.schema").Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
