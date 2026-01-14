import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, waitlistInputSchema } from "@shared/routes";
import { z } from "zod";
import { Resend } from "resend";

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Waitlist endpoint - stores in DB and sends email notification
  app.post(api.waitlist.join.path, async (req, res) => {
    try {
      const input = waitlistInputSchema.parse(req.body);

      // Store in database
      const subscriber = await storage.createSubscriber({ email: input.email });

      // Send email notification to secret recipient
      const secretRecipient = process.env.SECRET_RECIPIENT_MAIL;

      if (resend && secretRecipient) {
        try {
          await resend.emails.send({
            from: 'Anveshan Waitlist <onboarding@resend.dev>',
            to: secretRecipient,
            subject: '🚀 New Stable Alpha V.2 Signup',
            html: `
              <div style="font-family: Inter, system-ui, sans-serif; padding: 24px; background: #0a0a0a; color: #ededed;">
                <h2 style="margin: 0 0 16px; color: #ffffff;">New Waitlist Signup</h2>
                <p style="margin: 0 0 8px; color: #999999;">Someone joined the Stable Alpha V.2 waitlist:</p>
                <p style="margin: 0; padding: 16px; background: #1a1a1a; border-radius: 8px; font-size: 18px;">
                  <strong>${input.email}</strong>
                </p>
                <p style="margin: 16px 0 0; color: #666666; font-size: 12px;">
                  Sent from Anveshan Identity Platform
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          // Log but don't fail - email is secondary
          console.error('Email notification failed:', emailError);
        }
      } else {
        // Fallback logging when Resend not configured
        console.log('[WAITLIST] New signup:', input.email);
        if (!resend) console.log('[INFO] Resend not configured - add RESEND_API_KEY to enable email notifications');
      }

      res.status(201).json({ success: true, message: "You're on the list!" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }

      // Handle duplicate email gracefully
      if ((err as any)?.code === '23505') {
        return res.status(201).json({ success: true, message: "You're already on the list!" });
      }

      console.error('Waitlist error:', err);
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  });

  return httpServer;
}
