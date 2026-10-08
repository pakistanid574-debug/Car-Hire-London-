import glob
from datetime import datetime

# Aaj ki date nikalne ke liye (Format: YYYY-MM-DD)
today_date = datetime.utcnow().strftime('%Y-%m-%d')

# Yahan wo files likhein jo aap sitemap mein NAHI chahte (jaise 404, testing, ya private pages)
EXCLUDE_FILES = [
    "index",         # Index ko hum alag se handle karenge niche
    "404",           # Agar koi 404 page ho
    "test",          # Koi testing page ho toh
    "privacy-policy" # Agar aap isko sitemap se hatana chahein (optional)
]

# Sabhi .html files ko dhoondo (extension hata kar)
all_files = [f.replace(".html", "") for f in glob.glob("*.html")]

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

# 1. Homepage (Sabse high priority)
xml += f'    <url>\n        <loc>https://private-driver-no.vercel.app/</loc>\n        <lastmod>{today_date}</lastmod>\n        <changefreq>daily</changefreq>\n        <priority>1.0</priority>\n    </url>\n'

# 2. Baqi sabhi valid pages (Exclude list ko chhor kar)
for f in all_files:
    if f not in EXCLUDE_FILES:
        # Aap chahein toh kuch khaas pages ki priority high ya low set kar sakte hain
        priority = "0.8"
        changefreq = "weekly"
        
        xml += f'    <url>\n        <loc>https://private-driver-no.vercel.app/{f}</loc>\n        <lastmod>{today_date}</lastmod>\n        <changefreq>{changefreq}</changefreq>\n        <priority>{priority}</priority>\n    </url>\n'

xml += '</urlset>'

# Sitemap file ko save karna
with open("sitemap.xml", "w") as file:
    file.write(xml)

print("Advanced Sitemap Updated Successfully with Exclude List!")
