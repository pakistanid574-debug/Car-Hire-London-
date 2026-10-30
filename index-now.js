const { google } = require('googleapis');
const https = require('https');

// Apni website ka sitemap URL yahan daalein
const SITEMAP_URL = 'https://private-driver-no.vercel.app/sitemap.xml';

// GitHub Secret se JSON Key read karna
const serviceAccountKey = process.env.GSC_JSON_KEY;

if (!serviceAccountKey) {
  console.error("Error: GSC_JSON_KEY environment variable is missing!");
  process.exit(1);
}

// Google Auth Setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(serviceAccountKey),
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const indexing = google.indexing({ version: 'v3', auth });

// Sitemap.xml se URLs fetch karne ka function
function fetchSitemapUrls(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          // Simple regex se sitemap ke <loc> tags ke andar wale URLs nikalna
          const urlRegex = /<loc>(.*?)<\/loc>/g;
          let urls = [];
          let match;
          while ((match = urlRegex.exec(data)) !== null) {
            urls.push(match[1]);
          }
          resolve(urls);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => { reject(err); });
  });
}

async function requestIndexing() {
  try {
    console.log(`Fetching URLs from sitemap: ${SITEMAP_URL}`);
    const urls = await fetchSitemapUrls(SITEMAP_URL);
    
    if (urls.length === 0) {
      console.log("No URLs found in the sitemap.");
      return;
    }

    console.log(`Found ${urls.length} URLs. Sending to Google Indexing API...`);

    for (const url of urls) {
      try {
        const res = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`Successfully pushed: ${url}`);
      } catch (error) {
        console.error(`Error indexing ${url}:`, error.message);
      }
    }
    console.log("All sitemap URLs processed successfully!");
  } catch (error) {
    console.error("Failed to process sitemap:", error.message);
  }
}

requestIndexing();
