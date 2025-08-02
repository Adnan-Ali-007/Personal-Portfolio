# MERN Stack Portfolio Website

A modern, responsive portfolio website built with the MERN stack featuring a fully functional contact form with email notifications.

## 🚀 Features

- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Theme** - Toggle with persistent storage
- **Contact Form** - Full backend integration with email notifications
- **Email Automation** - Auto-reply to visitors and notifications to you
- **Database Storage** - Optional MongoDB integration to store messages
- **Modern UI/UX** - Clean design with smooth animations
- **SEO Optimized** - Proper meta tags and semantic HTML

## 🛠 Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- CSS Grid & Flexbox
- Font Awesome Icons
- Responsive Design

**Backend:**
- Node.js
- Express.js
- Nodemailer (Email)
- MongoDB (Optional)
- CORS enabled

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` file and update with your details
   - Set up Gmail App Password for email functionality
   - Optional: Add MongoDB connection string

4. **Run the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev-full
   
   # Or run separately:
   npm run dev      # Backend only
   npm run client   # Frontend only
   ```

## 📧 Email Setup (Gmail)

1. **Enable 2-Step Verification** in your Google Account
2. **Generate App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App Passwords
   - Generate password for "Mail"
3. **Update .env file** with your credentials

## 🗄 Database (Optional)

The app works without a database, but you can optionally connect MongoDB to store contact messages:

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update MONGODB_URI** in `.env` file
3. **Access stored messages** via `/api/contacts` endpoint

## 🚀 Deployment

**Backend (Heroku/Railway/DigitalOcean):**
- Set environment variables
- Deploy backend code

**Frontend (Netlify/Vercel):**
- Update API endpoints to your backend URL
- Deploy static files

## 📱 API Endpoints

- `GET /` - Serve portfolio website
- `POST /api/contact` - Handle contact form submissions
- `GET /api/contacts` - Get all contact messages (optional)
- `GET /api/health` - Health check endpoint

## 🎨 Customization

1. **Update personal information** in `index.html`
2. **Modify styling** in `style.css`
3. **Add/remove sections** as needed
4. **Update email templates** in `server.js`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Live Demo:** [Your Portfolio URL]
**Contact:** adnan.ali.dev@email.com
