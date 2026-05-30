"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const getClient = () => new Resend(process.env.RESEND_API_KEY!);
const FROM = () => process.env.RESEND_FROM_EMAIL ?? "noreply@maestramusica.com";
const ADMIN_EMAIL = () => process.env.ADMIN_EMAIL ?? "";

export const sendBookingConfirmation = internalAction({
  args: {
    clientEmail: v.string(),
    clientName: v.string(),
    serviceName: v.string(),
    appointmentDate: v.string(),
    appointmentTime: v.string(),
  },
  handler: async (_, args) => {
    if (!process.env.RESEND_API_KEY) return;
    const resend = getClient();
    const from = FROM();

    await resend.emails.send({
      from,
      to: args.clientEmail,
      subject: "Confirmación de Solicitud de Clase - Maestra Música",
      html: `
        <h2>¡Gracias por tu solicitud, ${args.clientName}!</h2>
        <p>Hemos recibido tu solicitud de clase de música.</p>
        <table>
          <tr><td><strong>Servicio:</strong></td><td>${args.serviceName}</td></tr>
          <tr><td><strong>Fecha:</strong></td><td>${args.appointmentDate}</td></tr>
          <tr><td><strong>Hora:</strong></td><td>${args.appointmentTime}</td></tr>
        </table>
        <p>Nos pondremos en contacto contigo dentro de 24 horas para confirmar los detalles.</p>
      `,
    });

    const adminEmail = ADMIN_EMAIL();
    if (adminEmail) {
      await resend.emails.send({
        from,
        to: adminEmail,
        subject: `Nueva Solicitud de Clase — ${args.clientName}`,
        html: `
          <h2>Nueva solicitud de clase recibida</h2>
          <table>
            <tr><td><strong>Cliente:</strong></td><td>${args.clientName}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${args.clientEmail}</td></tr>
            <tr><td><strong>Servicio:</strong></td><td>${args.serviceName}</td></tr>
            <tr><td><strong>Fecha:</strong></td><td>${args.appointmentDate}</td></tr>
            <tr><td><strong>Hora:</strong></td><td>${args.appointmentTime}</td></tr>
          </table>
        `,
      });
    }
  },
});

export const sendContactNotification = internalAction({
  args: {
    senderName: v.string(),
    senderEmail: v.string(),
    message: v.string(),
    inquiryType: v.string(),
  },
  handler: async (_, args) => {
    if (!process.env.RESEND_API_KEY) return;
    const adminEmail = ADMIN_EMAIL();
    if (!adminEmail) return;

    await getClient().emails.send({
      from: FROM(),
      to: adminEmail,
      subject: `Nuevo Mensaje de Contacto — ${args.inquiryType}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <table>
          <tr><td><strong>De:</strong></td><td>${args.senderName}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${args.senderEmail}</td></tr>
          <tr><td><strong>Tipo:</strong></td><td>${args.inquiryType}</td></tr>
        </table>
        <p><strong>Mensaje:</strong></p>
        <blockquote style="border-left:3px solid #ccc;padding-left:1em">${args.message}</blockquote>
      `,
    });
  },
});
