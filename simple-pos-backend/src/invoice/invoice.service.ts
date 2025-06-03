import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { FuneralsService } from 'src/funerals/funerals.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import Handlebars from "handlebars";


@Injectable()
export class InvoiceService {
    private storage : Storage;
    private bucketName = 'invoice-app-storage';

    constructor(private configService : ConfigService, private funeralsService: FuneralsService) {
        const keyPath = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
        if (!keyPath) {throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS path in env config')}
        this.storage = new Storage( {keyFilename: keyPath})
    }


    async generateInvoice(funeralId: string) : Promise<any> {
        console.log('invoice service here - generating invoice')
        const funeralDoc = await this.funeralsService.findOneById(funeralId);
        const funeralObj = funeralDoc.toObject(); //funerals are nested in formData in mongodb. Convert toObject as mongoDB returns a document type (different to object) 
        const funeral = funeralObj.formData

        const { deceasedName } = funeral;

        const pdf = await this.generatePDF(funeral);                //generate pdf
        const url = await this.uploadToGCS(pdf, deceasedName);      //upload to google cloud platform


        await this.funeralsService.findByIdAndUpdate(funeralId, { $set: {'formData.invoice' : url}}); //update the funeral record with the url of the invoice
        
        return { invoiceUrl : url }; 
    }

    async generatePDF(data: any): Promise<Buffer> {
        console.log('generating PDF...')
        
        const { selectedItems } = data;
        
        const services = selectedItems.filter((item) => item.category == 'service')
        const products = selectedItems.filter((item) => item.category == 'product')
        const disbursements = selectedItems.filter((item) => item.category == 'disbursement')

        const templateData = {
            data,
            services,
            products,
            disbursements
        }

        const templatePath = path.join(process.cwd(), 'src/invoice/templates', 'invoice.template.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(source);
        const html = template(templateData);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        return Buffer.from(pdf);
    }


    async uploadToGCS(buffer: Buffer, deceasedName: string): Promise<string> {
        console.log('uploading to gcs...')
        const fileName = `invoices/${deceasedName}-${uuidv4()}.pdf`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(fileName);

        await file.save(buffer, {
        contentType: 'application/pdf',
        public: true, // or skip this for private
        resumable: false,
    });

    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

}
