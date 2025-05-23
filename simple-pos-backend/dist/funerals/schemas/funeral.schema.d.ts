import { Document } from 'mongoose';
export declare class Funeral extends Document {
    formData: Record<string, any>;
}
export declare const FuneralSchema: import("mongoose").Schema<Funeral, import("mongoose").Model<Funeral, any, any, any, Document<unknown, any, Funeral, any> & Funeral & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Funeral, Document<unknown, {}, import("mongoose").FlatRecord<Funeral>, {}> & import("mongoose").FlatRecord<Funeral> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
