export function generateOrderConfirmationEmail(order: any) {
  const itemsHtml = order.items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString()} ر.س</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
      <h2 style="color: #FF4D6D; text-align: center;">شكراً لطلبك من دي آرو!</h2>
      <p>مرحباً ${order.customerName}،</p>
      <p>تم استلام طلبك رقم <strong>${order.orderNumber}</strong> بنجاح.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f8f8;">
            <th style="padding: 10px; text-align: right;">المنتج</th>
            <th style="padding: 10px; text-align: center;">الكمية</th>
            <th style="padding: 10px; text-align: right;">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; font-weight: bold;">الإجمالي:</td>
            <td style="padding: 10px; font-weight: bold; text-align: right;">${order.total.toLocaleString()} ر.س</td>
          </tr>
        </tfoot>
      </table>

      ${order.paymentMethod === 'bank_transfer' ? `
        <div style="background: #fff4f6; padding: 15px; border-radius: 8px; border: 1px solid #ff4d6d22;">
          <h3 style="color: #FF4D6D; margin-top: 0;">تعليمات التحويل البنكي</h3>
          <p>يرجى تحويل المبلغ إلى الحساب التالي:</p>
          <p><strong>بنك الراجحي:</strong> SA84 8000 0000 0000 0000 0000</p>
          <p><strong>المستفيد:</strong> شركة دي آرو للتسويق</p>
          <p style="font-size: 14px; color: #666;">بعد التحويل، يرجى إرسال إيصال الدفع عبر الواتساب مع رقم الطلب.</p>
        </div>
      ` : `
        <p>سيتم معالجة الدفع وإرسال المنتجات الرقمية إلى بريدك الإلكتروني قريباً.</p>
      `}

      <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="text-align: center; color: #999; font-size: 12px;">دي آرو للتسويق الرقمي - جميع الحقوق محفوظة 2026</p>
    </div>
  `;
}
