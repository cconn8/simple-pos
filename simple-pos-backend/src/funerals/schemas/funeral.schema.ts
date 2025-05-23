import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Funeral extends Document {
    
    @Prop( { type: Object })
    formData: Record<string, any>

}

export const FuneralSchema = SchemaFactory.createForClass(Funeral)
