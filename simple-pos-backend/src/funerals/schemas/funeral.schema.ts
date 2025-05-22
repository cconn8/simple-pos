import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })
export class Funeral extends Document {

    @Prop()
    deceasedName: string;

    @Prop()
    dateOfDeath: Date;

    @Prop()
    clientName: string;

    @Prop( { type: Object })
    formData: Record<string, any>

}

export const FuneralSchema = SchemaFactory.createForClass(Funeral)
