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

### 🧪 Stripe Test Mode Testing Credentials
Reviewers and testers can complete checkout using the standard Stripe test card:

| Field | Test Value |
| :--- | :--- |
| **Card Number** | `4242 4242 4242 4242` |
| **Expiration Date** | Any future date (e.g., `12/28`) |
| **CVC / CVV** | `123` |
| **Postal Code** | `90210` or any valid 5-digit code |

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
│   │   │   ├── ProfilePage.jsx     # /profile — user details & password update
│   │   │   ├── AboutPage.jsx       # /about — brand story & company mission
│   │   │   ├── ContactPage.jsx     # /contact — interactive support & contact form
│   │   │   ├── CartPage.jsx        # /cart — full-page cart fallback
│   │   │   ├── CheckoutPage.jsx    # Stripe checkout form
│   │   │   ├── OrderConfirmationPage.jsx # Order receipt with PDF download
│   │   │   └── OrderHistoryPage.jsx # Order list with PDF download & dual status badges
│   │   ├── utils/              # Client utilities (generateReceipt.js PDF generator)
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
└── README.md                   # Project documentation & design system
```
