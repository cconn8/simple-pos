import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteFileResponse, Storage } from '@google-cloud/storage';
import { FuneralsService } from 'src/funerals/funerals.service';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { GoogleAuthService } from 'src/google/google-auth.service';

@Injectable()
export class InvoiceService {
  private storage: Storage;
  private bucketName = 'invoice-app-storage';

  constructor(
    private readonly configService: ConfigService,
    private readonly funeralsService: FuneralsService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async onModuleInit() {
    const client = await this.googleAuthService.getClient();

    // Verify token is fresh
    const token = await client.getAccessToken();
    this.storage = new Storage({ authClient: client });
  }

  async generateInvoice(funeralId: string, data?: any): Promise<any> {
    console.log('invoice service here - generating invoice');
    const funeralDoc = await this.funeralsService.findOneById(funeralId);
    const funeralObj = funeralDoc.toObject(); //funerals are nested in formData in mongodb. Convert toObject as mongoDB returns a document type (different to object)
    const funeral = funeralObj.formData;
    const normalizedDataForInvoice = { ...funeral, ...data }; //appends any new data from data to a flat object

    const { deceasedName } = normalizedDataForInvoice;

    // funeral['additionalInvoiceData'] = data; //append the edited invoice data from the client modal to the funeral object

    const pdf = await this.generatePDF(normalizedDataForInvoice); //generate pdf
    const url = await this.uploadToGCS(pdf, deceasedName); //upload to google cloud platform

    await this.funeralsService.findByIdAndUpdateUsingMongoCommand(funeralId, {
      $set: { 'formData.invoice': url },
    }); //update the funeral record with the url of the invoice

    return { invoiceUrl: url };
  }

  async generatePDF(data: any): Promise<Buffer> {
    console.log('generating PDF...');
    console.log('data is : ', data);

    let serviceCharge = data.selectedItems.find(
      (item) =>
        item.type?.toLowerCase().includes('service fee') &&
        item.name.toLowerCase().includes('service'),
    );

    if (!serviceCharge) {
      console.warn('Service Charge item not found in selected items.');
      serviceCharge = 0;
    }
    console.log('service fee selected is - : ', serviceCharge);

    const services = data.selectedItems.filter(
      (item) => item.category == 'service' && item._id != serviceCharge._id,
    );
    const products = data.selectedItems.filter(
      (item) => item.category == 'product',
    );
    const disbursements = data.selectedItems.filter(
      (item) => item.category == 'disbursement',
    );

    let productsAndServicesTotal = 0;
    let disbursementsTotal = 0;

    console.log('service charge is :', serviceCharge.price);
    console.log('Type of service charge is : ', typeof serviceCharge.price);

    const formatItem = (item: Record<string, any>) => {
      const itemTotal = item.price * item.qty;
      if (item.qty > 1) {
        item['displayTitle'] =
          `${item.name}  :   (${item.qty} x €${item.price}/unit)`;
      } else {
        item['displayTitle'] = item.name;
      }
      item['itemTotal'] = itemTotal;
    };

    products.forEach((product) => {
      formatItem(product);
      productsAndServicesTotal += Number(product.itemTotal || 0);
    });
    services.forEach((service) => {
      formatItem(service);
      productsAndServicesTotal += Number(service.itemTotal || 0);
    });
    disbursements.forEach((disbursement) => {
      formatItem(disbursement);
      disbursementsTotal += Number(disbursement.itemTotal || 0);
    });

    console.log('test products after formatting : ', products);

    productsAndServicesTotal += serviceCharge.price;
    const subtotal = productsAndServicesTotal + disbursementsTotal;

    console.log('Products and services total = ', productsAndServicesTotal);
    console.log('Subtotal = ', subtotal);

    // const {fromDate, toDate , invoiceNumber, misterMisses, clientName, addressLineOne, addressLineTwo, addressLineThree } = data.additionalInvoiceData;
    const formattedFromDate = new Date(data.fromDate).toDateString();
    const formattedToDate = new Date(data.toDate).toDateString();
    console.log(`new dates are ${formattedFromDate} - ${formattedToDate}`);

    const splitAddressLines = (data.billingAddress ?? '')
      .split(',')
      .map((line) => line.trim());
    // console.log('Split address lines is : ',splitAddressLines);
    const splitServiceChargeDescription = serviceCharge.description
      .split(/[\n]+/)
      .map((line) => line.trim());
    // console.log('Service Description Split is : ', splitServiceChargeDescription);

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
      // formattedFromDate, formattedToDate, invoiceNumber, misterMisses, clientName, addressLineOne, addressLineTwo, addressLineThree
    };

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'invoice.template5.hbs',
    );
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const html = template(templateData);

    try {
      console.log(
        'Checking Chromium at:',
        process.env.PUPPETEER_EXECUTABLE_PATH,
      );
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({ format: 'a4' });
      await browser.close();
      return Buffer.from(pdf);
    } catch (error) {
      console.error('Puppeteer launch failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  async uploadToGCS(buffer: Buffer, deceasedName: string): Promise<string> {
    console.log('uploading to gcs...');
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

  async deleteFileGCS(invoiceUrl: string): Promise<DeleteFileResponse> {
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
    } catch (error) {
      console.log('no file exists in GCP :', error);
      return;
    }
  }
}
