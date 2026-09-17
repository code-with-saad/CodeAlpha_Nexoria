# Nexoria — E-commerce Store

**Nexoria** is a modern, full-stack MERN e-commerce web application engineered for speed, high visual polish, and seamless online shopping experiences. It features a curated product catalog, shopping cart, secure authentication, order lifecycle tracking, and an administrative management dashboard.

---

## 🚀 Tech Stack

### Frontend (`/client`)
- **React 19** with **Vite** — High-performance frontend toolchain
- **React Router DOM** — Client-side declarative routing
- **Axios** — Promise-based HTTP client with Bearer token interceptor
- **React Context API** — Global state management (`AuthContext`, `ToastContext`)
- **Vanilla CSS / Modern CSS Variables** — Design token-driven architecture

### Backend (`/server`)
- **Node.js** & **Express.js** — RESTful API web server framework
- **MongoDB** & **Mongoose** — Document-oriented database & object modeling
- **JSON Web Token (JWT)** & **bcryptjs** — Stateless authentication and password hashing
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

### Product Endpoints (`/api/products`)

| Method | Endpoint | Access | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (with search/filter) | Query: `?search=term&category=Electronics` |
| `GET` | `/api/products/:id` | Public | Get single product by ID | None |
| `POST` | `/api/products` | Private / Admin | Create a new product | `{ "name": "...", "description": "...", "price": 99.99, "image": "...", "category": "...", "stock": 10 }` |
| `PUT` | `/api/products/:id` | Private / Admin | Update product fields | Partial or full product object |
| `DELETE` | `/api/products/:id` | Private / Admin | Remove a product | None |

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
│   │   ├── components/         # Reusable UI components (Navbar, Footer)
│   │   ├── context/            # Global React Contexts (AuthContext, ToastContext)
│   │   ├── pages/              # Routed view pages (Home, Products, Details, Login, Register, Cart)
│   │   ├── services/           # Axios instance & HTTP interceptors (api.js)
│   │   ├── App.jsx             # React Router routing skeleton & Context Providers
│   │   ├── index.css           # Design tokens, toast animations, skeletons & CSS layout
│   │   └── main.jsx            # Entry point
│   ├── index.html              # HTML entry point with Google Fonts
│   ├── package.json            # Client dependencies & scripts
│   └── vite.config.js          # Vite build configuration
├── server/                     # Backend Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection helper
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, and profile handlers
│   │   └── productController.js# Product CRUD & search/filter handlers
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication & admin authorization
│   │   └── errorMiddleware.js  # Centralized error handler & 404 response
│   ├── models/
│   │   ├── User.js             # User Mongoose schema with bcrypt hashing
│   │   ├── Product.js          # Product Mongoose schema with text indexing
│   │   └── Order.js            # Order Mongoose schema with items & shipping address
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── productRoutes.js    # Product endpoints
│   ├── utils/
│   │   └── generateToken.js    # JWT token signer
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Server dependencies & scripts
│   └── server.js               # Server entry point
├── .gitignore                  # Git ignore rules for MERN
├── PROGRESS.md                 # Project phase tracker with live status
└── README.md                   # Project documentation & design system
```
