import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: Object })
  type: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number })
  qty: number;

  @Prop({ type: String })
  isBillable: string;

  @Prop({ type: Number })
  price: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
