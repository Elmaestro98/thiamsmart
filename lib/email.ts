import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface OrderConfirmationItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationParams {
  to: string;
  customerName: string;
  orderNumber: string;
  items: OrderConfirmationItem[];
  totalPrice: number;
  currency: string;
  address?: {
    address?: string;
    city?: string;
  } | null;
}

export async function sendOrderConfirmationEmail(
  params: OrderConfirmationParams,
) {
  if (!resend) {
    console.error(
      "RESEND_API_KEY manquant : email de confirmation de commande non envoyé.",
    );
    return;
  }

  const itemsHtml = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${(
            item.price * item.quantity
          ).toLocaleString("fr-FR")} ${params.currency}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <h2 style="color:#74212A;">Merci pour votre commande, ${params.customerName} !</h2>
      <p>Votre commande <strong>${params.orderNumber}</strong> a bien été enregistrée. Nous vous tiendrons informé(e) de son avancement.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="border-bottom:2px solid #74212A;text-align:left;">
            <th style="padding:8px 0;">Produit</th>
            <th style="padding:8px 0;text-align:center;">Qté</th>
            <th style="padding:8px 0;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;text-align:right;">
        Total : ${params.totalPrice.toLocaleString("fr-FR")} ${params.currency}
      </p>
      ${
        params.address?.address
          ? `<p>Adresse de livraison : ${params.address.address}${
              params.address.city ? `, ${params.address.city}` : ""
            }</p>`
          : ""
      }
      <p style="margin-top:30px;color:#888;font-size:13px;">
        Une question sur votre commande ? Répondez simplement à cet email.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Thiamsmart <onboarding@resend.dev>",
      to: params.to,
      subject: `Confirmation de votre commande ${params.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
  }
}

interface AdminOrderNotificationParams {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderNumber: string;
  items: OrderConfirmationItem[];
  totalPrice: number;
  currency: string;
  address?: {
    address?: string;
    city?: string;
  } | null;
}

export async function sendAdminOrderNotificationEmail(
  params: AdminOrderNotificationParams,
) {
  if (!resend) {
    console.error(
      "RESEND_API_KEY manquant : notification admin de commande non envoyée.",
    );
    return;
  }

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.error(
      "ADMIN_NOTIFICATION_EMAIL manquant : notification admin de commande non envoyée.",
    );
    return;
  }

  const itemsHtml = params.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${(
            item.price * item.quantity
          ).toLocaleString("fr-FR")} ${params.currency}</td>
        </tr>`,
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333;">
      <h2 style="color:#74212A;">Nouvelle commande reçue : ${params.orderNumber}</h2>
      <p><strong>Client :</strong> ${params.customerName}</p>
      <p><strong>Email :</strong> ${params.customerEmail}</p>
      ${params.customerPhone ? `<p><strong>Téléphone :</strong> ${params.customerPhone}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="border-bottom:2px solid #74212A;text-align:left;">
            <th style="padding:8px 0;">Produit</th>
            <th style="padding:8px 0;text-align:center;">Qté</th>
            <th style="padding:8px 0;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="font-size:18px;font-weight:bold;text-align:right;">
        Total : ${params.totalPrice.toLocaleString("fr-FR")} ${params.currency}
      </p>
      ${
        params.address?.address
          ? `<p>Adresse de livraison : ${params.address.address}${
              params.address.city ? `, ${params.address.city}` : ""
            }</p>`
          : ""
      }
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Thiamsmart <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🛒 Nouvelle commande ${params.orderNumber}`,
      html,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification admin:", error);
  }
}
