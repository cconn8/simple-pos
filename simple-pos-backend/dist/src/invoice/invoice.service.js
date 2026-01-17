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
const funeralTransformation_1 = require("../../utils/funeralTransformation");
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
        let legacyRecord = false, normalizedDataForInvoice;
        if (funeralObj.formData) {
            legacyRecord = true;
            normalizedDataForInvoice = (0, funeralTransformation_1.transformLegacyToV2)(funeralObj);
        }
        else {
            normalizedDataForInvoice = funeralObj;
        }
        const existingInvoiceUrl = legacyRecord
            ? funeralObj.formData?.invoice
            : funeralObj.funeralData?.invoice?.pdfUrl;
        if (existingInvoiceUrl) {
            try {
                console.log('Cleaning up old invoice:', existingInvoiceUrl);
                await this.deleteFileGCS(existingInvoiceUrl);
                console.log('Old invoice cleaned up successfully');
            }
            catch (error) {
                console.warn('Failed to clean up old invoice (file may not exist):', error.message);
            }
        }
        const { deceasedName } = normalizedDataForInvoice.funeralData.deceasedName;
        const pdf = await this.generatePDF(normalizedDataForInvoice);
        const url = await this.uploadToGCS(pdf, deceasedName);
        let dbQuery = legacyRecord ? 'formData.invoice' : 'funeralData.invoice.pdfUrl';
        console.log('Checking if legacy db structure - chosen DB string is : ', dbQuery);
        await this.funeralsService.findByIdAndUpdateUsingMongoCommand(funeralId, {
            $set: { [dbQuery]: url },
        });
        return { invoiceUrl: url };
    }
    async generatePDF(data) {
        console.log('generating PDF...');
        console.log('data is : ', data);
        let serviceCharge = data.funeralData.selectedItems.find((item) => item.type?.toLowerCase().includes('service fee') &&
            item.name.toLowerCase().includes('service'));
        if (!serviceCharge) {
            console.warn('No designated Service Charge item found in selected items.');
            serviceCharge = 0;
        }
        const services = data.funeralData.selectedItems.filter((item) => item.category == 'service' && item._id != serviceCharge._id);
        const products = data.funeralData.selectedItems.filter((item) => item.category == 'product');
        const disbursements = data.funeralData.selectedItems.filter((item) => item.category == 'disbursement');
        let productsAndServicesTotal = 0;
        let disbursementsTotal = 0;
        const formatItem = (item) => {
            const itemTotal = item.price * item.qty;
            if (item.qty > 1) {
                item['displayTitle'] =
                    `${item.name}  :   (${item.qty} x €${item.price}/unit)`;
            }
            else {
                item['displayTitle'] = item.name;
            }
            item['itemTotal'] = itemTotal;
        };
        products ? products.forEach((product) => {
            formatItem(product);
            productsAndServicesTotal += Number(product.itemTotal || 0);
        }) : console.log('No products to add');
        services ? services.forEach((service) => {
            formatItem(service);
            productsAndServicesTotal += Number(service.itemTotal || 0);
        }) : console.log('No services to add');
        disbursements ? disbursements.forEach((disbursement) => {
            formatItem(disbursement);
            disbursementsTotal += Number(disbursement.itemTotal || 0);
        }) : console.log('No disbursements to add');
        productsAndServicesTotal += serviceCharge.price || serviceCharge;
        const subtotal = productsAndServicesTotal + disbursementsTotal;
        console.log('Products and services total = ', productsAndServicesTotal);
        console.log('Subtotal = ', subtotal);
        const formattedFromDate = new Date(data.funeralData.fromDate).toDateString();
        const formattedToDate = new Date(data.funeralData.toDate).toDateString();
        console.log(`new dates are ${formattedFromDate} - ${formattedToDate}`);
        const billingAddress = data.funeralData.billing.address;
        const splitAddressLines = billingAddress?.includes(',')
            ? billingAddress.split(',').map(line => line.trim())
            : [];
        const splitServiceChargeDescription = serviceCharge.description?.split(/[\n]+/)
            .map(line => line.trim()) ?? [];
        const templateData = {
            data,
            services,
            products,
            disbursements,
            productsAndServicesTotal,
            disbursementsTotal,
            subtotal,
            serviceCharge,
            formattedFromDate,
            formattedToDate,
            splitAddressLines,
            splitServiceChargeDescription,
        };
        const templatePath = path.join(process.cwd(), 'templates', 'invoice.template5.hbs');
        const source = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars_1.default.compile(source);
        const html = template(templateData);
        try {
            console.log('Checking Chromium at:', process.env.PUPPETEER_EXECUTABLE_PATH);
            const browser = await puppeteer_1.default.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
    async clearInvoiceFromDatabase(funeralId) {
        console.log('Clearing invoice URL from database for funeral:', funeralId);
        const funeralDoc = await this.funeralsService.findOneById(funeralId);
        const funeralObj = funeralDoc.toObject();
        let updateCommand;
        if (funeralObj.formData) {
            updateCommand = { $unset: { 'formData.invoice': 1 } };
        }
        else {
            updateCommand = { $unset: { 'funeralData.invoice.pdfUrl': 1 } };
        }
        return await this.funeralsService.findByIdAndUpdateUsingMongoCommand(funeralId, updateCommand);
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