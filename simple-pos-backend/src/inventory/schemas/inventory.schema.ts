import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';



@Schema({timestamps: true})
export class Inventory {
    @Prop({type: String, default: uuidv4})
    _id : String

    @Prop({type: String})
    name : String

    @Prop({type: String})
    category : String

    @Prop({type: Object})
    type : String

    @Prop({type: String})
    description : String

    @Prop({type: String})
    isBillable : String

    @Prop({type: Number})
    price : Number
}

export const InventorySchema = SchemaFactory.createForClass(Inventory); 
