import { Document } from "mongoose";
export declare class Inventory {
    _id: String;
    name: String;
    category: String;
    type: String;
    description: String;
    isBillable: String;
    price: Number;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, Document<unknown, any, Inventory, any> & Inventory & Required<{
    _id: String;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, import("mongoose").FlatRecord<Inventory>, {}> & import("mongoose").FlatRecord<Inventory> & Required<{
    _id: String;
}> & {
    __v: number;
}>;
