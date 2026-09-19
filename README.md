# Nexoria — E-commerce Store

**Nexoria** is a modern, full-stack MERN e-commerce web application engineered for speed, high visual polish, and seamless online shopping experiences. It features a curated product catalog, a slide-in cart drawer, a dedicated wishlist page, secure authentication, Stripe-powered checkout, order lifecycle tracking, related product recommendations, scroll-triggered count-up animations, and an administrative management dashboard.

---

## 🚀 Tech Stack

### Frontend (`/client`)
- **React 19** with **Vite** — High-performance frontend toolchain
- **React Router DOM** — Client-side declarative routing
- **Axios** — Promise-based HTTP client with Bearer token interceptor
- **React Context API** — Global state management (`AuthContext`, `CartContext`, `ToastContext`)
- **Vanilla CSS / Modern CSS Variables** — Design token-driven architecture

### Backend (`/server`)
- **Node.js** & **Express.js** — RESTful API web server framework
- **MongoDB** & **Mongoose** — Document-oriented database & object modeling
- **JSON Web Token (JWT)** & **bcryptjs** — Stateless authentication and password hashing
- **Stripe SDK** — PaymentIntent handling & secure card checkout
- **CORS** & **dotenv** — Cross-origin resource sharing & environment configuration

---

## 🔐 How Authentication Works

Nexoria uses a stateless JSON Web Token (JWT) architecture:

```text
[User Form] ──(POST /api/auth/login or register)──▶ [Express Server]
                                                            │
                                                     [Validate & Hash]
                                                            │
[AuthContext / localStorage] ◀──(JWT + User Payload)───────┘
            │
    [Axios Interceptor]
            │
(Attach Bearer <token>)
            │
            ▼
[Protected Endpoints] ──▶ [authMiddleware (protect/admin)] ──▶ [Controller Action]
```

1. **Registration & Login**: User submits credentials to `POST /api/auth/register` or `POST /api/auth/login`.
2. **Password Verification**: `bcryptjs` hashes passwords on save or validates them via `matchPassword()`.
3. **JWT Issuance**: Server generates a signed JWT (30-day expiry) containing the user `_id`.
4. **Client-Side Persistence**: `AuthContext` receives the token and user payload, storing them in `localStorage` (`nexoria_token`, `nexoria_user`).
5. **Automatic Request Header Injection**: An Axios request interceptor (`api.js`) automatically attaches `Authorization: Bearer <token>` to all outgoing requests.
6. **Protected Route Authorization**: Server-side `protect` middleware verifies the token and attaches `req.user`. `admin` middleware enforces role restrictions for administrative actions.
7. **Session Expiry & Logout**: If a protected request returns `401 Unauthorized`, the interceptor clears local storage and dispatches a `nexoria-logout` event to reset `AuthContext`.

---

## 💳 How Payment & Order Flow Works (Frontend-Backend-Stripe)

```text
[CartPage] ──▶ [Proceed to Checkout]
                      │
                      ▼
[CheckoutPage] ──(Fill Shipping Address & Card)
                      │
                      ├─▶ 1. POST /api/orders (Create order with items & shipping)
                      │          │ (Returns createdOrder with _id)
                      │          ▼
                      ├─▶ 2. POST /api/orders/create-payment-intent (Amount in cents)
                      │          │ (Returns Stripe clientSecret & paymentIntentId)
                      │          ▼
                      ├─▶ 3. Stripe Payment Authorization
                      │          │ (Confirms transaction)
                      │          ▼
                      └─▶ 4. PUT /api/orders/:id/pay (Mark order isPaid=true)
                                 │
                                 ▼
                     [OrderConfirmationPage] (Display receipt & order summary)
```

### 🧪 Stripe Test Mode Testing Credentials
Reviewers and testers can complete checkout using the standard Stripe test card:

| Field | Test Value |
| :--- | :--- |
| **Card Number** | `4242 4242 4242 4242` |
| **Expiration Date** | Any future date (e.g., `12/28`) |
| **CVC / CVV** | `123` |
| **Postal Code** | `90210` or any valid 5-digit code |

---

## 🎨 Design System (Generated via `ui-ux-pro-max`)

The design system for **Nexoria** is crafted for high-trust e-commerce conversions with an energetic, modern aesthetic.

### 1. Landing Page Pattern: **Feature-Rich Showcase**
- **Structure**:
  1. **Hero Section**: High-impact value proposition with clear primary CTA.
  2. **Feature & Category Grid**: 4–6 responsive cards spotlighting top collections & deals.
  3. **Curated Showcase / Benefits**: Fast delivery, authenticity guarantee, seamless returns.
  4. **Social Proof / Customer Reviews**: Verified buyer ratings and trust badges.
  5. **Final CTA & Newsletter**: Retention and conversion trigger.
- **Conversion Strategy**: Sticky header navigation, strategic CTA repetition, and distraction-free checkout funnel.

### 2. Color Palette

| Token | CSS Variable | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary** | `--color-primary` | `#059669` | Brand identity, trust accents, active states |
| **Secondary** | `--color-secondary` | `#10B981` | Highlights, badges, secondary actions |
| **Accent / CTA** | `--color-accent` | `#EA580C` | High-urgency buttons ("Add to Cart", "Buy Now", promotions) |
| **Background** | `--color-background` | `#ECFDF5` / `#0B132B` (Dark) | Page background |
| **Foreground / Text** | `--color-foreground` | `#064E3B` / `#F8FAFC` (Dark) | Primary body text |
| **Surface / Card** | `--color-card` | `#FFFFFF` / `#1E293B` (Dark) | Elevated cards and containers |
| **Muted** | `--color-muted` | `#E8F1F3` / `#334155` (Dark) | Borders, disabled states, subtle backgrounds |
| **Destructive / Alert**| `--color-destructive` | `#DC2626` | Errors, removals, cancellation alerts |

