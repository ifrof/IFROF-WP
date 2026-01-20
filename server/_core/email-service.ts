import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || "noreply@ifrof.com";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!emailUser || !emailPassword) {
      console.warn(
        "[Email Service] Email credentials not configured. Email notifications will be disabled."
      );
      return null;
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }
  return transporter;
}

export interface OrderConfirmationData {
  buyerName: string;
  buyerEmail: string;
  orderNumber: string;
  orderDate: Date;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
    phone: string;
  };
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email Service] Transporter not configured, skipping email");
    return false;
  }

  try {
    const itemsHtml = data.items
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price / 100).toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${((item.price * item.quantity) / 100).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .summary { background-color: white; padding: 15px; border-radius: 4px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .summary-row.total { font-weight: bold; font-size: 18px; border-bottom: none; color: #1e40af; }
        .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 4px 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="content">
          <div class="section">
            <div class="section-title">Order Details</div>
            <p><strong>Order Number:</strong> ${data.orderNumber}</p>
            <p><strong>Order Date:</strong> ${data.orderDate.toLocaleDateString()}</p>
            <p><strong>Customer:</strong> ${data.buyerName}</p>
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">Product</th>
                  <th style="padding: 8px; text-align: center;">Quantity</th>
                  <th style="padding: 8px; text-align: right;">Unit Price</th>
                  <th style="padding: 8px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Order Summary</div>
            <div class="summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${(data.subtotal / 100).toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Shipping:</span>
                <span>$${(data.shipping / 100).toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>$${(data.tax / 100).toFixed(2)}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>$${(data.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Shipping Address</div>
            <p>
              ${data.shippingAddress.fullName}<br>
              ${data.shippingAddress.address}<br>
              ${data.shippingAddress.city}${data.shippingAddress.state ? ", " + data.shippingAddress.state : ""}${data.shippingAddress.zipCode ? " " + data.shippingAddress.zipCode : ""}<br>
              ${data.shippingAddress.country}<br>
              Phone: ${data.shippingAddress.phone}
            </p>
          </div>

          <div class="section">
            <p style="color: #6b7280; font-size: 14px;">
              Your order has been received and is being processed. You will receive a shipping notification once your items are dispatched.
            </p>
          </div>
        </div>

        <div class="footer">
          <p>&copy; 2024 IFROF. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const textContent = `
Order Confirmation

Order Number: ${data.orderNumber}
Order Date: ${data.orderDate.toLocaleDateString()}
Customer: ${data.buyerName}

Order Items:
${data.items.map((item) => `- ${item.productName} x${item.quantity} @ $${(item.price / 100).toFixed(2)} = $${((item.price * item.quantity) / 100).toFixed(2)}`).join("\n")}

Order Summary:
Subtotal: $${(data.subtotal / 100).toFixed(2)}
Shipping: $${(data.shipping / 100).toFixed(2)}
Tax: $${(data.tax / 100).toFixed(2)}
Total: $${(data.total / 100).toFixed(2)}

Shipping Address:
${data.shippingAddress.fullName}
${data.shippingAddress.address}
${data.shippingAddress.city}${data.shippingAddress.state ? ", " + data.shippingAddress.state : ""}${data.shippingAddress.zipCode ? " " + data.shippingAddress.zipCode : ""}
${data.shippingAddress.country}
Phone: ${data.shippingAddress.phone}

Your order has been received and is being processed. You will receive a shipping notification once your items are dispatched.
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: data.buyerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email Service] Order confirmation sent to ${data.buyerEmail}`);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send order confirmation email:", error);
    return false;
  }
}

export async function sendPaymentFailedEmail(
  buyerEmail: string,
  buyerName: string,
  orderNumber: string,
  reason: string
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[Email Service] Transporter not configured, skipping email");
    return false;
  }

  try {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Failed</h1>
        </div>
        
        <div class="content">
          <p>Hi ${buyerName},</p>
          
          <p>Your payment for order <strong>${orderNumber}</strong> failed.</p>
          
          <p><strong>Reason:</strong> ${reason}</p>
          
          <p>Please try again or contact our support team for assistance.</p>
          
          <p>Best regards,<br>IFROF Team</p>
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: emailFrom,
      to: buyerEmail,
      subject: `Payment Failed - Order ${orderNumber}`,
      html: htmlContent,
    });

    console.log(`[Email Service] Payment failed notification sent to ${buyerEmail}`);
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send payment failed email:", error);
    return false;
  }
}
