# Velora — Static Amazon Affiliate Storefront

Pure front-end. **No backend. No admin. No prices on site** — button opens Amazon for live price.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main page |
| `style.css` | Styles |
| `products.js` | **Edit products here** |
| `app.js` | UI logic |

## Product format (`products.js`)

```js
{
  "id": "B095T14D4S",
  "title": "Raycon Everyday Bluetooth Wireless Earbuds ...",
  "slug": "raycon-everyday-bluetooth-wireless-earbuds-black",
  "description": "Wireless Bluetooth earbuds with ANC...",
  "category": "electronics",
  "brand": "Raycon",
  "asin": "B095T14D4S",
  "image": "https://m.media-amazon.com/images/I/61FIBGir-IL._AC_SL1500_.jpg",
  "amazonUrl": "https://www.amazon.com/dp/B095T14D4S?tag=sheroztariq-20",
  "buttonText": "Check Price",
  "rating": 4.2,
  "reviewCount": 30859,
  "badge": "Amazon's Choice",
  "featured": true
}
```

- **No price field** — users click "Check Price" → Amazon
- Put your affiliate tag inside every `amazonUrl`
- `image` = product image URL (Amazon media or any HTTPS)
- `category` must be one of: electronics, fashion, home, beauty, sports, books, toys

## Deploy (GitHub Pages)

1. Upload these files to a repo
2. Settings → Pages → branch `main` / root
3. Live at `https://USER.github.io/REPO/`

Edit `products.js` → commit → push → everyone sees updates.
