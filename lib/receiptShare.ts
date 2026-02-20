import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Share } from "react-native";

type ReceiptPayload = {
  status: "Successful" | "Not successful";
  bookingDate: string;
  bookingRef: string;
  outletName: string;
  washType: string;
  basePrice: number;
  serviceCharge: number;
  total: number;
};

const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildReceiptHtml = (payload: ReceiptPayload) => {
  const statusColor = payload.status === "Successful" ? "#16A34A" : "#DC2626";
  const logoUrl = "https://raw.githubusercontent.com/JoshuaOyewole/WasHub-Mobile-App/main/assets/images/icon.png";

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px; color: #1F2937; background: #F8FAFC; }
        .shell { max-width: 760px; margin: 0 auto; }
        .hero {
          background: linear-gradient(135deg, #1F2D33 0%, #2D4A57 100%);
          border-radius: 12px;
          padding: 16px;
          color: #FFFFFF;
          margin-bottom: 16px;
        }
        .brand { display: flex; align-items: center; gap: 12px; }
        .logo { width: 40px; height: 40px; border-radius: 8px; background: #FFFFFF; object-fit: cover; }
        h1 { margin: 0; font-size: 20px; color: #FFFFFF; }
        .hero-sub { margin-top: 4px; opacity: .92; font-size: 12px; }
        .hero-meta { margin-top: 10px; font-size: 12px; opacity: .92; }
        .card { border: 1px solid #E5E7EB; border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #FFFFFF; }
        .row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .label { color: #6B7280; font-size: 12px; }
        .value { font-size: 14px; font-weight: 600; }
        .status { color: ${statusColor}; }
        .divider { height: 1px; background: #E5E7EB; margin: 12px 0; }
        .section-title { font-size: 11px; color: #6B7280; letter-spacing: .8px; font-weight: 700; }
        .footer { margin-top: 8px; color: #94A3B8; font-size: 11px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="shell">
      <div class="hero">
        <div class="brand">
          <img class="logo" src="${logoUrl}" alt="WasHub logo" />
          <div>
            <h1>WasHub Payment Receipt</h1>
            <div class="hero-sub">Secure receipt generated from WasHub mobile app</div>
          </div>
        </div>
        <div class="hero-meta">Receipt ID: ${escapeHtml(payload.bookingRef || "N/A")}</div>
      </div>

      <div class="card">
        <div class="row"><span class="label">Booking Date</span><span class="value">${escapeHtml(payload.bookingDate)}</span></div>
        <div class="row"><span class="label">Booking Number</span><span class="value">${escapeHtml(payload.bookingRef)}</span></div>
        <div class="row"><span class="label">Booking Status</span><span class="value status">${escapeHtml(payload.status)}</span></div>
      </div>

      <div class="card">
        <div class="section-title">ORDER SUMMARY</div>
        <div class="divider"></div>
        <div class="row"><span class="label">Outlet</span><span class="value">${escapeHtml(payload.outletName)}</span></div>
        <div class="row"><span class="label">Wash Type</span><span class="value">${escapeHtml(payload.washType)}</span></div>
      </div>

      <div class="card">
        <div class="section-title">PAYMENT SUMMARY</div>
        <div class="divider"></div>
        <div class="row"><span class="label">${escapeHtml(payload.washType)}</span><span class="value">₦${payload.basePrice.toLocaleString()}</span></div>
        <div class="row"><span class="label">Service Charge</span><span class="value">₦${payload.serviceCharge.toLocaleString()}</span></div>
        <div class="divider"></div>
        <div class="row"><span class="label">Total</span><span class="value">₦${payload.total.toLocaleString()}</span></div>
      </div>

      <div class="footer">© ${new Date().getFullYear()} WasHub • Receipt generated electronically</div>
      </div>
    </body>
  </html>
  `;
};

export const shareReceiptAsPdf = async (payload: ReceiptPayload) => {
  const html = buildReceiptHtml(payload);
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Share receipt",
      UTI: "com.adobe.pdf",
    });
    return;
  }

  await Share.share({ message: `Receipt PDF: ${uri}` });
};
