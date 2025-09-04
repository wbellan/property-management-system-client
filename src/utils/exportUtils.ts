// src/utils/exportUtils.ts
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface TransactionExportData {
    id: string;
    date: string;
    referenceNumber: string;
    transactionType: string;
    payeeOrPayer: string;
    chartAccount: {
        accountCode: string;
        accountName: string;
    };
    memo: string;
    payment: number;
    deposit: number;
    balance: number;
}

export interface ExportOptions {
    filename?: string;
    bankAccountName?: string;
    entityName?: string;
    dateRange?: {
        start?: string;
        end?: string;
    };
}

/**
 * Export transactions to CSV format using PapaParse (secure)
 */
export const exportToCSV = (transactions: TransactionExportData[], options: ExportOptions = {}) => {
    const { filename, bankAccountName = 'Bank Account', entityName = 'Entity' } = options;

    // Format data for CSV export
    const csvData = transactions.map(t => ({
        'Date': new Date(t.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
        'Reference #': t.referenceNumber || '',
        'Type': t.transactionType,
        'Payee/Payer': t.payeeOrPayer,
        'Account': `${t.chartAccount.accountCode} - ${t.chartAccount.accountName}`,
        'Memo': t.memo || '',
        'Payment': t.payment > 0 ? t.payment.toFixed(2) : '',
        'Deposit': t.deposit > 0 ? t.deposit.toFixed(2) : '',
        'Balance': t.balance.toFixed(2)
    }));

    // Add metadata rows
    const metadataRows = [
        ['Check Register - ' + entityName + ' - ' + bankAccountName],
        ['Generated: ' + new Date().toLocaleDateString('en-US')],
        ['Total Transactions: ' + transactions.length.toString()],
        [''], // Empty row for spacing
    ];

    // Generate filename if not provided
    const defaultFilename = filename || `check-register-${bankAccountName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;

    // Use PapaParse to generate CSV
    const csvContent = Papa.unparse([
        ...metadataRows,
        csvData
    ], {
        skipEmptyLines: false
    });

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', defaultFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return defaultFilename;
};

/**
 * Export transactions to Excel-compatible HTML format (secure)
 * Creates an HTML table that Excel can open natively
 */
export const exportToExcel = (transactions: TransactionExportData[], options: ExportOptions = {}) => {
    const { filename, bankAccountName = 'Bank Account', entityName = 'Entity' } = options;

    // Generate filename
    const defaultFilename = filename || `check-register-${bankAccountName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.html`;

    // Calculate totals for summary
    const totalPayments = transactions.reduce((sum, t) => sum + t.payment, 0);
    const totalDeposits = transactions.reduce((sum, t) => sum + t.deposit, 0);
    const netChange = totalDeposits - totalPayments;

    // Create HTML content that Excel can open
    const htmlContent = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
    <meta charset="utf-8">
    <meta name="ProgId" content="Excel.Sheet">
    <meta name="Generator" content="Property Management System">
    <title>Check Register Export</title>
    <style>
        body { font-family: Calibri, Arial, sans-serif; margin: 20px; }
        h1 { color: #2c3e50; margin-bottom: 10px; font-size: 18px; }
        .metadata { margin-bottom: 20px; padding: 10px; background: #f8f9fa; border: 1px solid #dee2e6; }
        .metadata p { margin: 2px 0; font-size: 12px; }
        table { border-collapse: collapse; width: 100%; font-size: 11px; }
        th, td { border: 1px solid #dee2e6; padding: 6px 8px; text-align: left; }
        th { background-color: #e9ecef; font-weight: bold; color: #495057; }
        .number { text-align: right; }
        .center { text-align: center; }
        .payment { color: #dc3545; font-weight: 600; }
        .deposit { color: #28a745; font-weight: 600; }
        .summary { margin-top: 20px; }
        .summary table { width: 300px; }
        .summary th { background-color: #6c757d; color: white; }
    </style>
</head>
<body>
    <h1>Check Register - ${entityName}</h1>
    
    <div class="metadata">
        <p><strong>Bank Account:</strong> ${bankAccountName}</p>
        <p><strong>Export Date:</strong> ${new Date().toLocaleDateString('en-US')}</p>
        <p><strong>Export Time:</strong> ${new Date().toLocaleTimeString('en-US')}</p>
        <p><strong>Total Transactions:</strong> ${transactions.length}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Reference #</th>
                <th>Type</th>
                <th>Payee/Payer</th>
                <th>Account Code</th>
                <th>Account Name</th>
                <th>Memo</th>
                <th class="number">Payment</th>
                <th class="number">Deposit</th>
                <th class="number">Balance</th>
            </tr>
        </thead>
        <tbody>
            ${transactions.map(t => `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString('en-US')}</td>
                    <td class="center">${t.referenceNumber || ''}</td>
                    <td class="center">${t.transactionType}</td>
                    <td>${t.payeeOrPayer}</td>
                    <td class="center">${t.chartAccount.accountCode}</td>
                    <td>${t.chartAccount.accountName}</td>
                    <td>${t.memo || ''}</td>
                    <td class="number ${t.payment > 0 ? 'payment' : ''}">${t.payment > 0 ? t.payment.toFixed(2) : ''}</td>
                    <td class="number ${t.deposit > 0 ? 'deposit' : ''}">${t.deposit > 0 ? t.deposit.toFixed(2) : ''}</td>
                    <td class="number">${t.balance.toFixed(2)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="summary">
        <h3>Transaction Summary</h3>
        <table>
            <thead>
                <tr><th>Description</th><th class="number">Amount</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>Total Deposits:</strong></td><td class="number deposit">${totalDeposits.toFixed(2)}</td></tr>
                <tr><td><strong>Total Payments:</strong></td><td class="number payment">${totalPayments.toFixed(2)}</td></tr>
                <tr><td><strong>Net Change:</strong></td><td class="number ${netChange >= 0 ? 'deposit' : 'payment'}">${netChange.toFixed(2)}</td></tr>
                <tr><td><strong>Transaction Count:</strong></td><td class="number">${transactions.length}</td></tr>
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 30px; font-size: 10px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 10px;">
        <p>Generated by Property Management System on ${new Date().toLocaleString('en-US')}</p>
        <p>This file can be opened in Microsoft Excel, Google Sheets, or any spreadsheet application.</p>
    </div>
</body>
</html>`;

    // Create and download file
    const blob = new Blob([htmlContent], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });

    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', defaultFilename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    return defaultFilename;
};

/**
 * Export transactions to PDF format
 */
export const exportToPDF = async (elementId: string, options: ExportOptions = {}) => {
    const { filename, bankAccountName = 'Bank Account', entityName = 'Entity' } = options;

    try {
        // Get the table element
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with id '${elementId}' not found`);
        }

        // Create canvas from element with higher quality
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution for better PDF quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false, // Disable logging for cleaner output
            height: element.scrollHeight, // Capture full height
            width: element.scrollWidth   // Capture full width
        });

        // Calculate dimensions
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape', // Better for wide tables
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Add header with better formatting
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Check Register - ${entityName}`, 20, 20);

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Bank Account: ${bankAccountName}`, 20, 30);

        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}`, 20, 38);

        // Calculate image dimensions to fit page
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Scale image to fit width, maintain aspect ratio
        const ratio = Math.min((pdfWidth - 40) / imgWidth, (pdfHeight - 60) / imgHeight);
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;

        // Check if content fits on one page
        if (scaledHeight <= pdfHeight - 60) {
            // Single page - add image
            pdf.addImage(
                imgData,
                'PNG',
                20, // x position
                45, // y position (below header)
                scaledWidth,
                scaledHeight
            );
        } else {
            // Multi-page handling
            const pageHeight = pdfHeight - 60; // Available height per page
            let remainingHeight = scaledHeight;
            let yPosition = 0;
            let pageCount = 1;

            while (remainingHeight > 0) {
                const heightForThisPage = Math.min(pageHeight, remainingHeight);

                if (pageCount > 1) {
                    pdf.addPage();
                    // Add page header
                    pdf.setFontSize(12);
                    pdf.text(`Check Register - ${entityName} (Page ${pageCount})`, 20, 20);
                }

                pdf.addImage(
                    imgData,
                    'PNG',
                    20,
                    pageCount === 1 ? 45 : 25, // Different Y for first page vs subsequent
                    scaledWidth,
                    heightForThisPage,
                    undefined, // alias
                    'FAST', // compression
                    0, // rotation
                    -yPosition // source Y offset
                );

                remainingHeight -= heightForThisPage;
                yPosition += heightForThisPage;
                pageCount++;
            }
        }

        // Add footer to last page
        const totalPages = pdf.internal.pages.length - 1; // Subtract 1 because first element is empty
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(128, 128, 128);
            pdf.text(
                `Page ${i} of ${totalPages} - Generated by Property Management System`,
                20,
                pdfHeight - 10
            );
        }

        // Generate filename
        const defaultFilename = filename || `check-register-${bankAccountName.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

        // Save PDF
        pdf.save(defaultFilename);

        return defaultFilename;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF. Please try again.');
    }
};

/**
 * Utility function to format currency for export
 */
export const formatCurrencyForExport = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
};

/**
 * Utility function to get export summary
 */
export const getExportSummary = (transactions: TransactionExportData[]) => {
    const totalPayments = transactions.reduce((sum, t) => sum + t.payment, 0);
    const totalDeposits = transactions.reduce((sum, t) => sum + t.deposit, 0);
    const netChange = totalDeposits - totalPayments;

    return {
        totalTransactions: transactions.length,
        totalPayments,
        totalDeposits,
        netChange,
        dateRange: {
            earliest: transactions.length > 0 ?
                Math.min(...transactions.map(t => new Date(t.date).getTime())) : null,
            latest: transactions.length > 0 ?
                Math.max(...transactions.map(t => new Date(t.date).getTime())) : null
        }
    };
};