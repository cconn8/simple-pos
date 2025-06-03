import { ConfigService } from '@nestjs/config';
import { FuneralsService } from 'src/funerals/funerals.service';
export declare class InvoiceService {
    private configService;
    private funeralsService;
    private storage;
    private bucketName;
    constructor(configService: ConfigService, funeralsService: FuneralsService);
    generateInvoice(funeralId: string): Promise<any>;
    generatePDF(data: any): Promise<Buffer>;
    uploadToGCS(buffer: Buffer, deceasedName: string): Promise<string>;
}
