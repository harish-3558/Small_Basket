# Small Basket

**Small Basket is a grocery marketplace connecting customers with approved local vendors.**

Customers browse and buy groceries from different stores. Vendors apply to join and can list products after an administrator approves their account. Administrators review vendor applications and manage customer access.

## Marketplace workflow

```text
Vendor applies → Admin approves vendor → Vendor lists products
       → Customer shops and places an order → Vendor fulfils the order
```

### Account types

- **Customer:** Sign in with email OTP, browse products, use a cart, place orders, and check order progress.
- **Vendor:** Apply for an account, wait for approval, add products with photos and prices, and manage order fulfilment.
- **Admin:** Approve or reject vendors and enable or disable customer accounts.

## Technology

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Email:** SMTP for customer OTP sign-in

## Install from GitHub

After creating the GitHub repository, replace `<your-github-username>` below with your GitHub username or organization name. Keep the repository name as `MERN_Grocery_App` or update it in the clone command.

```powershell
git clone https://github.com/<your-github-username>/MERN_Grocery_App.git
cd MERN_Grocery_App
```

Install the backend and frontend dependencies:

```powershell
cd backend
npm install
cd ..\frontend
npm install
cd ..
```

## Configure and run

### 1. Start MongoDB and configure the backend

Create a private backend environment file:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend/.env` with your own MongoDB connection string, a strong JWT secret, SMTP credentials, and administrator name, email, and password. **Never commit or share this file.**

Create the first admin account and start the API:

```powershell
cd backend
npm run seed:admin
npm start
```

The API uses `http://localhost:3000` by default. Leave this terminal running.

### 2. Start the frontend

Open a second terminal in the project folder:

```powershell
cd frontend
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. The frontend connects to `http://localhost:3000` by default. To use another API address, set `VITE_API_BASE_URL` in `frontend/.env.local`.

### 3. Load sample products (optional)

With MongoDB configured, seed three approved demo stores and twelve sample grocery products:

```powershell
cd backend
npm run seed:catalog
```

The sample product photos are hosted by Unsplash and require an internet connection.

## Frontend checks

```powershell
cd frontend
npm run lint
npm run build
```

## Current limitations

- OTP sign-in requires valid SMTP configuration.
- Checkout records an order but does not process payments or collect delivery addresses.

