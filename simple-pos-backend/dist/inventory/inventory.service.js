"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
const common_2 = require("@nestjs/common");
let InventoryService = class InventoryService {
    constructor(inventoryModel) {
        this.inventoryModel = inventoryModel;
    }
    async create(data) {
        const inventory = await this.inventoryModel.create(data);
        console.log('saved inventory : ', inventory);
        return inventory;
    }
    async findAll() {
        const inventory = await this.inventoryModel
            .find()
            .sort({ createdAt: -1 })
            .exec();
        if (!inventory || inventory.length === 0) {
            throw new common_2.NotFoundException(`No funerals found!`);
        }
        return inventory;
    }
    findOne(id) {
        return `This action returns a #${id} inventory`;
    }
    async update(id, updateInventoryDto) {
        console.log('Updating inventory item:', id, 'with data:', updateInventoryDto);
        try {
            const updatedInventory = await this.inventoryModel
                .findByIdAndUpdate(id, { $set: updateInventoryDto }, {
                new: true,
                runValidators: true,
            })
                .exec();
            if (!updatedInventory) {
                throw new common_2.NotFoundException(`Inventory item with id ${id} not found`);
            }
            console.log('Successfully updated inventory item:', updatedInventory);
            return updatedInventory;
        }
        catch (error) {
            console.error('Error updating inventory item:', error);
            if (error instanceof common_2.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to update inventory item: ${error.message}`);
        }
    }
    async remove(id) {
        const deleted = await this.inventoryModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new common_2.NotFoundException(`Inventory item with id ${id} not found`);
        }
        return { message: 'Item deleted successfully', id };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map