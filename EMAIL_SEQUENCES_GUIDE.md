# 📧 Behavioral Email Sequence Documentation

## Overview

Our platform includes intelligent behavioral email sequences that trigger based on user interactions and behavior. These sequences are designed to:

1. **Personalize the experience** based on student interests
2. **Provide value** through relevant resources and recommendations
3. **Drive conversions** through strategic book upsells
4. **Maintain engagement** with regular touchpoints

---

## Available Sequences

### 1. Math-Focused Sequence

**Trigger:** When a student shows interest in math (completes math challenges, scores high on math in placement quiz)

**Duration:** 15 days

**Schedule:**
- **Day 0:** Welcome & Introduction
- **Day 2:** Free Math Resources
- **Day 5:** Math Book Upsell (25% off "Math Doesn't Suck")
- **Day 8:** Math Challenge
- **Day 12:** Success Stories
- **Day 15:** Book Discount Reminder (last chance)

**Book Recommendation:**
- Title: "Math Doesn't Suck" by Danica McKellar
- Regular Price: $19.99
- Member Price: $14.99 (25% off)
- Why: Makes math accessible and fun for kids who struggle or excel

### 2. Warriors Sequence (Middle School)

**Trigger:** When a student is 11-18 years old (Warriors tier eligible)

**Duration:** 17 days

**Schedule:**
- **Day 0:** Warriors Path Welcome
- **Day 3:** What Makes Warriors Different
- **Day 6:** Warriors Book Upsell (28% off "Mindset")
- **Day 10:** Warriors Challenge
- **Day 14:** Success Stories
- **Day 17:** Book Discount Reminder

**Book Recommendation:**
- Title: "Mindset: The New Psychology of Success" by Carol Dweck
- Regular Price: $17.99
- Member Price: $12.99 (28% off)
- Why: Teaches growth mindset and resilience for teens

---

## Behavior Triggers

### Trigger Types

| Trigger | Description | Sequence Activated |
|---------|-------------|-------------------|
| `MATH_INTEREST` | Completes math challenges, high math quiz score | Math Sequence |
| `WARRIORS_ELIGIBLE` | Age 11-18, middle school tier | Warriors Sequence |
| `PLACEMENT_QUIZ_COMPLETED` | Finishes placement quiz | Based on age & results |
| `FIRST_QUEST_COMPLETED` | Completes first quest | Based on subject |
| `SUBSCRIPTION_STARTED` | Subscribes to paid plan | Based on tier/age |
| `HIGH_ENGAGEMENT` | Completes 10+ challenges | Based on most engaged subject |

### How to Track Behavior

```typescript
import { trackBehaviorAndTriggerSequence, BehaviorTrigger } from './lib/email/behavioral-dispatcher';

// Example: Track when student completes math challenge
await trackBehaviorAndTriggerSequence(
  userId,
  BehaviorTrigger.MATH_INTEREST,
  { challengeId: challenge.id, subject: 'math' }
);

// Example: Track placement quiz completion
await trackBehaviorAndTriggerSequence(
  userId,
  BehaviorTrigger.PLACEMENT_QUIZ_COMPLETED,
  { score: quizResults.score, tier: quizResults.tier }
);
```

---

## Email Templates

### Template Structure

All email templates follow a consistent structure:

1. **Header**: Gradient background with emoji/icon
2. **Greeting**: Personalized with student's name
3. **Value Content**: Resources, tips, or stories
4. **Call-to-Action**: Clear next step
5. **Footer**: Unsubscribe link

### Personalization Variables

- `{studentName}` - Student's first name
- `{parentEmail}` - Parent's email address
- `{mathLevel}` - beginner/intermediate/advanced
- `{age}` - Student's age
- `{tier}` - explorers/warriors/scholars/legend
- `{interests}` - Array of student interests

### Book Upsell Strategy

**Math Sequence (Day 5 & Day 15):**
- First mention: "We have the perfect book recommendation"
- Showcase: Social proof, testimonial, features
- Pricing: Show discount (Regular $19.99 → $14.99)
- CTA: "Get the Book for {studentName}"
- Reminder: "Your 25% discount expires tomorrow"

**Warriors Sequence (Day 6 & Day 17):**
- First mention: "The book every Warrior needs"
- Showcase: Why mindset matters for teens
- Pricing: Show discount (Regular $17.99 → $12.99)
- CTA: "Get the Book"
- Reminder: "Warrior discount ends tomorrow"

---

## Implementation

### Database Schema

```sql
-- Email sequences tracking
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  sequence_type TEXT NOT NULL, -- 'math', 'warriors', etc.
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  current_day INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  last_email_sent_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- User behaviors tracking
CREATE TABLE user_behaviors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  behavior_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_sequences_user ON email_sequences(user_id);
CREATE INDEX idx_email_sequences_status ON email_sequences(status);
CREATE INDEX idx_user_behaviors_user ON user_behaviors(user_id);
CREATE INDEX idx_user_behaviors_type ON user_behaviors(behavior_type);
```

