import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFuneralDto } from './dto/create-funeral.dto';
import { UpdateFuneralDto } from './dto/update-funeral.dto';
import { Funeral } from './schemas/funeral.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceService } from 'src/invoice/invoice.service';

@Injectable()
export class FuneralsService {
  constructor(
    @InjectModel(Funeral.name) private funeralModel: Model<Funeral>,
  ) {}

  async create(data: CreateFuneralDto): Promise<Funeral> {
    // Simple detection: if data has 'funeralData' property, it's V2 format
    const funeralRecord = (data as any).funeralData 
      ? { 
          funeralData: (data as any).funeralData,
          ...(data as any).paymentStatus && { paymentStatus: (data as any).paymentStatus }  // Only add if present
        } // V2 format
      : { formData: data }; // Legacy format
    
    const funeral = await this.funeralModel.create(funeralRecord);
    // Funeral saved successfully
    return funeral;
  }

  async findAll() {
    const funerals = await this.funeralModel
      .find()
      .sort({ createdAt: -1 }) // newest first
      .exec();

    if (!funerals || funerals.length === 0) {
      throw new NotFoundException(
        `No funerals found! Tasetfully returning 404!`,
      );
    }

    // Convert Mongoose documents to plain objects for proper serialization
    const plainFunerals = funerals.map(funeral => funeral.toObject());
    
    return plainFunerals;
  }

  async findOneById(id: string) {
    // Find funeral by ID
    const funeral = await this.funeralModel.findById(id).exec();
    if (!funeral)
      throw new NotFoundException(`Funeral with id ${id} not found`);
    return funeral;
  }

  async findByIdAndUpdate(
    id: string,
    updateFuneralDto: UpdateFuneralDto,
  ): Promise<any> {
    // Update funeral by ID

    // Handle different update types
    let updateData;
    
    if ((updateFuneralDto as any).funeralData) {
      // V2 format data update
      updateData = { 
        $set: { 
          funeralData: (updateFuneralDto as any).funeralData,
          ...((updateFuneralDto as any).paymentStatus && { paymentStatus: (updateFuneralDto as any).paymentStatus })
        },
        $unset: { formData: 1 } // Remove legacy formData when saving V2 format
      };
    } else if ((updateFuneralDto as any).paymentStatus) {
      // Simple payment status update
      updateData = { 
        $set: { paymentStatus: (updateFuneralDto as any).paymentStatus }
      };
    } else {
      // Legacy format update
      updateData = { $set: { formData: updateFuneralDto } };
    }

    const updatedDoc = this.funeralModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    // Funeral updated successfully
    return updatedDoc;
  }

  async findBySearchQuery(query: string) {
    return this.funeralModel
      .find({ name: { $regex: query, $options: 'i' } })
      .exec();
  }

  async findByIdAndUpdateUsingMongoCommand(
    id: string,
    mongoCommand: any,
  ): Promise<any> {
    return this.funeralModel.findByIdAndUpdate(id, mongoCommand);
  }

  async deleteById(id: string) {
    const deleted = this.funeralModel.findByIdAndDelete(id);
    return deleted;
  }
}
