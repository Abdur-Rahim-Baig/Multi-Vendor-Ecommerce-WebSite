import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
  typescript: true,
});

type CreatedV2Account = {
  id: string;
  object: "v2.core.account";
};

export const createConnectedAccount = async ({
  displayName,
  email,
  country = "US",
}: {
  displayName: string;
  email: string;
  country?: string;
}) => {
  try {
    return await stripe.accounts.create({
      type: "express",
      country,
      email,
    });
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      !/Accounts v1|v1\/accounts|Accounts v2|feat_accounts_v1_support/.test(error.message)
    ) {
      throw error;
    }

    return await stripe.rawRequest(
      "POST",
      "/v2/core/accounts",
      {
        contact_email: email,
        display_name: displayName,
        identity: {
          country: country.toLowerCase(),
          entity_type: "individual",
        },
        configuration: { merchant: {} },
        defaults: {
          currency: "usd",
          responsibilities: {
            fees_collector: "stripe",
            losses_collector: "stripe",
          },
        },
        dashboard: "none",
        include: ["configuration.merchant", "defaults", "identity"],
      },
      {
        additionalHeaders: {
          "Stripe-Version": "2026-11-18.endive",
        },
      }
    ) as unknown as CreatedV2Account;
  }
};
