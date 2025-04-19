// pages/api/download-invoice.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateInvoicePdf } from '@/utils/generatePdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const pdfBuffer = await generateInvoicePdf(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=order_${req.body._id}.pdf`);
    res.send(pdfBuffer);
  } else {
    res.status(405).end();
  }
}
