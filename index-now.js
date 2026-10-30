const { google } = require('googleapis');

// GitHub Secret se JSON Key read karna
const serviceAccountKey = process.env.GSC_JSON_KEY;

if (!serviceAccountKey) {
  console.error("Error: GSC_JSON_KEY environment variable is missing!");
  process.exit(1);
}

// JSON parse karke Auth setup karna
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(serviceAccountKey),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({ version: 'v3', auth });

async function requestIndexing() {
  // Aapke URLs ki list yahan aayegi
  const urls = [
    'https://private-driver-no.vercel.app/'
  ];

  for (const url of urls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`Successfully pushed: ${url}`, res.data);
    } catch (error) {
      console.error(`Error indexing ${url}:`, error.message);
    }
  }
}

requestIndexing();
