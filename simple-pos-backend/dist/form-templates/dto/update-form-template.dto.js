"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFormTemplateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_form_template_dto_1 = require("./create-form-template.dto");
class UpdateFormTemplateDto extends (0, mapped_types_1.PartialType)(create_form_template_dto_1.CreateFormTemplateDto) {
}
exports.UpdateFormTemplateDto = UpdateFormTemplateDto;
//# sourceMappingURL=update-form-template.dto.js.map