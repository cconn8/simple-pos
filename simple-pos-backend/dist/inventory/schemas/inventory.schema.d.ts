import { Document } from 'mongoose';
export declare class Inventory {
    _id: string;
    name: string;
    category: string;
    type: string;
    description: string;
    qty: number;
    isBillable: string;
    price: number;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, Document<unknown, any, Inventory, any> & Inventory & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, import("mongoose").FlatRecord<Inventory>, {}> & import("mongoose").FlatRecord<Inventory> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
