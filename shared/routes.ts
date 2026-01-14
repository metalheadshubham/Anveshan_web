import { z } from 'zod';
import { insertSubscriberSchema, subscribers } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// Waitlist input schema
export const waitlistInputSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type WaitlistInput = z.infer<typeof waitlistInputSchema>;

export const api = {
  // Renamed from subscribers to waitlist for privacy-first branding
  waitlist: {
    join: {
      method: 'POST' as const,
      path: '/api/waitlist',
      input: waitlistInputSchema,
      responses: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  // Keep legacy for backward compat
  subscribers: {
    create: {
      method: 'POST' as const,
      path: '/api/waitlist', // Point to new endpoint
      input: insertSubscriberSchema,
      responses: {
        201: z.custom<typeof subscribers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
