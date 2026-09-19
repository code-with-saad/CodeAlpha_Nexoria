import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and trigger download of a formatted PDF receipt for an order
 * @param {Object} order - Full order object from API
 */
export function generateOrderReceiptPDF(order) {
  if (!order) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const orderId = order._id || 'NEX-ORD';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Header / Brand (Rust Primary: #D84315 -> rgb(216, 67, 21))
  doc.setFillColor(216, 67, 21);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('NEXORIA', 15, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Order Receipt & Tax Invoice', 130, 18);

  // Order Details block
  doc.setTextColor(35, 23, 20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary', 15, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 107, 102);
  doc.text(`Order Reference: #${orderId}`, 15, 49);
  doc.text(`Date of Purchase: ${orderDate}`, 15, 54);
  doc.text(`Payment Status: ${order.isPaid ? 'PAID via Stripe' : 'Pending Payment'}`, 15, 59);

  // Customer / Shipping Address
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(35, 23, 20);
  doc.text('Shipped To:', 125, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 107, 102);
  const addr = order.shippingAddress || {};
  doc.text(`${addr.address || 'Standard Shipping Address'}`, 125, 49);
  doc.text(`${addr.city || 'City'}, ${addr.postalCode || 'Postal Code'}`, 125, 54);
  doc.text(`${addr.country || 'United States'}`, 125, 59);

  // Items Table
  const tableData = (order.orderItems || []).map((item, idx) => [
    idx + 1,
    item.name || 'Product',
    item.quantity || 1,
    `$${Number(item.price || 0).toFixed(2)}`,
    `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 68,
    head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [216, 67, 21], // Rust primary
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [35, 23, 20]
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 33, halign: 'right' }
    }
  });

  const finalY = (doc).lastAutoTable.finalY || 140;

  // Calculation Breakdown
  const subtotal = (order.orderItems || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Number(order.totalAmount || subtotal);
  const shipping = total > 50 || total === 0 ? 0 : 9.99;
  const estimatedTax = total * 0.08;

  const startCalcY = finalY + 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 107, 102);

  doc.text('Subtotal:', 135, startCalcY);
  doc.text(`$${subtotal.toFixed(2)}`, 195, startCalcY, { align: 'right' });

  doc.text('Shipping:', 135, startCalcY + 6);
  doc.text(shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`, 195, startCalcY + 6, { align: 'right' });

  doc.text('Estimated Tax (8%):', 135, startCalcY + 12);
  doc.text(`$${estimatedTax.toFixed(2)}`, 195, startCalcY + 12, { align: 'right' });

  doc.setDrawColor(237, 228, 223);
  doc.line(135, startCalcY + 16, 195, startCalcY + 16);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(216, 67, 21);
  doc.text('Total Paid:', 135, startCalcY + 23);
  doc.text(`$${total.toFixed(2)}`, 195, startCalcY + 23, { align: 'right' });

  // Footer Note
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 138, 133);
  doc.text('Thank you for shopping with Nexoria! For questions, please contact support@nexoriastore.com.', 105, 280, { align: 'center' });

  // Save the PDF
  doc.save(`Nexoria_Receipt_${orderId.slice(-8)}.pdf`);
}
