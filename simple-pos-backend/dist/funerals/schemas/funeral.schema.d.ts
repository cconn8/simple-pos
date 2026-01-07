import { Document } from 'mongoose';
export declare enum PaymentStatus {
    PAID = "Paid",
    PARTIALLY_PAID = "Partially Paid",
    UNPAID = "Unpaid"
}
export declare class Funeral extends Document {
    formData: Record<string, any>;
    paymentStatus: PaymentStatus;
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
