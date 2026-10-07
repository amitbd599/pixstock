# PixStock — Free Stock Image Website

Next.js 14 (App Router) · MongoDB/Mongoose · NextAuth (Credentials) · Cloudflare R2 · Sharp · Tailwind CSS

## লোকাল সেটআপ
```bash
npm install
cp .env.example .env.local        # ভ্যালু বসান
npm run create-admin -- admin@example.com 'StrongPass123' "Admin"
npm run dev
```
Admin: `/admin/login`

## Cloudflare R2
1. Bucket বানান, **Public access** (custom domain বা r2.dev) চালু করুন → `R2_PUBLIC_URL`
2. R2 API Token (Object Read & Write) বানান → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

## VPS ডিপ্লয় (Contabo + PM2 + OpenLiteSpeed/CyberPanel)
```bash
npm ci && npm run build
npm i -g pm2
pm2 start ecosystem.config.js && pm2 save && pm2 startup
```
OpenLiteSpeed-এ domain-এর জন্য **Proxy Context** (`/` → `http://127.0.0.1:3000`) বা Reverse Proxy সেট করুন। SSL চালু করুন।
Production `.env.local`-এ `NEXT_PUBLIC_APP_URL` ও `NEXTAUTH_URL` = আপনার live domain (https সহ), এবং `NEXTAUTH_SECRET` আলাদা শক্তিশালী ভ্যালু।
`.env` পরিবর্তন করলে (বিশেষ করে `NEXT_PUBLIC_*`) আবার `npm run build` দিন।

## AdSense
`NEXT_PUBLIC_ADSENSE_CLIENT` (ca-pub-xxx) ও `NEXT_PUBLIC_ADSENSE_SLOT` দিন। `/ads.txt` লাগলে `public/ads.txt` ফাইলে লাইনটি বসান।
