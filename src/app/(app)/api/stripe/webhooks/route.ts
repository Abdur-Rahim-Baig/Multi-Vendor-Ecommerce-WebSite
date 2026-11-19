import { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(req: Request) {
  let event: Stripe.Event;

  try {
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature) {
      throw new Error("Missing Stripe signature header");
    }

    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }

    event = stripe.webhooks.constructEvent(
      await req.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Stripe webhook signature error:", errorMessage);

    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  console.log("✅ Stripe webhook received:", event.type, event.id);

  const permittedEvents: string[] = ["checkout.session.completed"];

  if (!permittedEvents.includes(event.type)) {
    console.log("ℹ️ Ignored Stripe event:", event.type);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const payload = await getPayload({ config });

  try {
    const data = event.data.object as Stripe.Checkout.Session;

    if (!data.metadata?.userId) {
      throw new Error("Checkout session metadata userId is required");
    }

    const user = await payload.findByID({
      collection: "users",
      id: data.metadata.userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const expandedSession = await stripe.checkout.sessions.retrieve(
      data.id,
      {
        expand: ["line_items.data.price.product"],
      },
    );

    const lineItems = expandedSession.line_items?.data as
      | ExpandedLineItem[]
      | undefined;

    if (!lineItems?.length) {
      throw new Error("No line items found");
    }

    for (const item of lineItems) {
      await payload.create({
        collection: "orders",
        data: {
          name: item.price.product.name,
          user: user.id,
          product: item.price.product.metadata.id,
          stripeCheckoutSessionId: data.id,
        },
      });
    }

    console.log("✅ Orders created for Stripe session:", data.id);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Stripe webhook processing failed:", errorMessage);

    return NextResponse.json(
      { message: `Webhook processing error: ${errorMessage}` },
      { status: 500 },
    );
  }
};