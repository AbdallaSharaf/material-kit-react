import { NextRequest } from 'next/server';
import { generateInvoicePdf } from '@/utils/generatePdf';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pdfBuffer = await generateInvoicePdf(body);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=order_${body._id}.pdf`,
      },
    });
  } catch (error: any) {
    console.error('🚨 Error generating PDF:', error.message, error.stack);
    return new Response('Internal Server Error', { status: 500 });
  }
}
