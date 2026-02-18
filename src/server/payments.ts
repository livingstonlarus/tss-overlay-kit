import Stripe from 'stripe';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const gocardless = require('gocardless-nodejs');
const gcInit = gocardless.default || gocardless;

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

// Initialize GoCardless
export const gcClient = gcInit(
    process.env.GOCARDLESS_TOKEN!,
    process.env.GOCARDLESS_ENVIRONMENT === 'live' ? 'live' : 'sandbox'
);

// --- Stripe Helpers ---

export const createCheckoutSession = async ({ priceId, successUrl, cancelUrl, customerEmail, metadata }: {
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    customerEmail?: string,
    metadata?: Record<string, string>
}) => {
    return await stripe.checkout.sessions.create({
        mode: 'subscription', // or 'payment' for one-time
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customerEmail,
        metadata,
    });
};

// --- GoCardless Helpers ---

export const createRedirectFlow = async ({ sessionToken, successRedirectUrl, description, prefilledCustomer }: {
    sessionToken: string,
    successRedirectUrl: string,
    description?: string,
    prefilledCustomer?: { givenName: string, familyName: string, email: string }
}) => {
    return await gocardless.redirectFlows.create({
        session_token: sessionToken,
        success_redirect_url: successRedirectUrl,
        description,
        prefilled_customer: prefilledCustomer
    });
};

export const completeRedirectFlow = async ({ redirectFlowId, sessionToken }: { redirectFlowId: string, sessionToken: string }) => {
    return await gocardless.redirectFlows.complete(redirectFlowId, {
        session_token: sessionToken
    });
};
