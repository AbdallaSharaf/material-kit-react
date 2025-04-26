import dayjs from "dayjs";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';

export const handleDownloadExcel = (data: any, reportKey: string, title: string) => {
    if (!data) {
      Swal.fire('Warning', 'No data available to export', 'warning');
      return;
    }
  
    try {
      const wb = XLSX.utils.book_new();
      let exportData: any[] = [];
      let sheetName = 'Report';
      let fileName = `${title.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.xlsx`;
  
      switch (reportKey) {
        case 'salesReport':
          // Format for sales report
          exportData = [
            ['Metric', 'Value'],
            ['Number of Orders', data.numberOfOrders],
            ['Total Revenue', `${data.totalRevenue?.toFixed(2)} SAR`],
            ['Average Order Value', `${data.avgOrderValue?.toFixed(2)} SAR`],
            ['Products Sold', data.productsSold]
          ];
          sheetName = 'Sales Report';
          break;

          case 'highValueCustomers':
            return data.map((customer: any) => ({
              'Customer Name': customer.name || 'Unknown',
              'Total Spent': customer.totalSpent?.toFixed(2) || 0,
              'Customer ID': customer._id || 'N/A'
            }));

            case 'monthlyComparison':
  // Create array with all 12 months, filling in available data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNumber = i + 1;
    const monthData = data.find((d: any) => d.month === monthNumber);
    return {
      'Month Number': monthNumber,
      'Total Sales': monthData?.totalSales || 0,
      // Add other metrics if they exist in your data
    };
  });

  // Add summary row at the end
  const summaryRowSales = {
    'Month': 'TOTAL',
    'Month Number': '',
    'Total Sales': monthlyData.reduce((sum, month) => sum + month['Total Sales'], 0)
  };

  return [...monthlyData, summaryRowSales];

  case 'newCustomers':
  return data.map((customer: any) => ({
    'Customer Name': customer.name || 'Unknown Customer',
    'Phone Number': customer.phone || 'Unknown',
    'First Order Date': customer.firstOrderDate 
      ? dayjs(customer.firstOrderDate).format('YYYY-MM-DD HH:mm')
      : 'N/A',
    'Source': customer.source || 'Unknown',
    'Customer ID': customer._id || 'N/A',
    // Add if available in your data:
    'First Order Value': customer.firstOrderValue?.toFixed(2) || '0.00',
    'Location': customer.city || customer.region || 'N/A'
  }));

  case 'ordersAndInvoices':
  // Flatten order data with product details
  const ordersData = data.flatMap((order: any) => {
    const baseFields = {
      'Order ID': order._id || 'N/A',
      'Customer Name': order.customerName || 'Unknown Customer',
      'Total Price': order.totalPrice?.toFixed(2) || '0.00',
      'Payment Method': order.paymentMethod || 'Unknown',
      'Order Date': order.orderDate 
        ? dayjs(order.orderDate).format('YYYY-MM-DD HH:mm')
        : 'N/A',
      'Order Status': order.status || 'N/A'
    };

    // If no products, return just order info
    if (!order.products || order.products.length === 0) {
      return [baseFields];
    }

    // Create one row per product with order info
    return order.products.map((product: any) => ({
      ...baseFields,
      'Product Name': product.name?.["ar"] || product.name?.["en"] || 'Unknown Product',
      'Product ID': product._id || 'N/A',
      'Quantity': product.quantity || 0,
      'Unit Price': product.price?.toFixed(2) || '0.00',
      'Subtotal': (product.quantity * product.price)?.toFixed(2) || '0.00'
    }));
  });

  // Add summary row
  const summaryRowOrder = {
    'Order ID': 'SUMMARY',
    'Total Price': data.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0).toFixed(2),
    'Product Name': `${data.length} orders with ${data.reduce((sum: number, order: any) => sum + (order.products?.length || 0), 0)} products total`
  };

  return [...ordersData, summaryRowOrder];

  case 'topSellingByQty':
case 'topSellingByRevenue':
  return data.map((product: any) => ({
    'Product Name': product.name?.["ar"] || 'Unknown Product',
    'Product ID': product._id || 'N/A',
    'SKU': product.sku || 'N/A',
    [reportKey === 'topSellingByQty' ? 'Quantity Sold' : 'Total Revenue']: 
      reportKey === 'topSellingByQty' 
        ? product.totalQuantitySold || 0
        : {
            v: product.totalRevenue || 0,
            t: 'n',
            z: '"$"#,##0.00'
          },
    'Average Price': {
      v: product.averagePrice || 0,
      t: 'n',
      z: '"$"#,##0.00'
    },
    // Additional useful metrics if available:
    'Category': product.category?.["ar"] || 'N/A',
    'Stock Level': product.stockLevel || 'N/A'
  }));

  case 'repeatedCustomers':
  return data.map((customer: any) => ({
    'Customer Name': customer.name || 'Unknown Customer',
    'Customer ID': customer._id || 'N/A',
    'Total Orders': customer.totalOrders || 0,
    'Total Spent': {
      v: customer.totalSpent || 0,
      t: 'n',
      z: '"$"#,##0.00' // Excel currency format
    },
    'Average Basket Value': {
      v: customer.averageBasketValue || 0,
      t: 'n',
      z: '"$"#,##0.00' // Excel currency format
    },
    'First Order Date': customer.firstOrderDate 
      ? dayjs(customer.firstOrderDate).format('YYYY-MM-DD')
      : 'N/A',
    'Last Order Date': customer.lastOrderDate 
      ? dayjs(customer.lastOrderDate).format('YYYY-MM-DD')
      : 'N/A'
  }));
        // We'll add other cases here as we get the components
        default:
          // Fallback for unknown report types
          if (Array.isArray(data)) {
            exportData = data;
          } else {
            exportData = Object.entries(data).map(([key, value]) => ({
              Key: key,
              Value: value
            }));
          }
      }
  
      // Create worksheet based on data format
      const ws = Array.isArray(exportData[0]) && typeof exportData[0] !== 'object'
        ? XLSX.utils.aoa_to_sheet(exportData) // For array of arrays
        : XLSX.utils.json_to_sheet(exportData); // For array of objects
  
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
      // Set column widths for better Excel display
      if (!ws['!cols']) {
        ws['!cols'] = [
          { width: 20 }, // Metric/Key column
          { width: 15 }  // Value column
        ];
      }
  
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire('Error', 'Failed to export report', 'error');
    }
  };