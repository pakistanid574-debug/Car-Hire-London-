import glob
from datetime import datetime

# Aaj ki date nikalne ke liye (Format: YYYY-MM-DD)
today_date = datetime.utcnow().strftime('%Y-%m-%d')

# Sabhi .html files ko dhoondo aur sitemap banao
files = [f.replace(".html", "") for f in glob.glob("*.html") if f != "index.html"]

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

# Homepage ke liye with date
xml += f'    <url>\n        <loc>https://private-driver-no.vercel.app/</loc>\n        <lastmod>{today_date}</lastmod>\n        <priority>1.0</priority>\n    </url>\n'

# Baqi sabhi pages ke liye with date
for f in files:
    xml += f'    <url>\n        <loc>https://private-driver-no.vercel.app/{f}</loc>\n        <lastmod>{today_date}</lastmod>\n        <priority>0.8</priority>\n    </url>\n'

xml += '</urlset>'

with open("sitemap.xml", "w") as file:
    file.write(xml)

print("Sitemap Updated with Current Date!")
