"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformLegacyToV2 = transformLegacyToV2;
exports.safeTransformToV2 = safeTransformToV2;
exports.calcInvoiceTotalFromLegacyData = calcInvoiceTotalFromLegacyData;
const funeralValidation_1 = require("./funeralValidation");
function transformLegacyToV2(legacyRecord) {
    const formData = legacyRecord.formData || {};
    const client = {
        name: (0, funeralValidation_1.safeString)(formData.clientName),
        address: (0, funeralValidation_1.safeString)(formData.clientAddress),
        phone: (0, funeralValidation_1.safeString)(formData.clientPhone),
        email: (0, funeralValidation_1.safeString)(formData.clientEmail)
    };
    const billing = {
        careOf: (0, funeralValidation_1.safeString)(formData.careOf),
        name: (0, funeralValidation_1.safeString)(formData.billingName),
        address: (0, funeralValidation_1.safeString)(formData.billingAddress),
        invoiceNumber: (0, funeralValidation_1.safeString)(formData.invoiceNumber)
    };
    const contacts = {
        contactName1: (0, funeralValidation_1.safeString)(formData.contactName1),
        phone1: (0, funeralValidation_1.safeString)(formData.phone1),
        contactName2: (0, funeralValidation_1.safeString)(formData.contactName2),
        phone2: (0, funeralValidation_1.safeString)(formData.phone2)
    };
    const invoice = {
        invoiceNumber: formData.invoiceNumber,
        generatedDate: Date.toString(),
        dueDate: '',
        status: '',
        totalAmount: calcInvoiceTotalFromLegacyData(formData.selectedItems),
        discount: 0,
        pdfUrl: (0, funeralValidation_1.safeString)(formData.invoice),
        notes: '',
        lineItems: (0, funeralValidation_1.safeArray)(formData.selectedItems)
    };
    const funeralData = {
        deceasedName: (0, funeralValidation_1.safeString)(formData.deceasedName),
        funeralType: (0, funeralValidation_1.safeString)(formData.funeralType) || 'Funeral',
        dateOfDeath: (0, funeralValidation_1.safeString)(formData.dateOfDeath),
        lastAddress: (0, funeralValidation_1.safeString)(formData.lastAddress),
        client,
        billing,
        contacts,
        invoice,
        fromDate: (0, funeralValidation_1.safeString)(formData.fromDate),
        toDate: (0, funeralValidation_1.safeString)(formData.toDate),
        selectedItems: (0, funeralValidation_1.safeArray)(formData.selectedItems),
        notes: (0, funeralValidation_1.safeString)(formData.notes),
        funeralNotes: (0, funeralValidation_1.safeString)(formData.funeralNotes)
    };
    return {
        _id: legacyRecord._id,
        funeralData,
        paymentStatus: legacyRecord.paymentStatus,
        createdAt: legacyRecord.createdAt,
        updatedAt: legacyRecord.updatedAt
    };
}
function safeTransformToV2(unknownRecord) {
    try {
        if (unknownRecord.funeralData && typeof unknownRecord.funeralData === 'object') {
            return unknownRecord;
        }
        if (unknownRecord.formData && typeof unknownRecord.formData === 'object') {
            return transformLegacyToV2(unknownRecord);
        }
        return null;
    }
    catch (error) {
        console.error('Error transforming funeral record:', error);
        return null;
    }
}
function calcInvoiceTotalFromLegacyData(lineItems) {
    let invoiceTotal = 0;
    try {
        lineItems.map((item) => {
            invoiceTotal += item.qty * item.price;
        });
        return invoiceTotal;
    }
    catch (error) {
        console.error('Error calculating invoice total from legacy data');
        return invoiceTotal;
    }
}
//# sourceMappingURL=funeralTransformation.js.map