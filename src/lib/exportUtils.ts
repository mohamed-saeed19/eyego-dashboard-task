import type { OrderRecord } from './data/mockOrders';

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

  doc.setFontSize(18);
  doc.setTextColor(33, 37, 41);
  doc.text('Eyego Commerce - Orders Report', 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(108, 117, 125);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Records: ${data.length}`, 40, 58);

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
    startY: 75,
    theme: 'striped',
    headStyles: {
      fillColor: [24, 24, 27],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [33, 37, 41],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    styles: {
      cellPadding: 6,
      overflow: 'linebreak',
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
