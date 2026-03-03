/**
 * Export an array of transaction objects to a downloadable CSV file.
 */
export const exportToCSV = (transactions, filename = 'transactions.csv') => {
    if (!transactions.length) return;

    const headers = ['Date', 'Type', 'Category', 'Amount', 'Description'];
    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        t.amount,
        `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};
