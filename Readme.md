# Book My Ticket

A full-stack ticket booking application built with TypeScript, React, Vite, Node.js, Express, and PostgreSQL. The project includes user authentication, admin management, email verification, password reset, seat booking, and Razorpay payment integration.

## 📁 Project Structure

- `client/` - frontend application built with React, Vite, TypeScript, Tailwind CSS, and Redux Toolkit.
- `server/` - backend API built with Express, TypeScript, Drizzle ORM, PostgreSQL, JWT auth, and payment/email integrations.

## 🚀 Features

- User registration, login, and email verification
- Admin authentication and protected admin routes
- Show and seat management for movie booking
- Secure JWT authentication with refresh token support
- Password reset via email
- Payment integration using Razorpay
- Image upload support via Cloudinary
- PostgreSQL database with Drizzle ORM and migrations

## 🛠️ Tech Stack

- Frontend: React 18, TypeScript, Vite, Redux Toolkit, React Router Dom, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Drizzle ORM, PostgreSQL
- Authentication: JWT, bcrypt
- Email: Nodemailer (Gmail service)
- Payment: Razorpay
- Media: Cloudinary
- File handling: Multer
- Validation: Zod

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone https://github.com/amansaluja017/book-my-ticket.git
cd book-my-ticket
```

### 2. Configure the backend environment

Create a `.env` file inside `server/` with the following variables:

```env
PORT=5000
DATABASE_URL=database_url
CLIENT_API=http://localhost:5173
JWT_ACCESSTOKEN_SECRET=your_access_secret
JWT_REFRESHTOKEN_SECRET=your_refresh_secret
JWT_ACCESSTOKEN_EXPIRES=15m
JWT_REFRESHTOKEN_EXPIRES=1d
NODEMAILER_USER=your-email@gmail.com
NODEMAILER_PASS=your-email-password-or-app-password
CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_KEY_SECRET=your_cloudinary_api_secret
ROZARPAY_TEST_API_KEY=your_razorpay_key
ROZARPAY_TEST_API_KEY_SECRET=your_razorpay_secret
```

### 3. Start PostgreSQL using Docker Compose

```bash
cd server
npm install
npm run db:up
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

## 🧩 Useful Scripts

### Backend (`server/`)

- `npm run dev` - start backend in development mode
- `npm run build` - compile TypeScript server
- `npm run start` - run built server
- `npm run studio` - open Drizzle Studio
- `npm run db:generate` - generate Drizzle migrations
- `npm run db:migrate` - run database migrations
- `npm run db:up` - start database with Docker Compose
- `npm run db:down` - stop database

### Frontend (`client/`)

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview build locally

## 🧠 Notes

- `server/` uses `server/src` for API logic and `server/drizzle` for migration history.
- `client/` uses Vite and React for a fast SPA experience.
- Ensure `CLIENT_API` in the backend `.env` points to the frontend URL.

## 📌 Getting Started

1. Run PostgreSQL container
2. Populate `.env` in `server/`
3. Start backend then frontend
4. Visit `http://localhost:5173`

---

Happy building and enjoy your movie ticket booking app!
