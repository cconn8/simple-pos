import { FormTemplatesService } from './form-templates.service';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
export declare class FormTemplatesController {
    private readonly formTemplatesService;
    constructor(formTemplatesService: FormTemplatesService);
    create(createFormTemplateDto: CreateFormTemplateDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFormTemplateDto: UpdateFormTemplateDto): string;
    remove(id: string): string;
}
