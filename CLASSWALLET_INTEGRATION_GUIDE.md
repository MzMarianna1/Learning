# Pay by ClassWallet Integration Guide

## Overview

This implementation provides the Pay by ClassWallet service integration following ClassWallet's 3-step workflow for accepting scholarship and education reimbursement payments.

## 3-Step Workflow

### Step 1: Session Establishment
Account data is sent to your store to establish a session with the user's information.

**Implementation:** `netlify/functions/classwallet-establish-session.ts`
- Creates a unique session ID
- Stores user account data (name, email, phone)
- Returns session ID for subsequent steps

### Step 2: Checkout Redirect
The user is redirected to ClassWallet checkout with order data.

**Implementation:** `netlify/functions/classwallet-prepare-checkout.ts`
- Receives order details and session ID
- Prepares order data for ClassWallet
- Returns checkout URL: `https://app.classwallet.com/payby-checkout/?callback={your_callback_url}`

**Checkout URL Format:**
```
GET https://app.classwallet.com/payby-checkout/?callback={CALLBACK_URL}
```

Where `CALLBACK_URL` is your server endpoint that will receive payment confirmation.

### Step 3: Payment Confirmation
Order payment confirmation is sent to your store via the callback URL.

**Implementation:** `netlify/functions/classwallet-callback.ts`
- Receives payment confirmation from ClassWallet
- Updates session with transaction details
- Redirects user to success/failure page

## Environment Variables

Add these to your `.env` file:

```bash
# ClassWallet Vendor ID (required)
VITE_CLASSWALLET_VENDOR_ID=your_vendor_id_here

# ClassWallet Checkout URL (default provided)
VITE_CLASSWALLET_CHECKOUT_URL=https://app.classwallet.com/payby-checkout/

# ClassWallet API credentials (optional for advanced features)
VITE_CLASSWALLET_API_KEY=your_api_key_here
VITE_CLASSWALLET_MERCHANT_ID=your_merchant_id_here
```

## Frontend Integration

### Display Programs Page
Navigate to `/programs` to view available programs for neurodivergent learners.

### Program Checkout
When a user selects a program, they're taken to `/programs/checkout?program={program_id}` where they can:
1. Choose a purchase option (per session, per week, or full program)
2. Review program details
3. Complete checkout with ClassWallet

### Payment Callback
After ClassWallet processes the payment, the user is redirected to `/classwallet-callback?sessionId={session_id}&status={status}` where payment verification occurs.

## Program Offerings

Three specialized programs for neurodivergent learners:

1. **Roblox Math: Play to Learn Math**
   - $30/session or $480 for 16 weeks
   - Virtual small group tutoring (K-8th grade)

2. **Reading Tutoring Multi-Sensory Literacy Intervention**
   - $30/session or $480 for 16 weeks
   - Virtual enrichment (Pre-K-8)

3. **Summer Online Academic Training Camp**
   - $250/week or $2,500 for 10 weeks
   - Virtual daily camp (K-8, June-August 2026)

## Production Deployment Checklist

### ⚠️ CRITICAL: Session Storage

The current implementation uses **in-memory storage** which is **NOT suitable for production**. This is only for demonstration purposes.

**Why it won't work in production:**
- Netlify Functions are stateless
- Each function invocation may run on a different container
- Sessions are not shared between function instances
- Data will be lost when functions restart

**Production Solution:**
You MUST replace the in-memory Map with a persistent storage solution:

#### Option 1: Supabase (Recommended - Already in use)
```typescript
// Create a sessions table in Supabase
const { data: session } = await supabase
  .from('classwallet_sessions')
  .insert({
    session_id: sessionId,
    user_id: userId,
    user_email: userEmail,
    // ... other fields
  });
```

#### Option 2: Redis
```typescript
import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });
await redis.set(`session:${sessionId}`, JSON.stringify(sessionData), {
  EX: 3600 // 1 hour expiration
});
```

#### Option 3: DynamoDB
```typescript
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
const client = new DynamoDBClient({ region: 'us-east-1' });
await client.send(new PutItemCommand({
  TableName: 'ClassWalletSessions',
  Item: { sessionId: { S: sessionId }, ... }
}));
```

### Security Improvements

1. **✅ COMPLETED**: Use `crypto.randomUUID()` for session and order IDs
2. **TODO**: Implement session expiration and cleanup
3. **TODO**: Add request signature verification from ClassWallet
4. **TODO**: Implement rate limiting on callback endpoints
5. **TODO**: Add CSRF protection
6. **TODO**: Validate and sanitize all incoming data

### ClassWallet Configuration

1. **Get Vendor ID**
   - Sign up at https://www.classwallet.com/
   - Complete merchant verification
   - Obtain your Vendor ID from the dashboard

2. **Set Callback URL**
   - In ClassWallet dashboard, configure your callback URL
   - Production: `https://your-domain.com/.netlify/functions/classwallet-callback`
   - Staging: Use your Netlify preview URL

3. **Test in Sandbox**
   - ClassWallet provides a sandbox environment
   - Test the complete flow before going live
   - Verify payment confirmations are received correctly

### Monitoring and Logging

Add logging to all functions:
```typescript
console.log('Session created:', sessionId);
console.log('Payment received:', { sessionId, transactionId, status });
```

Set up error tracking:
- Use Sentry or similar service
- Monitor function execution times
- Track payment success/failure rates

### Database Schema (Supabase Example)

Create a `classwallet_sessions` table:

```sql
CREATE TABLE classwallet_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT,
  order_data JSONB,
  payment_confirmation JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  return_url TEXT,
  cancel_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '1 hour'
);

-- Index for fast lookups
CREATE INDEX idx_session_id ON classwallet_sessions(session_id);
CREATE INDEX idx_user_id ON classwallet_sessions(user_id);
CREATE INDEX idx_status ON classwallet_sessions(status);
```

## Testing

### Manual Testing Flow

1. Navigate to `/programs`
2. Select a program (e.g., Roblox Math)
3. Click "Enroll Now"
4. Choose a purchase option
5. Click "Complete Secure Checkout"
6. Verify redirect to ClassWallet checkout URL
7. (In production) Complete payment on ClassWallet
8. Verify callback receives payment confirmation
9. Verify redirect to success page

### Unit Tests (TODO)

Create tests for:
- Session creation
- Order data preparation
- Payment verification
- Error handling

## Support

For ClassWallet API support:
- Documentation: https://developers.classwallet.com/
- Support: Contact ClassWallet merchant support

For implementation questions:
- Contact: mariannav920@gmail.com

## License

This implementation is part of Mz. Marianna's Academy platform.
