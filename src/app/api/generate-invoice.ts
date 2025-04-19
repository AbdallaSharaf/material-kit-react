import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const order = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 800;
  page.drawText(`Invoice for Order: ${order._id}`, {
    x: 50,
    y,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  y -= 30;
  page.drawText(`Customer: ${order.user.name} - ${order.user.phone}`, { x: 50, y, font, size: 12 });

  y -= 20;
  page.drawText(`Address: ${order.shippingAddress.city}, ${order.shippingAddress.street}`, { x: 50, y, font, size: 12 });

  y -= 30;
  for (const item of order.items) {
    page.drawText(`- ${item.name.ar || item.name.en}: ${item.quantity} x ${item.price} = ${item.totalPrice}`, {
      x: 60,
      y,
      font,
      size: 12,
    });
    y -= 20;
  }

  y -= 30;
  page.drawText(`Subtotal: ${order.subTotal} | Shipping: ${order.shippingFee} | Total: ${order.totalPrice}`, {
    x: 50,
    y,
    font,
    size: 12,
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=order_${order._id}.pdf`);
  res.send(Buffer.from(pdfBytes));
}
