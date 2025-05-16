"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFuneralDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_funeral_dto_1 = require("./create-funeral.dto");
class UpdateFuneralDto extends (0, mapped_types_1.PartialType)(create_funeral_dto_1.CreateFuneralDto) {
}
exports.UpdateFuneralDto = UpdateFuneralDto;
//# sourceMappingURL=update-funeral.dto.js.map