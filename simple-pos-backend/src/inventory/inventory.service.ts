import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
  ) {}

  async create(data: CreateInventoryDto) {
    const inventory = await this.inventoryModel.create(data);
    console.log('saved inventory : ', inventory);
    return inventory;
  }

  async findAll() {
    const inventory = await this.inventoryModel
      .find()
      .sort({ createdAt: -1 }) // newest first
      .exec();

    if (!inventory || inventory.length === 0) {
      throw new NotFoundException(`No funerals found!`);
    }

    // console.log('inventory found : ', inventory);

    return inventory;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    console.log(
      'Updating inventory item:',
      id,
      'with data:',
      updateInventoryDto,
    );

    try {
      const updatedInventory = await this.inventoryModel
        .findByIdAndUpdate(
          id,
          { $set: updateInventoryDto },
          {
            new: true, // Return the updated document
            runValidators: true, // Run mongoose validation
          },
        )
        .exec();

      if (!updatedInventory) {
        throw new NotFoundException(`Inventory item with id ${id} not found`);
      }

      console.log('Successfully updated inventory item:', updatedInventory);
      return updatedInventory;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update inventory item: ${error.message}`);
    }
  }

  async remove(id: string) {
    const deleted = await this.inventoryModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException(`Inventory item with id ${id} not found`);
    }

    return { message: 'Item deleted successfully', id };
  }
}
