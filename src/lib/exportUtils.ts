import type { OrderRecord } from '@/types';

export async function exportToExcel(data: OrderRecord[], filename = 'orders-export.xlsx') {
  const XLSX = await import('xlsx');

  const rows = data.map((order) => ({
    'Order ID': order.orderNumber,
    'Customer Name': order.customerName,
    'Customer Email': order.customerEmail,
    Category: order.category,
    'Amount (USD)': order.amount,
    Status: order.status,
    Date: order.date,
    Country: order.country,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

  XLSX.writeFile(workbook, filename);
}

export async function exportToPDF(data: OrderRecord[], filename = 'orders-export.pdf') {
  const { default: jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Eyego Commerce — Orders Export', 40, 42);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()} | Filtered records: ${data.length}`, 40, 58);

  const head = [['Order #', 'Customer', 'Category', 'Amount', 'Status', 'Date', 'Country']];
  const body = data.map((order) => [
    order.orderNumber,
    order.customerName,
    order.category,
    `$${order.amount.toFixed(2)}`,
    order.status,
    order.date,
    order.country,
  ]);

  autoTable(doc, {
    head,
    body,
    startY: 72,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    styles: {
      cellPadding: 5.5,
      overflow: 'linebreak',
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
