import { z } from "zod";
import { PAYMENT_METHOD_CODES } from "@/lib/payments";

export const checkoutItemSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(1).max(9),
});

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.email("Enter a valid email").max(160),
    phone: z.string().trim().min(6, "Enter a contact number").max(30),
    fulfilment: z.enum(["pickup", "delivery"]),
    paymentMethod: z.enum([...PAYMENT_METHOD_CODES, "pay_at_shop"]),
    address: z.string().trim().max(400).optional().default(""),
    city: z.string().trim().max(120).optional().default(""),
    pickupNotes: z.string().trim().max(500).optional().default(""),
    // Optional map pin for delivery orders.
    deliveryLat: z.number().min(-90).max(90).nullish(),
    deliveryLng: z.number().min(-180).max(180).nullish(),
    items: z.array(checkoutItemSchema).min(1, "Your cart is empty").max(50),
  })
  .refine(
    (v) =>
      v.fulfilment !== "delivery" || (v.address.length > 0 && v.city.length > 0),
    { path: ["address"], error: "Delivery address and city are required" },
  )
  .refine(
    (v) => v.paymentMethod !== "pay_at_shop" || v.fulfilment === "pickup",
    { path: ["paymentMethod"], error: "Pay at shop is only for pickup orders" },
  );

export type CheckoutValues = z.infer<typeof checkoutSchema>;
