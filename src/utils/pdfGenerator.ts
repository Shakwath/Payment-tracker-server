import PDFDocument from 'pdfkit';
import type { Response } from 'express';

// Helper to draw a header
const drawHeader = (doc: PDFKit.PDFDocument, madrasaName: string, title: string, subtitle?: string) => {
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text(madrasaName || 'Madrasa Payment Tracker', { align: 'center' });

  if (subtitle) {
    doc.fontSize(10).font('Helvetica').text(subtitle, { align: 'center' });
  }

  doc.moveDown(0.5);
  doc.fontSize(14).font('Helvetica-Bold').text(title, { align: 'center', underline: true });
  doc.fontSize(9).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
  doc.moveDown(1);
};

// 1. Payment Receipt PDF Generator
export const generatePaymentReceiptPdf = (
  res: Response,
  payment: any,
  setting: any
) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Receipt-${payment.receiptNo}.pdf`);
  doc.pipe(res);

  // Madrasa Header
  drawHeader(
    doc,
    setting?.madrasaName || 'Al-Madrasah Islamic Academy',
    'MONEY RECEIPT / পেমেন্ট রশিদ',
    setting?.address ? `${setting.address} | Phone: ${setting.phone || ''}` : undefined
  );

  // Receipt Box
  doc.rect(40, doc.y, 515, 30).fill('#f0f4f8');
  doc.fillColor('#000000');
  doc.fontSize(11).font('Helvetica-Bold');
  doc.text(`Receipt No: ${payment.receiptNo}`, 50, doc.y - 22);
  doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 380, doc.y - 13);
  doc.moveDown(1.5);

  // Student & Guardian Info Table
  doc.fontSize(10).font('Helvetica');
  const student = payment.studentId || {};
  const guardian = payment.guardianId || {};
  const semester = payment.semesterId || {};

  const infoTop = doc.y;
  doc.font('Helvetica-Bold').text('Student Name:', 45, infoTop);
  doc.font('Helvetica').text(student.name || 'N/A', 140, infoTop);

  doc.font('Helvetica-Bold').text('Admission ID:', 340, infoTop);
  doc.font('Helvetica').text(student.admissionId || 'N/A', 430, infoTop);

  doc.font('Helvetica-Bold').text('Class/Program:', 45, infoTop + 18);
  doc.font('Helvetica').text(student.classProgram || 'N/A', 140, infoTop + 18);

  doc.font('Helvetica-Bold').text('Roll Number:', 340, infoTop + 18);
  doc.font('Helvetica').text(student.rollNumber || 'N/A', 430, infoTop + 18);

  doc.font('Helvetica-Bold').text('Guardian Name:', 45, infoTop + 36);
  doc.font('Helvetica').text(guardian.name || 'N/A', 140, infoTop + 36);

  doc.font('Helvetica-Bold').text('Guardian Phone:', 340, infoTop + 36);
  doc.font('Helvetica').text(guardian.phone || 'N/A', 430, infoTop + 36);

  doc.font('Helvetica-Bold').text('Semester:', 45, infoTop + 54);
  doc.font('Helvetica').text(semester.name || 'N/A', 140, infoTop + 54);

  doc.font('Helvetica-Bold').text('Fee Period:', 340, infoTop + 54);
  doc.font('Helvetica').text(`${payment.month} ${payment.year}`, 430, infoTop + 54);

  doc.y = infoTop + 80;
  doc.moveDown(1);

  // Payment Breakdown Table
  const tableTop = doc.y;
  doc.rect(40, tableTop, 515, 20).fill('#1e293b');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
  doc.text('Description / Fee Type', 50, tableTop + 5);
  doc.text('Payment Method', 240, tableTop + 5);
  doc.text('Status', 360, tableTop + 5);
  doc.text('Amount (BDT)', 450, tableTop + 5, { align: 'right', width: 95 });

  doc.fillColor('#000000').font('Helvetica').fontSize(10);
  const rowTop = tableTop + 25;
  doc.text(`${payment.feeType} Fee (${payment.month} ${payment.year})`, 50, rowTop);
  doc.text(payment.paymentMethod, 240, rowTop);
  doc.text(payment.status, 360, rowTop);
  doc.font('Helvetica-Bold').text(`৳${payment.amount.toLocaleString()}`, 450, rowTop, {
    align: 'right',
    width: 95,
  });

  if (payment.transactionId) {
    doc.font('Helvetica').fontSize(9).text(`Txn ID: ${payment.transactionId}`, 50, rowTop + 16);
  }

  // Total Box
  const totalTop = rowTop + 40;
  doc.rect(340, totalTop, 215, 25).fill('#f8fafc');
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12);
  doc.text('Total Paid:', 350, totalTop + 6);
  doc.text(`৳${payment.amount.toLocaleString()}`, 450, totalTop + 6, { align: 'right', width: 95 });

  // Signatures
  doc.y = totalTop + 100;
  doc.fontSize(10).font('Helvetica');
  doc.text('_______________________', 60, doc.y);
  doc.text('Authorized Signature', 65, doc.y + 15);

  doc.text('_______________________', 390, doc.y - 15);
  doc.text('Guardian Signature', 415, doc.y);

  // Footer Note
  doc.fontSize(8).font('Helvetica-Oblique').fillColor('#64748b').text(
    'This is a system-generated official payment receipt issued by Madrasa Payment Tracker.',
    40,
    750,
    { align: 'center', width: 515 }
  );

  doc.end();
};

// 2. Financial Summary Statement PDF Generator
export const generateFinancialStatementPdf = (
  res: Response,
  data: any,
  setting: any
) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=Financial-Statement-${data.period.month}-${data.period.year}.pdf`
  );
  doc.pipe(res);

  drawHeader(
    doc,
    setting?.madrasaName || 'Al-Madrasah Islamic Academy',
    `MONTHLY FINANCIAL STATEMENT (${data.period.month.toUpperCase()} ${data.period.year})`,
    setting?.address ? `${setting.address} | Phone: ${setting.phone || ''}` : undefined
  );

  // Summary Metrics Box
  const startY = doc.y;
  doc.rect(40, startY, 515, 70).fill('#f1f5f9');
  doc.fillColor('#0f172a').fontSize(10);

  doc.font('Helvetica-Bold').text('Total Expected Collection:', 50, startY + 10);
  doc.font('Helvetica').text(`৳${data.financials.totalExpectedCollection.toLocaleString()}`, 210, startY + 10);

  doc.font('Helvetica-Bold').text('Total Verified Collection:', 50, startY + 28);
  doc.font('Helvetica').text(`৳${data.financials.totalVerifiedCollection.toLocaleString()}`, 210, startY + 28);

  doc.font('Helvetica-Bold').text('Total Pending Collection:', 50, startY + 46);
  doc.font('Helvetica').text(`৳${data.financials.totalPendingAmount.toLocaleString()}`, 210, startY + 46);

  doc.font('Helvetica-Bold').text('Total Monthly Expenses:', 310, startY + 10);
  doc.font('Helvetica').text(`৳${data.financials.totalMonthlyExpenses.toLocaleString()}`, 450, startY + 10);

  doc.font('Helvetica-Bold').text('Net Balance (Income - Expense):', 310, startY + 28);
  doc.font('Helvetica-Bold').text(`৳${data.financials.netBalance.toLocaleString()}`, 450, startY + 28);

  doc.y = startY + 85;
  doc.moveDown(1);

  // Student Statistics Table
  doc.font('Helvetica-Bold').fontSize(12).text('1. Student Payment Status Summary');
  doc.moveDown(0.5);

  const statTop = doc.y;
  doc.rect(40, statTop, 515, 20).fill('#334155');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
  doc.text('Total Active Students', 50, statTop + 5);
  doc.text('Paid Students', 200, statTop + 5);
  doc.text('Pending Students', 330, statTop + 5);
  doc.text('Collection Ratio', 440, statTop + 5);

  const statRowTop = statTop + 25;
  doc.fillColor('#000000').font('Helvetica').fontSize(10);
  doc.text(String(data.students.totalActiveStudents), 50, statRowTop);
  doc.text(String(data.students.totalPaidStudents), 200, statRowTop);
  doc.text(String(data.students.totalPendingStudents), 330, statRowTop);
  const ratio = data.students.totalActiveStudents > 0
    ? ((data.students.totalPaidStudents / data.students.totalActiveStudents) * 100).toFixed(1)
    : '0';
  doc.font('Helvetica-Bold').text(`${ratio}%`, 440, statRowTop);

  doc.y = statRowTop + 30;
  doc.moveDown(1);

  // Payment Methods Breakdown
  doc.font('Helvetica-Bold').fontSize(12).text('2. Collections by Payment Method');
  doc.moveDown(0.5);

  const methodTop = doc.y;
  doc.rect(40, methodTop, 515, 20).fill('#334155');
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
  doc.text('Method', 50, methodTop + 5);
  doc.text('Amount Collected (BDT)', 400, methodTop + 5, { align: 'right', width: 145 });

  let curY = methodTop + 25;
  doc.fillColor('#000000').font('Helvetica').fontSize(10);
  Object.entries(data.paymentMethods || {}).forEach(([method, amount]: any) => {
    doc.text(method, 50, curY);
    doc.text(`৳${Number(amount).toLocaleString()}`, 400, curY, { align: 'right', width: 145 });
    curY += 18;
  });

  doc.y = curY + 20;

  // Signatures
  doc.fontSize(10).font('Helvetica');
  doc.text('_______________________', 60, 700);
  doc.text('Accountant', 90, 715);

  doc.text('_______________________', 390, 700);
  doc.text('Principal / Director', 415, 715);

  doc.end();
};
