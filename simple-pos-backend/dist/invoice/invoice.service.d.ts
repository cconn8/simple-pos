import { ConfigService } from '@nestjs/config';
import { DeleteFileResponse } from '@google-cloud/storage';
import { FuneralsService } from 'src/funerals/funerals.service';
import { GoogleAuthService } from 'src/google/google-auth.service';
export declare class InvoiceService {
    private readonly configService;
    private readonly funeralsService;
    private readonly googleAuthService;
    private storage;
    private bucketName;
    constructor(configService: ConfigService, funeralsService: FuneralsService, googleAuthService: GoogleAuthService);
    onModuleInit(): Promise<void>;
    generateInvoice(funeralId: string, data: any): Promise<any>;
    generatePDF(data: any): Promise<Buffer>;
    uploadToGCS(buffer: Buffer, deceasedName: string): Promise<string>;
    deleteFileGCS(invoiceUrl: string): Promise<DeleteFileResponse>;
}
