import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
export declare class InventoryService {
    private inventoryModel;
    constructor(inventoryModel: Model<Inventory>);
    create(data: CreateInventoryDto): Promise<import("mongoose").Document<unknown, {}, Inventory, {}> & Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Inventory, {}> & Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    })[]>;
    findOne(id: number): string;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<import("mongoose").Document<unknown, {}, Inventory, {}> & Inventory & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
