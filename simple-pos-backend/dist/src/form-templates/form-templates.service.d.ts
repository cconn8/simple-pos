import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
export declare class FormTemplatesService {
    create(createFormTemplateDto: CreateFormTemplateDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFormTemplateDto: UpdateFormTemplateDto): string;
    remove(id: number): string;
}
