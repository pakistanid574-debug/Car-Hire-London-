const { google } = require('googleapis');

// GitHub Secrets se key read karega
const keyData = process.env.GSC_JSON_KEY ? JSON.parse(process.env.GSC_JSON_KEY) : null;

if (!keyData) {
  console.error('GSC_JSON_KEY environment variable is missing!');
  process.exit(1);
}

const jwtClient = new google.auth.JWT(
  keyData.client_email,
  null,
  keyData.private_key,
  ['https://www.googleapis.com/auth/indexing'],
  null
);

// Yahan apne wo URLs dalein jinhe Google par instant index karwana hai
const urlsToIndex = [
  'https://private-driver-no.vercel.app/',
  'https://private-driver-no.vercel.app/chauffeur-service-london',
  'https://private-driver-no.vercel.app/wedding-chauffeur-london'
];

jwtClient.authorize(async (err, tokens) => {
  if (err) {
    console.error('Authentication Error:', err);
    return;
  }

  for (const url of urlsToIndex) {
    try {
      const response = await fetch('https://indexing.googleapis.com/v1/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access_token}`
        },
        body: JSON.stringify({
          url: url,
          type: 'URL_UPDATED'
        })
      });

      const data = await response.json();
      console.log(`Successfully pushed ${url}:`, data);
    } catch (error) {
      console.error(`Failed to push ${url}:`, error);
    }
  }
});
