# Small Basket backend

## Start the API

1. Copy `.env.example` to `.env` and set the database, JWT, email, and admin values. Use the admin email requested for this deployment and enter the admin password in this ignored local file.
2. Use an email provider's SMTP app password for `EMAIL_PASS`; do not use or commit an account password.
3. Create the first administrator account:

   ```powershell
   npm run seed:admin
   ```

   The script creates the configured admin only when that email does not already exist. It stores a password hash and never overwrites an existing admin. If the account already exists and you intentionally need to set its password from `ADMIN_PASSWORD`, use `npm run seed:admin:reset`.
4. Start the API:

   ```powershell
   npm start
   ```

For a database used by an older version of this app, run `npm run migrate:cart-index` once. It removes only the old unique index on cart product references, which otherwise prevents different customers from adding the same product.

To add the initial demo storefronts and grocery catalog, run `npm run seed:catalog`. This is safe to rerun: it refreshes the same 3 approved sample stores and their 12 products instead of creating duplicates. Demo product photos are served by Unsplash, so customer browsers need internet access to display them. Demo vendors are approved catalog examples; create actual seller accounts through the vendor application flow.

## Marketplace roles

- Customers sign in with the email OTP flow.
- Vendors apply through `POST /vendor/register`. Their status starts as `pending`; only an approved vendor can sign in and create products.
- Administrators sign in through `POST /admin/login`. Use the dashboard to approve or reject vendors and enable or disable customer accounts.
- Vendor product creation is protected at `POST /products/create`; the server stores the authenticated vendor as the product owner.

Never place admin credentials or SMTP secrets in frontend code, source control, or a committed environment file. If credentials have been shared outside the private deployment environment, rotate them.
