/**
 * Process Form Submissions API Endpoint
 * Netlify Serverless Function
 * 
 * SECURITY: This endpoint uses a server-side Supabase client with service role key
 * to perform privileged operations (creating profiles, relationships, intake records).
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createServerSupabaseClient } from '../../src/lib/supabase/server-client';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Security check
  const authHeader = event.headers.authorization;
  const expectedAuth = `Bearer ${process.env.FORM_PROCESSING_SECRET}`;
  
  if (authHeader !== expectedAuth) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    // Import services (dynamic to avoid build issues)
    const { fetchNewSubmissions } = await import('../../api/_lib/google-sheets-service');
    const { processFormSubmission, isSubmissionProcessed } = await import('../../src/lib/services/form-processing-service');

    console.log('Starting form submission processing...');

    const lastRowNumber = parseInt(event.queryStringParameters?.lastRow || '0');
    const newSubmissions = await fetchNewSubmissions(lastRowNumber);
    
    console.log(`Found ${newSubmissions.length} new submissions`);

    if (newSubmissions.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'No new submissions to process',
          processed: 0,
        }),
      };
    }

    const results = {
      total: newSubmissions.length,
      processed: 0,
      skipped: 0,
      errors: [] as any[],
    };

    for (const submission of newSubmissions) {
      try {
        const alreadyProcessed = await isSubmissionProcessed(supabase, submission.rowNumber);
        if (alreadyProcessed) {
          results.skipped++;
          continue;
        }

        const result = await processFormSubmission(supabase, submission);
        
        if (result.success) {
          results.processed++;
        } else {
          results.skipped++;
        }
      } catch (error: any) {
        results.errors.push({
          rowNumber: submission.rowNumber,
          email: submission.email,
          error: error.message,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        results,
        message: `Processed ${results.processed} new submissions`,
      }),
    };

  } catch (error: any) {
    console.error('Error in form processing endpoint:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
    };
  }
};

export { handler };
