# 🎓 College Marketplace

A platform for college students to buy and sell products within their campus community.

## 🌟 Features

- ✅ User authentication (signup/login)
- 📍 Location-based product search
- 🗺️ Google Maps integration
- 🔍 Radius filtering (2km - 50km)
- 💬 Negotiable pricing option
- 📱 Responsive design
- 🏫 College-specific listings

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Google Maps API
- Responsive Design

**Backend:**
- Node.js
- Express.js
- MongoDB (Database)
- JWT (Authentication)
- Bcrypt (Password hashing)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Maps API Key

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd college-marketplace
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Setup environment variables
Create a `.env` file in the `backend` folder:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/college-marketplace
JWT_SECRET=your_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
```

### 4. Start MongoDB
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### 5. Run the server
```bash
npm run dev
```

### 6. Open frontend
- Open browser and go to: `http://localhost:3000`
- Or open `frontend/index.html` directly

## 📁 Project Structure
```
college-marketplace/
├── frontend/
│   ├── index.html          # Main landing page
│   └── map-demo.html       # Google Maps demo
├── backend/
│   ├── server.js           # Express server
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── products.js     # Product CRUD routes
│   │   └── users.js        # User routes
│   └── middleware/
│       └── auth.js         # JWT middleware
├── .gitignore
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-products` - Get user's products

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
4. Create API key
5. Add key to `.env` and `frontend/map-demo.html`

## 🚀 Deployment

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel/Netlify)
- Connect your GitHub repo
- Deploy with one click

## 📝 TODO

- [ ] Complete MongoDB schemas
- [ ] Add image upload functionality
- [ ] Implement real-time chat
- [ ] Add email verification
- [ ] Create user dashboard
- [ ] Add review/rating system

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

## 📄 License

This project is licensed under the MIT License.