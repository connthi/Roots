import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { toCSV } from '../services/csvHelper.js';
import { uploadUserCSV, uploadResult } from '../services/s3Service.js';
import { generateProfile } from '../services/bedrockService.js';

const router = Router();

/**
 * POST /api/analyze
 *
 * Receives survey data + quiz results, uploads CSV to S3,
 * calls Bedrock for a financial profile, uploads the result,
 * and returns the profile to the client.
 *
 * Body: {
 *   // Financial survey fields (placeholder — some may be empty)
 *   age, annual_income, monthly_rent, monthly_food, monthly_transport,
 *   monthly_entertainment, monthly_subscriptions, monthly_savings,
 *   debt_total, debt_monthly_payment, impulse_buy_frequency,
 *   budget_tracking, financial_goal, risk_tolerance,
 *
 *   // Quiz results (from the frontend personality quiz)
 *   personality_code, archetype_name, quiz_answers
 * }
 */
router.post('/', async (req, res) => {
  try {
    const surveyData = req.body;

    // Generate a unique user ID for this submission
    const userId = surveyData.user_id || `usr_${uuidv4().slice(0, 8)}`;
    const timestamp = new Date().toISOString();

    const enrichedData = {
      ...surveyData,
      user_id: userId,
      timestamp,
    };

    // 1. Convert to CSV and upload to S3
    let s3CsvResult = null;
    try {
      const csvString = toCSV(enrichedData);
      s3CsvResult = await uploadUserCSV(userId, csvString);
      console.log(`[S3] CSV uploaded: ${s3CsvResult.key}`);
    } catch (s3Err) {
      console.error('[S3] CSV upload failed (non-blocking):', s3Err.message);
      // Don't fail the whole request if S3 upload fails
    }

    // 2. Call Bedrock to generate the financial profile
    const profile = await generateProfile(enrichedData);

    // 3. Upload the Bedrock result to S3
    let s3ResultKey = null;
    try {
      const s3Result = await uploadResult(userId, {
        input: enrichedData,
        profile,
        generated_at: timestamp,
      });
      s3ResultKey = s3Result.key;
      console.log(`[S3] Result uploaded: ${s3ResultKey}`);
    } catch (s3Err) {
      console.error('[S3] Result upload failed (non-blocking):', s3Err.message);
    }

    // 4. Return the profile to the frontend
    res.json({
      user_id: userId,
      profile,
      s3: {
        csv: s3CsvResult?.key ?? null,
        result: s3ResultKey ?? null,
      },
    });
  } catch (err) {
    console.error('[analyze] Error:', err);
    res.status(500).json({
      error: 'Failed to generate financial profile',
      detail: err.message,
    });
  }
});

export default router;
