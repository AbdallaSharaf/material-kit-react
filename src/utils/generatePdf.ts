import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
interface LaunchOptions {
    headless?: boolean | "chrome";
  }
export const generateInvoicePdf = async (orderData: any) => {
    const filePath = path.join(process.cwd(), 'public', 'invoice.html');
  const templateHtml = fs.readFileSync(filePath, 'utf8');
  const template = Handlebars.compile(templateHtml);
  const logoPath = path.join(process.cwd(), 'public', 'assets', 'fruitslogo.png');
  const logoImage = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoImage.toString('base64')}`;
  
  

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
