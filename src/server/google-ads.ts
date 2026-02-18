import { google } from 'googleapis';

/**
 * Uploads an offline conversion to Google Ads.
 * Usage: Call this function when a conversion (e.g., payment) occurs or via a background job.
 */
export async function uploadOfflineConversion(params: {
    gclid: string;
    conversionValue: number;
    currencyCode: string;
    conversionTime?: string; // Format: 'yyyy-mm-dd hh:mm:ss+|-hh:mm'
    conversionActionId: string; // The ID of the conversion action in Google Ads
}) {
    // 1. Authenticate using Service Account or OAuth2 (Env vars required)
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/adwords'],
    });

    // 2. Note: Google Ads API is usually accessed via distinct client libraries or gRPC.
    // However, googleapis provides auth handling. 
    // We will construct the REST request manually if the specific API isn't in googleapis, 
    // or use the customer match/click conversion logic if available.

    // As of 2024/2025, the standard Google Ads API is not fully bundled in the 'googleapis' npm package 
    // in the same way Drive or Sheets are. We typically need to fetch correct endpoint.

    const client = await auth.getClient();
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID; // 123-456-7890

    if (!customerId) {
        throw new Error('GOOGLE_ADS_CUSTOMER_ID is not set');
    }

    const url = `https://googleads.googleapis.com/v17/customers/${customerId.replace(/-/g, '')}:uploadClickConversions`;

    const body = {
        conversions: [
            {
                gclid: params.gclid,
                conversionAction: `customers/${customerId.replace(/-/g, '')}/conversionActions/${params.conversionActionId}`,
                conversionDateTime: params.conversionTime || new Date().toISOString().replace('T', ' ').slice(0, 19) + '+00:00',
                conversionValue: params.conversionValue,
                currencyCode: params.currencyCode,
            }
        ],
        partialFailure: true,
    };

    const res = await client.request({
        url,
        method: 'POST',
        data: body,
    });

    return res.data;
}
