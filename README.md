# Akash & Shivangi Wedding

The wedding invitation runs on Next.js. Marriage Expense Manager owns the published invitation content. The original illustrations, videos, music, and animations are served from this repository.

## Local development

1. In Marriage Expense Manager, use the existing Firebase configuration for the backend and panel. Set `WEDDING_SITE_ADMIN_EMAIL` in the backend's environment to the verified Firebase sign-in email that will publish the site.
2. Install the manager's dependencies with `npm install` at the root and `npm --prefix client install`. Run `npm start` at the root for the API on port 3000, and `npm --prefix client run dev` for the admin panel. The Vite panel proxies API requests to port 3000.
3. In the wedding repository, copy `.env.example` to `.env.local`. Set `MARRIAGE_MANAGER_URL` to the manager API origin if it differs from the example. Run `npm install` and then `npm run dev -- --port 3001`. Open http://localhost:3001.
4. In the expense manager, choose **Wedding Website**, edit the invitation details, and select **Publish website changes**. Reload the wedding website to see the update.

For production, rebuild and deploy the expense manager's frontend with its API, then configure the deployed Next.js server with `MARRIAGE_MANAGER_URL`. The website uses its bundled invitation content if the manager API is unavailable. Event dates and times are entered and rendered in India Standard Time. Personalized RSVP links are still managed under **Guests** in the expense manager. General invitation RSVPs appear in Guests in Marriage Expense Manager.
