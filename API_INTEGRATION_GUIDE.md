# 🔌 Payment API Integration Guide

Complete setup guide for ClassWallet, PayPal, and Stripe payment integrations.

---

## 📋 Overview

This platform supports three payment methods:

1. **Stripe** - Credit/debit cards for self-pay subscriptions
2. **PayPal** - Autopay subscriptions with PayPal accounts
3. **ClassWallet** - Scholarship and reimbursement payments

---

## 1️⃣ ClassWallet Integration

### What is ClassWallet?

ClassWallet is a payment platform specifically designed for education funding, including:
- Scholarship programs
- Reimbursement requests
- Education Savings Accounts (ESA)
- Empowerment Scholarship Accounts

### Setup Steps

#### Step 1: Create ClassWallet Account

1. Go to [ClassWallet Developer Portal](https://www.classwallet.com/)
2. Sign up for a merchant account
3. Complete verification process
4. Access your API credentials

#### Step 2: Get API Keys

1. Log into ClassWallet Dashboard
2. Navigate to **Settings** → **API Access**
3. Copy your credentials:
   - API Key
   - Merchant ID
   - API URL (usually `https://api.classwallet.com/v3`)
   - Secret Key (for webhooks)

#### Step 3: Add to Environment Variables

```bash
# .env
VITE_CLASSWALLET_API_KEY=your_api_key_here
VITE_CLASSWALLET_MERCHANT_ID=your_merchant_id_here
VITE_CLASSWALLET_API_URL=https://api.classwallet.com/v3
CLASSWALLET_SECRET_KEY=your_secret_key_here
```

#### Step 4: Configure Webhook

1. In ClassWallet Dashboard, go to **Webhooks**
2. Add endpoint: `https://your-site.com/.netlify/functions/classwallet-webhook`
3. Select events:
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `payment.refunded`

### Available Payment Types

| Type | Description | States Available |
|------|-------------|------------------|
| **Scholarship** | General scholarship programs | All states |
| **Reimbursement** | Pay-and-get-reimbursed | All states |
| **ESA** | Education Savings Accounts | AZ, FL, IN, MS, MT, NV, TN, NC, SC |
| **Empowerment** | Empowerment Scholarships | AZ, FL, AR, IA, KS, LA, NH, NC, OK, SC, UT, WV |

### User Flow

1. User selects plan on pricing page
2. Clicks "Upgrade Now" → redirects to checkout
3. Selects "ClassWallet" payment method
4. Chooses payment type (Scholarship, ESA, etc.)
5. Clicks "Complete Secure Checkout"
6. Redirects to ClassWallet authorization page
7. User authorizes payment
8. Redirects back to success page
9. Webhook confirms payment → activates subscription

---

## 2️⃣ PayPal Integration

### What is PayPal?

PayPal allows users to pay with their PayPal balance, linked bank account, or credit/debit card, with automatic recurring payments (autopay).

### Setup Steps

#### Step 1: Create PayPal Business Account

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Sign up for a business account
3. Complete verification

#### Step 2: Create Subscription Plans

1. Log into [PayPal Dashboard](https://www.paypal.com/businessmanage/)
2. Go to **Products & Services** → **Subscriptions**
3. Click **Create Plan**

Create plans for each tier:

**Warrior Monthly:**
- Plan Name: "Warrior Monthly"
- Billing Cycle: Monthly
- Price: $29.00 USD
- Copy **Plan ID** (e.g., `P-WARRIOR-MONTHLY`)

**Warrior Annual:**
- Plan Name: "Warrior Annual"
- Billing Cycle: Yearly
- Price: $279.00 USD
- Copy **Plan ID**

Repeat for Scholar and Legend tiers.

#### Step 3: Get API Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to **Apps & Credentials**
3. Create an app (if you haven't)
4. Copy:
   - **Client ID** (public, safe for frontend)
   - **Secret** (private, for backend only)

#### Step 4: Add to Environment Variables

```bash
# .env
VITE_PAYPAL_CLIENT_ID=your_client_id_here
VITE_PAYPAL_MODE=sandbox  # Use 'live' for production
PAYPAL_CLIENT_SECRET=your_secret_here
```

#### Step 5: Update Plan IDs

Edit `/src/lib/paypal/config.ts` and replace placeholder Plan IDs:

```typescript
export const PAYPAL_PLANS: PayPalPlan[] = [
  {
    id: 'pp-warrior-monthly',
    name: 'Warrior Monthly (PayPal)',
    paypalPlanId: 'P-ABC123XYZ456', // ← Paste your real Plan ID
    // ...
  },
  // ... update all plans
];
```

#### Step 6: Configure Webhooks

1. In [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Go to **Apps & Credentials** → Select your app
3. Scroll to **Webhooks** → **Add Webhook**
4. URL: `https://your-site.com/.netlify/functions/paypal-webhook`
5. Select events:
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.UPDATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `PAYMENT.SALE.COMPLETED`

### User Flow

1. User selects plan on pricing page
2. Clicks "Upgrade Now" → redirects to checkout
3. Selects "PayPal" payment method
4. Clicks "Complete Secure Checkout"
5. Redirects to PayPal authorization page
6. User logs in to PayPal and authorizes subscription
7. Redirects back to success page
8. Webhook confirms subscription → activates account

---

## 3️⃣ Stripe Integration

### Already Set Up

Stripe is already integrated. If you need to add/update:

1. Get keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Add to `.env`:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Update Price IDs in `/src/lib/stripe/config.ts`

---

## 🔧 Backend Functions Needed

### Create Netlify Functions

Create these files in `/netlify/functions/`:

#### 1. `classwallet-create-payment.ts`

```typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      userId,
      userEmail,
      userName,
      planId,
      amount,
      description,
      paymentType,
      returnUrl,
      cancelUrl,
    } = JSON.parse(event.body || '{}');

    // Call ClassWallet API to create payment
    const response = await fetch(
      `${process.env.VITE_CLASSWALLET_API_URL}/payments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLASSWALLET_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: process.env.VITE_CLASSWALLET_MERCHANT_ID,
          amount: amount * 100, // Convert to cents
          description,
          payment_type: paymentType,
          customer: {
            id: userId,
            email: userEmail,
            name: userName,
          },
          return_url: returnUrl,
          cancel_url: cancelUrl,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'ClassWallet API error');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionId: data.id,
        authorizationUrl: data.authorization_url,
      }),
    };
  } catch (error: any) {
    console.error('ClassWallet error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
```

#### 2. `paypal-create-subscription.ts`

```typescript
import { Handler } from '@netlify/functions';

async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.VITE_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(
    `https://api-m.${process.env.VITE_PAYPAL_MODE}.paypal.com/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    }
  );

  const data = await response.json();
  return data.access_token;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const {
      userId,
      userEmail,
      userName,
      planId,
      paypalPlanId,
      returnUrl,
      cancelUrl,
    } = JSON.parse(event.body || '{}');

    const accessToken = await getPayPalAccessToken();

    // Create PayPal subscription
    const response = await fetch(
      `https://api-m.${process.env.VITE_PAYPAL_MODE}.paypal.com/v1/billing/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_id: paypalPlanId,
          subscriber: {
            name: {
              given_name: userName.split(' ')[0],
              surname: userName.split(' ')[1] || '',
            },
            email_address: userEmail,
          },
          application_context: {
            brand_name: "Mz. Marianna's Academy",
            locale: 'en-US',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl,
          },
          custom_id: userId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'PayPal API error');
    }

    // Find approval URL
    const approvalUrl = data.links.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        subscriptionId: data.id,
        approvalUrl,
      }),
    };
  } catch (error: any) {
    console.error('PayPal error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
```

#### 3. Webhook Handlers

Create `classwallet-webhook.ts` and `paypal-webhook.ts` to handle payment confirmations and update Supabase.

---

## 🧪 Testing

### Test Modes

- **ClassWallet:** Use sandbox credentials
- **PayPal:** Use sandbox mode (`VITE_PAYPAL_MODE=sandbox`)
- **Stripe:** Use test keys (`pk_test_...` and `sk_test_...`)

### Test Cards/Accounts

**ClassWallet Sandbox:**
- No test cards needed (sandbox environment)

**PayPal Sandbox:**
- Create test accounts in [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts)
- Use test accounts to complete payments

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

---

## 📧 Email Notifications

### Invoice Emails

After successful payment, automatically send invoice email:

```typescript
import { sendEmail } from './lib/email-service';

await sendEmail({
  to: userEmail,
  subject: `Invoice #${invoiceNumber} - Mz. Marianna's Academy`,
  html: InvoiceEmailTemplate({ invoiceData }),
});
```

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Get live API keys for all services
- [ ] Update environment variables in Netlify
- [ ] Test each payment method in production
- [ ] Set up webhook endpoints
- [ ] Verify email notifications work
- [ ] Test failed payment scenarios
- [ ] Test refund processes

---

## 🆘 Troubleshooting

### ClassWallet Issues

**"Payment authorization failed"**
- Check API keys are correct
- Verify merchant account is activated
- Ensure payment type is available in user's state

### PayPal Issues

**"Subscription creation failed"**
- Verify Plan IDs match PayPal dashboard
- Check PayPal mode (sandbox vs live)
- Ensure Client ID and Secret are correct

### Stripe Issues

**"Checkout session creation failed"**
- Verify Price IDs in Stripe dashboard
- Check publishable key is correct
- Ensure webhook secret matches

---

## 📞 Support

Need help with API integrations?

- **ClassWallet Support:** support@classwallet.com
- **PayPal Developer Support:** https://developer.paypal.com/support/
- **Stripe Support:** https://support.stripe.com/

---

**Last Updated:** February 2026
