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

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const verificationUrl = `${process.env.PUBLIC_URL || 'https://ifrof.com'}/verify-email/${token}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #2563eb;">Welcome to IFROF!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with IFROF. Please click the button below to verify your email address and activate your account:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>If you did not create an account, no further action is required.</p>
        <p>&copy; 2026 IFROF. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: emailFrom,
      to,
      subject: "Verify your email - IFROF",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send verification email:", error);
    return false;
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const resetUrl = `${process.env.PUBLIC_URL || 'https://ifrof.com'}/reset-password/${token}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You are receiving this email because we received a password reset request for your account.</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>If you did not request a password reset, no further action is required.</p>
        <p>&copy; 2026 IFROF. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: emailFrom,
      to,
      subject: "Reset your password - IFROF",
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send password reset email:", error);
    return false;
  }
}

export async function sendImportRequestUpdateEmail(
  to: string,
  name: string,
  requestId: string,
  status: string,
  productName: string
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const requestUrl = `${process.env.PUBLIC_URL || 'https://ifrof.com'}/dashboard/requests/${requestId}`;
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #2563eb;">Import Request Update</h2>
      <p>Hi ${name},</p>
      <p>Your import request for <strong>${productName}</strong> has been updated to: <strong>${status}</strong>.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${requestUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Request Details</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p><a href="${requestUrl}">${requestUrl}</a></p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>This is an automated notification from IFROF.</p>
        <p>&copy; 2026 IFROF. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: emailFrom,
      to,
      subject: `Update on your Import Request: ${productName}`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("[Email Service] Failed to send import request update email:", error);
    return false;
  }
}
