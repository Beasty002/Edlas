import {
    format as formatDate,
    parseISO,
} from 'date-fns';

/**
 * Format a number as currency (USD)
 * @param {*} value - Value to format
 * @param {string} [locale='en-US'] - Locale
 * @param {string} [currency='USD'] - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value, locale = 'en-US', currency = 'USD') {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(num)) return '-';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format a number with 2 decimal places
 * @param {*} value - Value to format
 * @param {string} [locale='en-US'] - Locale
 * @returns {string} Formatted number string
 */
export function formatNumber(value, locale = 'en-US') {
    const num = typeof value === 'number' ? value : parseFloat(String(value));
    if (Number.isNaN(num)) return '-';

    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

/**
 * Format a date value using date-fns
 * @param {*} value - Value to format
 * @param {string} [dateFormat='dd MMM yyyy'] - Date format string
 * @returns {string} Formatted date string
 */
export function formatDateValue(value, dateFormat = 'dd MMM yyyy') {
    if (!value) return '-';

    try {
        const date = typeof value === 'string' ? parseISO(value) : value;
        return formatDate(date, dateFormat);
    } catch {
        return String(value);
    }
}

/**
 * Format a value based on the format type specified in column config
 * @param {*} value - Value to format
 * @param {string} [formatType] - Format type (C2, N2, date format, etc.)
 * @param {string} [type] - Column type (date, boolean, etc.)
 * @returns {string} Formatted value string
 */
export function formatValue(value, formatType, type) {
    if (value === null || value === undefined) {
        return '-';
    }

    // Handle date type
    if (type === 'date' || formatType?.includes('MMM') || formatType?.includes('yyyy')) {
        return formatDateValue(value, formatType || 'dd MMM yyyy');
    }

    // Handle currency format (C2)
    if (formatType === 'C2') {
        return formatCurrency(value);
    }

    // Handle number format (N2)
    if (formatType === 'N2') {
        return formatNumber(value);
    }

    // Handle boolean
    if (type === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
}