### Cron Job Setup

Set up a daily cron job to process scheduled emails:

```bash
# Netlify cron (netlify.toml)
[[functions."process-email-sequences"]]
  schedule = "0 9 * * *"  # Run daily at 9 AM UTC

# Or use GitHub Actions
# .github/workflows/email-sequences.yml
name: Process Email Sequences
on:
  schedule:
    - cron: "0 9 * * *"  # Daily at 9 AM UTC
```

**Function:**
```typescript
// netlify/functions/process-email-sequences.ts
import { processScheduledSequenceEmails } from '../../src/lib/email/behavioral-dispatcher';

export async function handler() {
  await processScheduledSequenceEmails();
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
}
```

---

## Testing

### Test a Sequence

```typescript
// Manually trigger math sequence for testing
import { trackBehaviorAndTriggerSequence, BehaviorTrigger } from './lib/email/behavioral-dispatcher';

await trackBehaviorAndTriggerSequence(
  'test-user-id',
  BehaviorTrigger.MATH_INTEREST
);
```

### Test Individual Email

```typescript
import { sendMathSequenceEmail } from './lib/email/sequences/math-sequence';

await sendMathSequenceEmail(
  {
    studentName: 'Alex',
    parentEmail: 'parent@example.com',
    mathLevel: 'intermediate',
    interests: ['math', 'puzzles'],
  },
  0 // Day number
);
```

### Check Scheduled Emails

```typescript
import { processScheduledSequenceEmails } from './lib/email/behavioral-dispatcher';

// Manually run the scheduler
await processScheduledSequenceEmails();
```

---

## Best Practices

### 1. Respect User Preferences

Always check email preferences before sending:

```typescript
const { data: preferences } = await supabase
  .from('email_preferences')
  .select('*')
  .eq('user_id', userId)
  .single();

if (preferences?.weekly_digest_enabled === false) {
  // Don't send
}
```

### 2. Avoid Duplicate Sequences

Check if user is already in a sequence:

```typescript
const { data: existing } = await supabase
  .from('email_sequences')
  .select('*')
  .eq('user_id', userId)
  .eq('sequence_type', 'math')
  .eq('status', 'active')
  .single();

if (existing) {
  console.log('User already in sequence');
  return;
}
```

### 3. Monitor Metrics

Track key metrics:
- **Open Rate**: % of emails opened
- **Click Rate**: % who click links
- **Conversion Rate**: % who purchase books
- **Unsubscribe Rate**: % who unsubscribe

### 4. A/B Testing

Test different subject lines, timing, and content:

```typescript
// Example: Test subject lines
const subjectLines = [
  `🔢 ${studentName} is on a Math Adventure!`,
  `${studentName}'s Math Journey Starts Here 🚀`,
];

const randomSubject = subjectLines[Math.floor(Math.random() * subjectLines.length)];
```

---

## Monitoring & Analytics

### Email Sequence Dashboard

Track sequence performance:
- Total sequences active
- Emails sent today
- Conversion rate by sequence
- Most popular triggers

### Reports to Build

1. **Sequence Performance Report**
   - Sequences started
   - Completion rate
   - Revenue per sequence

2. **Book Sales Report**
   - Sales by sequence
   - Conversion rate by book
   - Revenue by discount tier

3. **Behavior Triggers Report**
   - Most common triggers
   - Trigger → sequence mapping
   - Effectiveness by trigger type

---

## Troubleshooting

### Emails Not Sending

1. Check Resend API key is configured
2. Verify Supabase Edge Function is deployed
3. Check email queue table for errors
4. Verify email preferences allow sending

### Sequence Not Triggering

1. Check behavior trigger is being called
2. Verify user profile exists
3. Check user isn't already in sequence
4. Verify trigger conditions are met (age, tier, etc.)

### Wrong Sequence Activated

1. Check trigger logic in `behavioral-dispatcher.ts`
2. Verify user age/tier is correct
3. Check sequence eligibility conditions

---

## Future Enhancements

### Planned Features

- [ ] Advanced segmentation (by location, engagement level, parent type)
- [ ] Dynamic content based on user progress
- [ ] Video email content
- [ ] SMS sequences for urgent notifications
- [ ] WhatsApp integration
- [ ] Multi-language support
- [ ] Parent vs. student sequences (different content)
- [ ] Re-engagement campaigns for churned users

---

## Support

Questions about email sequences?
- Email: mariannav920@gmail.com
- Docs: See `API_INTEGRATION_GUIDE.md` for email service setup

---

**Last Updated:** February 2026
