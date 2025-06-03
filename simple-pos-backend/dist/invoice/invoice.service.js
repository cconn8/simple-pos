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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_1 = require("@google-cloud/storage");
const funerals_service_1 = require("../funerals/funerals.service");
const uuid_1 = require("uuid");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const handlebars_1 = require("handlebars");
let InvoiceService = class InvoiceService {
    constructor(configService, funeralsService) {
        this.configService = configService;
        this.funeralsService = funeralsService;
        this.bucketName = 'invoice-app-storage';
        const keyPath = this.configService.get('GOOGLE_APPLICATION_CREDENTIALS');
        if (!keyPath) {
            throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS path in env config');
        }
        this.storage = new storage_1.Storage({ keyFilename: keyPath });
    }
    async generateInvoice(funeralId) {
        console.log('invoice service here - generating invoice');
        const funeralDoc = await this.funeralsService.findOneById(funeralId);
        const funeralObj = funeralDoc.toObject();
        const funeral = funeralObj.formData;
        const { deceasedName } = funeral;
        const pdf = await this.generatePDF(funeral);
        const url = await this.uploadToGCS(pdf, deceasedName);
        await this.funeralsService.findByIdAndUpdate(funeralId, { $set: { 'formData.invoice': url } });
        return { invoiceUrl: url };
    }
    async generatePDF(data) {
        console.log('generating PDF...');
        const templatePath = path.join(process.cwd(), 'src/invoice/templates', 'invoice.template.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(source);
        const html = template(data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();
        return Buffer.from(pdf);
    }
    async uploadToGCS(buffer, deceasedName) {
        console.log('uploading to gcs...');
        const fileName = `invoices/${deceasedName}-${(0, uuid_1.v4)()}.pdf`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(fileName);
        await file.save(buffer, {
            contentType: 'application/pdf',
            public: true,
            resumable: false,
        });
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, funerals_service_1.FuneralsService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map