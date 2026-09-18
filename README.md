# Velora — GitHub-only product catalog

No backend, no database, no admin panel, and no Vercel dependency. The website reads products from `products.json` in this GitHub repository.

## Add a product
Edit `products.json` on GitHub and add an object like:

```json
{
  "title": "Product name",
  "slug": "product-name",
  "description": "Short description",
  "category": "electronics",
  "brand": "Brand",
  "image": "https://example.com/product.jpg",
  "amazonUrl": "https://www.amazon.com/dp/PRODUCTID/?tag=YOURTAG-20",
  "buttonText": "Check Price",
  "rating": 4.7,
  "reviewCount": 1200,
  "badge": "Best Seller",
  "featured": true
}
```

There is no price field. The product card uses `buttonText` and sends visitors to `amazonUrl`.

## Images
Use a publicly reachable image URL in `image`. You can also store images in this repository, for example `images/product-1.jpg`, and use `/images/product-1.jpg`.

## GitHub-only workflow
1. Create/open your GitHub repository.
2. Upload `index.html` and `products.json` (and optionally an `images/` folder).
3. Whenever you want to add or change products, open `products.json` on GitHub.
4. Click the pencil/Edit button, update the JSON, then click **Commit changes**.
5. Your GitHub-hosted copy will contain the updated catalog. If you later connect this repository to any static hosting service, that service can publish the same files automatically.

## Important
GitHub Pages is optional. This repository itself is the source of truth for the catalog. GitHub does not execute the site as a live web server unless you enable a hosting feature such as GitHub Pages.

Do not put private API keys, passwords, tokens, or other secrets in `products.json` or `index.html`.
