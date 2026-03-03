/**
 * Format a number as locale-aware currency (INR by default).
 * Change the locale and currency code as needed.
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format a date string to a readable format.
 */
export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
