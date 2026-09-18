# Velora — GitHub Pages (No Backend)

Static Amazon affiliate product discovery storefront.

## Files
- `index.html` — page structure only
- `css/style.css` — all site styling
- `js/app.js` — catalog loading, search, filters, wishlist, bag and Amazon links
- `products.json` — product catalog (edit this file to add/update products)

## GitHub Pages
Keep the files/folders at the repository root:

```text
velora/
├── index.html
├── products.json
├── css/
│   └── style.css
└── js/
    └── app.js
```

In GitHub: **Settings → Pages → Deploy from branch → main → /(root)**.

After editing `products.json`, commit the change. GitHub Pages will publish the updated catalog.

## Important
Do not rename `css/style.css`, `js/app.js`, or `products.json` unless you also update the paths in `index.html` / `js/app.js`.
