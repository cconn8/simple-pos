import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum PaymentStatus {
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  UNPAID = 'Unpaid',
}

@Schema({ timestamps: true })
export class Funeral extends Document {
  @Prop({ type: Object })
  formData: Record<string, any>;

  @Prop({
    type: String,
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;
}

export const FuneralSchema = SchemaFactory.createForClass(Funeral);
