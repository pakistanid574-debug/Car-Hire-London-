import glob

# Sabhi .html files ko dhoondo aur sitemap banao
files = [f.replace(".html", "") for f in glob.glob("*.html") if f != "index.html"]

xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml += '    <url><loc>https://private-driver-no.vercel.app/</loc><priority>1.0</priority></url>\n'

for f in files:
    xml += f'    <url><loc>https://private-driver-no.vercel.app/{f}</loc><priority>0.8</priority></url>\n'

xml += '</urlset>'

with open("sitemap.xml", "w") as file:
    file.write(xml)
print("Sitemap Updated!")
