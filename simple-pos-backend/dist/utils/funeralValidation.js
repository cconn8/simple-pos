"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFuneralData = validateFuneralData;
exports.createDefaultFuneralData = createDefaultFuneralData;
exports.safeString = safeString;
exports.safeArray = safeArray;
exports.safeObject = safeObject;
function validateFuneralData(data) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    if (!data.deceasedName || typeof data.deceasedName !== 'string' || data.deceasedName.trim() === '') {
        return false;
    }
    if (!data.dateOfDeath || typeof data.dateOfDeath !== 'string') {
        return false;
    }
    if (!data.client || typeof data.client !== 'object') {
        return false;
    }
    if (!data.billing || typeof data.billing !== 'object') {
        return false;
    }
    if (!data.contacts || typeof data.contacts !== 'object') {
        return false;
    }
    if (!Array.isArray(data.selectedItems)) {
        return false;
    }
    return true;
}
function createDefaultFuneralData() {
    return {
        deceasedName: '',
        dateOfDeath: '',
        lastAddress: '',
        client: {
            name: '',
            address: '',
            phone: '',
            email: ''
        },
        billing: {
            careOf: '',
            name: '',
            address: '',
            invoiceNumber: ''
        },
        contacts: {
            contactName1: '',
            phone1: '',
            contactName2: '',
            phone2: ''
        },
        invoice: {
            invoiceNumber: '',
            generatedDate: '',
            dueDate: '',
            status: '',
            totalAmount: 0,
            discount: 0,
            pdfUrl: '',
            notes: '',
            lineItems: []
        },
        fromDate: '',
        toDate: '',
        selectedItems: [],
        notes: '',
        funeralNotes: ''
    };
}
function safeString(value, defaultValue = '') {
    if (typeof value === 'string') {
        return value;
    }
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return String(value);
}
function safeArray(value, defaultValue = []) {
    if (Array.isArray(value)) {
        return value;
    }
    return defaultValue;
}
function safeObject(value, defaultValue) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return { ...defaultValue, ...value };
    }
    return defaultValue;
}
//# sourceMappingURL=funeralValidation.js.map