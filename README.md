# Blurra - Professional Screen Privacy

Blurra is a high-performance browser extension designed for professionals who share their screens. It allows you to instantly blur sensitive data, PII, or entire sections of a webpage with a single click or draw.

## features

- **One-Click Element Blur**: Hover over any HTML element and click to blur it instantly.
- **Precision Text Blur**: Highlight text to blur specific fragments.
- **Area selection Blur**: Draw rectangles to blur custom regions.
- **Persistence**: Blurs stay active across page reloads (configurable).
- **Pro Licensing System**: Built-in Stripe integration with activation key generation.

## Full-Stack Architecture

This project is a full-stack application built with:
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons + Motion.
- **Backend**: Express.js (serving API and Lemon Squeezy webhooks).
- **Database**: Firebase Firestore (for license management).
- **Payments**: Lemon Squeezy (Webhook processing).
- **Email**: Resend (Automated delivery of license keys).

## Setup & installation

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials. See the [Environment Variables](#environment-variables) section for details.

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Once the server is running, open [http://localhost:3000](http://localhost:3000) in your browser. (Note: `0.0.0.0` in the logs is for the server binding; use `localhost` for navigation).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Your Lemon Squeezy Webhook signing secret. |
| `LEMON_SQUEEZY_API_KEY` | Your Lemon Squeezy API Key. |
| `RESEND_API_KEY` | API Key from Resend.com for sending emails. |
| `BASE_URL` | The public URL of your app (used for success redirects). |
| `FIREBASE_SERVICE_ACCOUNT` | The full JSON string of your Firebase Service Account key. |

## Extension Setup

To load the extension into your browser:
1. Go to `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked".
4. Select the `public/extension` folder from this repository.

## Deployment

The application is configured to run on platforms like Render, Railway, or Vercel. 
- Ensure `NODE_ENV` is set to `production`.
- The server automatically serves the build production frontend from the `dist/` folder.

## License

MIT © Blurra Team
