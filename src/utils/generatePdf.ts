import QRCode  from 'qrcode';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
interface LaunchOptions {
    headless?: boolean | "chrome";
  }
  function toTLV(tag: number, value: string) {
    const encodedTag = Buffer.from([tag]);
    const encodedLength = Buffer.from([value.length]);
    const encodedValue = Buffer.from(value, 'utf8');
    return Buffer.concat([encodedTag, encodedLength, encodedValue]);
  }
  
  function generateZatcaTLV({
    sellerName,
    vatNumber,
    timestamp,
    totalAmount,
    vatAmount,
  }: {
    sellerName: string;
    vatNumber: string;
    timestamp: string;
    totalAmount: string;
    vatAmount: string;
  }) {
    const tlvBuffer = Buffer.concat([
      toTLV(1, sellerName),
      toTLV(2, vatNumber),
      toTLV(3, timestamp),
      toTLV(4, totalAmount),
      toTLV(5, vatAmount),
    ]);
  
    return tlvBuffer.toString('base64');
  }
  
export const generateInvoicePdf = async (orderData: any) => {
    const filePath = path.join(process.cwd(), 'public', 'invoice.html');
  const templateHtml = fs.readFileSync(filePath, 'utf8');
  const template = Handlebars.compile(templateHtml);
  const logoPath = path.join(process.cwd(), 'public', 'assets', 'fruitslogo.png');
  const logoImage = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoImage.toString('base64')}`;
  
  const qrPayload = generateZatcaTLV({
    sellerName: 'Fruits Heaven',
    vatNumber: '311213878300003',
    timestamp: new Date(orderData.createdAt).toISOString(),
    totalAmount: orderData.totalPrice.toFixed(2),
    vatAmount: '0.00', // Adjust this if VAT applies
  });
  
  const qrCodeDataURL = await QRCode.toDataURL(qrPayload); // Base64 image

  Handlebars.registerHelper('inc', function (value) {
    return parseInt(value) + 1;
  });
  
  const items = orderData.items.map((item: any) => ({
    name: item?.name?.ar ?? item?.name?.en,
    quantity: item.quantity,
    price: item.price.toFixed(2),
    total: item.totalPrice.toFixed(2),
  }));

  const html = template({
    invoiceId: orderData?._id,
    customerName: orderData?.user?.name ??orderData?.guest?.name ?? "",
    customerPhone: orderData?.user?.phone?? orderData?.guest?.phone??"",
    customerCity: orderData?.shippingAddress?.city,
    customerStreet: orderData?.shippingAddress?.street,
    subTotal: orderData?.subTotal?.toFixed(2),
    shippingFee: orderData?.shippingFee?.toFixed(2),
    total: orderData?.totalPrice?.toFixed(2),
    createdAt: new Date(orderData.createdAt).toLocaleDateString('ar-EG'),
    status: orderData?.status,
    paymentMethod: orderData?.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'Credit card',
    coupon: orderData?.coupon !== null && orderData?.coupon?.code ,
    discount: orderData?.discount !== null && orderData?.discount ,
    items,
    logo: logoBase64,
    qrCode: qrCodeDataURL,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdf;
};
