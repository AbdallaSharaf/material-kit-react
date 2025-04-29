import dayjs from "dayjs";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

export const handleDownloadExcel = (data: any, reportKey: string, title: string) => {
  if (!data) {
    Swal.fire('Warning', 'No data available to export', 'warning');
    return;
  }
  console.log(data)
  try {
    const wb = XLSX.utils.book_new();
    let exportData: any[] = [];
    let sheetName = 'Report';
    let fileName = `${title.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;

    switch (reportKey) {
      case 'salesReport':
        exportData = [
          ['Metric', 'Value'],
          ['Number of Orders', data.numberOfOrders],
          ['Total Revenue', { v: data.totalRevenue, t: 'n', z: '#,##0.00' }],
          ['Average Order Value', { v: data.avgOrderValue, t: 'n', z: '#,##0.00' }],
          ['Products Sold', data.productsSold]
        ];
        sheetName = 'Sales Report';
        break;

      case 'highValueCustomers':
        exportData = data.map((customer: any) => ({
          'Customer Name': customer.name || 'Unknown',
          'Total Spent': { v: customer.totalSpent, t: 'n', z: '#,##0.00' },
          'Customer ID': customer._id || 'N/A',
          'Last Order Date': customer.lastOrderDate ? dayjs(customer.lastOrderDate).format('YYYY-MM-DD') : 'N/A',
          'Order Count': customer.orderCount || 0
        }));
        sheetName = 'High Value Customers';
        break;

      case 'monthlyComparison':
        exportData = Array.from({ length: 12 }, (_, i) => {
          const monthNumber = i + 1;
          const monthData = data.find((d: any) => d.month === monthNumber);
          return {
            'Month': dayjs().month(monthNumber - 1).format('MMMM'),
            'Month Number': monthNumber,
            'Total Sales': { v: monthData?.totalSales || 0, t: 'n', z: '#,##0.00' },
          };
        });
        
        // Add summary row
        exportData.push({
          'Month': 'TOTAL',
          'Month Number': '',
          'Total Sales': { 
            v: exportData.reduce((sum, month) => sum + (month['Total Sales']?.v || 0), 0), 
            t: 'n', 
            z: '#,##0.00' 
          }
        });
        sheetName = 'Monthly Comparison';
        break;

      case 'newCustomers':
        exportData = data.map((customer: any) => ({
          'Customer ID': customer._id || 'N/A',
          'Customer Name': customer.name || 'Unknown Customer',
          'Phone Number': customer.phone || 'Unknown',
          'First Order Date': customer.firstOrderDate 
            ? dayjs(customer.firstOrderDate).format('YYYY-MM-DD HH:mm')
            : 'N/A',
          'Source': customer.source || 'Unknown',
        }));
        sheetName = 'New Customers';
        break;

      case 'ordersAndInvoices':
        exportData = data.flatMap((order: any) => {
          const baseFields = {
            'Order ID': order._id || 'N/A',
            'Customer Name': order.customerName || 'Unknown Customer',
            'Total Price': { v: order.totalPrice || 0, t: 'n', z: '#,##0.00' },
            'Payment Method': order.paymentMethod || 'Unknown',
            'Order Date': order.orderDate 
              ? dayjs(order.orderDate).format('YYYY-MM-DD HH:mm')
              : 'N/A',
            // 'Order Status': order.status || 'N/A'
          };
          return baseFields
        });

        // Add summary row
        exportData.push({
          'Order ID': 'SUMMARY',
          'Total Price': { 
            v: data.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0),
            t: 'n',
            z: '#,##0.00'
          },
          'Product Name': `${data.length} orders with ${data.reduce((sum: number, order: any) => sum + (order.products?.length || 0), 0)} products total`
        });
        sheetName = 'Orders Report';
        break;

      case 'topSellingByQty':
      case 'topSellingByRevenue':
        exportData = data.map((product: any) => ({
          'Product ID': product._id || 'N/A',
          'Product Name': product.name?.ar || product.name?.en || 'Unknown Product',
          [reportKey === 'topSellingByQty' ? 'Quantity Sold' : 'Total Revenue']: 
            reportKey === 'topSellingByQty' 
              ? product.totalQuantitySold || 0
              : { v: product.totalRevenue || 0, t: 'n', z: '#,##0.00' },
        }));
        sheetName = reportKey === 'topSellingByQty' ? 'Top Selling (Quantity)' : 'Top Selling (Revenue)';
        break;

      case 'repeatedCustomers':
        exportData = data.map((customer: any) => ({
          'Customer ID': customer._id || 'N/A',
          'Customer Name': customer.name || 'Unknown Customer',
          'Total Orders': customer.totalOrders || 0,
          'Total Spent': { v: customer.totalSpent || 0, t: 'n', z: '#,##0.00' },
          'Average Basket Value': { v: customer.averageBasketValue || 0, t: 'n', z: '#,##0.00' },
        }));
        sheetName = 'Repeated Customers';
        break;

      case 'lowestSelling':
        exportData = data.map((product: any) => ({
          'Product ID': product._id,
          'Product Name': product.name?.ar || product.name?.en || 'Unknown Product',
          'Quantity Sold': product.totalQuantitySold || 0,
          'Status': product.totalQuantitySold <= 3 ? 'Low Stock Alert' : 'Normal',
        }));
        sheetName = 'Lowest Selling Products';
        break;

      default:
        if (Array.isArray(data)) {
          exportData = data;
        } else {
          exportData = Object.entries(data).map(([key, value]) => ({
            Key: key,
            Value: value
          }));
        }
    }

    // Create worksheet
    const ws = Array.isArray(exportData) && exportData.length > 0 && Array.isArray(exportData[0])
      ? XLSX.utils.aoa_to_sheet(exportData)
      : XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    if (ws['!cols'] === undefined) {
      ws['!cols'] = [];
      }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Save the file
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    Swal.fire('Error', 'Failed to export report', 'error');
  }
};