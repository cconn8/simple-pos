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
const puppeteer_1 = require("puppeteer");
const fs = require("fs");
const handlebars_1 = require("handlebars");
const google_auth_service_1 = require("../google/google-auth.service");
let InvoiceService = class InvoiceService {
    constructor(configService, funeralsService, googleAuthService) {
        this.configService = configService;
        this.funeralsService = funeralsService;
        this.googleAuthService = googleAuthService;
        this.bucketName = 'invoice-app-storage';
    }
    async onModuleInit() {
        const client = await this.googleAuthService.getClient();
        const token = await client.getAccessToken();
        this.storage = new storage_1.Storage({ authClient: client });
    }
    async generateInvoice(funeralId, data) {
        console.log('invoice service here - generating invoice');
        const funeralDoc = await this.funeralsService.findOneById(funeralId);
        const funeralObj = funeralDoc.toObject();
        let funeral = funeralObj.formData;
        const { deceasedName } = funeral;
        funeral['additionalInvoiceData'] = data;
        const pdf = await this.generatePDF(funeral);
        const url = await this.uploadToGCS(pdf, deceasedName);
        await this.funeralsService.findByIdAndUpdate(funeralId, { $set: { 'formData.invoice': url } });
        return { invoiceUrl: url };
    }
    async generatePDF(data) {
        console.log('generating PDF...');
        const { selectedItems } = data;
        console.log('debugging selected items : ', selectedItems);
        let serviceCharge = selectedItems.find((item) => item.type?.toLowerCase().includes('service fee'));
        if (!serviceCharge) {
            throw new Error('Service Charge item not found in selected items.');
        }
        console.log('service fee selected is - : ', serviceCharge);
        const services = selectedItems.filter((item) => item.category == 'service' && item._id != serviceCharge._id);
        const products = selectedItems.filter((item) => item.category == 'product');
        const disbursements = selectedItems.filter((item) => item.category == 'disbursement');
        let productsAndServicesTotal = 0;
        let disbursementsTotal = 0;
        console.log('service charge is :', serviceCharge.price);
        products.forEach((product) => { productsAndServicesTotal += Number(product.itemTotal || 0); });
        services.forEach((service) => { productsAndServicesTotal += Number(service.itemTotal || 0); });
        disbursements.forEach((disbursement) => { disbursementsTotal += Number(disbursement.itemTotal || 0); });
        productsAndServicesTotal += serviceCharge.price;
        let subtotal = productsAndServicesTotal + disbursementsTotal;
        console.log('Products and services total = ', productsAndServicesTotal);
        console.log('Subtotal = ', subtotal);
        const { fromDate, toDate, invoiceNumber, misterMisses, clientName, addressLineOne, addressLineTwo, addressLineThree } = data.additionalInvoiceData;
        const formattedFromDate = new Date(fromDate).toDateString();
        const formattedToDate = new Date(toDate).toDateString();
        console.log(`new dates are ${formattedFromDate} - ${formattedToDate}`);
        const templateData = {
            data,
            services,
            products,
            disbursements,
            productsAndServicesTotal,
            disbursementsTotal,
            subtotal,
            serviceCharge,
            formattedFromDate, formattedToDate, invoiceNumber, misterMisses, clientName, addressLineOne, addressLineTwo, addressLineThree
        };
        const templatePath = path.join(process.cwd(), 'templates', 'invoice.template4.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(source);
        const html = template(templateData);
        try {
            console.log('Checking Chromium at:', process.env.PUPPETEER_EXECUTABLE_PATH);
            const browser = await puppeteer_1.default.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdf = await page.pdf({ format: 'a4' });
            await browser.close();
            return Buffer.from(pdf);
        }
        catch (error) {
            console.error('Puppeteer launch failed:', error);
            throw new Error(`PDF generation failed: ${error.message}`);
        }
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
    async deleteFileGCS(invoiceUrl) {
        console.log('Deleting invoice from GCS..');
        const parts = invoiceUrl.split('/');
        const bucketName = parts[parts.length - 3];
        const filename = parts[parts.length - 2] + '/' + parts[parts.length - 1];
        if (parts.length < 2) {
            throw new Error('Invalid invoice URL format');
        }
        ;
        console.log('Splitting URL - Bucket & File : ', bucketName, filename);
        const myBucket = this.storage.bucket(bucketName);
        try {
            const file = myBucket.file(filename);
            const deleted = await file.delete();
            return deleted;
        }
        catch (error) {
            console.log('no file exists in GCP :', error);
            return;
        }
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        funerals_service_1.FuneralsService,
        google_auth_service_1.GoogleAuthService])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map