### 3. Typography Pairing
- **Headings**: `Rubik` (Weights: 500, 600, 700) — Bold, geometric, clean modern commerce aesthetic.
- **Body & Subtext**: `Nunito Sans` (Weights: 300, 400, 500, 600) — Highly legible and open proportions for product titles, descriptions, and pricing tables.
- **Google Fonts Import**:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;500;600;700&family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ```

### 4. Toast Notification System
- Custom `ToastContext` supporting `success`, `error`, `warning`, and `info` alerts.
- **Pause-on-Hover**: Timers and animated progress bars pause on hover and seamlessly resume on mouse leave.
- Zero browser `alert()` or `confirm()` dialogs.

---

## 📡 API Endpoints Reference

All API routes return uniform JSON payloads with `{ success: true|false, ... }`.

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user | `{ "name": "...", "email": "...", "password": "...", "role": "user" }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & get JWT | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/profile` | Protected (`Bearer <token>`) | Get logged-in user profile | None |
| `PUT` | `/api/auth/profile` | Protected (`Bearer <token>`) | Update user profile & password | `{ "name": "...", "email": "...", "currentPassword": "...", "newPassword": "..." }` |

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (with search/filter) | Query: `?search=term&category=Electronics` |
| `GET` | `/api/products/:id` | Public | Get single product by ID | None |
| `POST` | `/api/products` | Private / Admin | Create a new product | `{ "name": "...", "description": "...", "price": 99.99, "image": "...", "category": "...", "stock": 10 }` |
| `PUT` | `/api/products/:id` | Private / Admin | Update product fields | Partial or full product object |
| `DELETE` | `/api/products/:id` | Private / Admin | Remove a product | None |

### Order & Payment Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected (`Bearer <token>`) | Create order from cart items | `{ "orderItems": [...], "shippingAddress": {...}, "totalAmount": 159.99 }` |
| `POST` | `/api/orders/create-payment-intent` | Protected (`Bearer <token>`) | Create Stripe PaymentIntent | `{ "amount": 159.99, "currency": "usd" }` |
| `GET` | `/api/orders/myorders` | Protected (`Bearer <token>`) | Get user order history | None |
| `GET` | `/api/orders/:id` | Protected (`Bearer <token>`) | Get order detail by ID | None |
| `PUT` | `/api/orders/:id/pay` | Protected (`Bearer <token>`) | Mark order as paid | `{ "id": "pi_...", "status": "succeeded" }` |

---

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Nexoria
```

### 2. Backend Setup (`/server`)
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@nexoria-cluster.jbp9aug.mongodb.net/nexoria_db?appName=Nexoria-Cluster
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NODE_ENV=development
```
Start the backend server:
```bash
# Development mode with hot-reloading
npm run dev

# Production start
npm start
```

### 3. Frontend Setup (`/client`)
```bash
cd ../client
npm install
```
Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📁 Repository Structure
```text
Nexoria/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static public assets
│   ├── src/                    # React source code (components, pages, styles)
│   │   ├── components/         # Reusable UI components (Navbar, Footer, CartDrawer)
│   │   ├── context/            # Global React Contexts (AuthContext, CartContext, ToastContext)
│   │   ├── pages/              # Routed view pages
│   │   │   ├── HomePage.jsx        # Landing, featured products, count-up stats
│   │   │   ├── ProductsPage.jsx    # Catalog with search, category filter, items-per-page
│   │   │   ├── ProductDetailPage.jsx # Product detail + related products section
│   │   │   ├── WishlistPage.jsx    # /wishlist — saved items with Move-to-Cart action
│   │   │   ├── CartPage.jsx        # /cart — full-page cart fallback
│   │   │   ├── CheckoutPage.jsx    # Stripe checkout form
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   └── OrderHistoryPage.jsx # Order list with thumbnails & dual status badges
│   │   ├── services/           # Axios instance & HTTP interceptors (api.js)
│   │   ├── App.jsx             # React Router routing skeleton & Context Providers
│   │   ├── index.css           # Design tokens, cart drawer, toast, skeletons & layout
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML entry point with Google Fonts
│   ├── package.json            # Client dependencies & scripts
│   └── vite.config.js          # Vite build configuration
├── server/                     # Backend Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection helper
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, and profile handlers
│   │   ├── productController.js# Product CRUD & search/filter handlers
│   │   └── orderController.js  # Order processing & Stripe PaymentIntent handlers
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication & admin authorization
│   │   └── errorMiddleware.js  # Centralized error handler & 404 response
│   ├── models/
│   │   ├── User.js             # User Mongoose schema with bcrypt hashing
│   │   ├── Product.js          # Product Mongoose schema with text indexing
│   │   └── Order.js            # Order Mongoose schema with items & shipping address
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── productRoutes.js    # Product endpoints
│   │   └── orderRoutes.js      # Order & Stripe endpoints
│   ├── utils/
│   │   └── generateToken.js    # JWT token signer
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Server entry point
├── .gitignore                  # Git ignore rules for MERN
├── PROGRESS.md                 # Project phase tracker with live status
└── README.md                   # Project documentation & design system
```
