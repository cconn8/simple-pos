"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateDisplay = formatDateDisplay;
function formatDateDisplay(dateString) {
    if (!dateString || typeof dateString !== 'string' || dateString.trim() === '') {
        return '-';
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '-';
        }
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }
    catch (error) {
        return '-';
    }
}
//# sourceMappingURL=dateUtils.js.map