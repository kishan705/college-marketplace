# **🎓 CampusMarket: A Hyper-Local College Marketplace**

CampusMarket is a full-stack web application designed from the ground up to be a modern, intuitive, and feature-rich marketplace exclusively for college students. It provides a secure and easy-to-use platform for users to buy, sell, and trade items like textbooks, electronics, and furniture within their trusted campus community. The application is built on the MERN stack, enhanced with real-time capabilities and Google's powerful location services.

*(Suggestion: Take screenshots of your running application and replace the imgur.com links above to showcase your project\! Consider adding screenshots for the chat, map view, and product pages.)*

## **✨ Features In-Depth**

The platform is packed with modern features designed to provide a seamless and engaging user experience:

* **Full User Authentication:** A robust and secure signup/login system using JSON Web Tokens (JWT) for stateless session management. Passwords are never stored directly, only hashed and salted using bcryptjs.  
* **Dynamic Product Listings:** A complete CRUD (Create, Read, Update, Delete) implementation for products. Users have full control over their listings through a clean and responsive UI.  
* **Real-Time Chat:** A real-time, room-based messaging system built with **Socket.IO**. When a user starts a conversation about a product, a unique chat room is created. Both the buyer and seller can send and receive messages instantly without needing to refresh the page.  
* **Interactive Location-Based Search:** A powerful map view, powered by the **Google Maps JavaScript API**, allows users to visualize products in their area.  
  * **Automatic Geocoding:** The user's college name is automatically converted into geographic coordinates to center the map.  
  * **Radius Search:** Users can filter for products within a specific distance (e.g., 2km, 10km, 50km) of their location.  
  * **Current Location:** Users can opt to use their browser's live geolocation for even more precise local searches.  
* **Smart Search & Filtering:**  
  * An Etsy-style persistent search bar is present on every page for immediate access.  
  * The search is live, using MongoDB's text indexing for efficient querying. Results update instantly as you type and automatically reset when the search bar is cleared.  
  * Users can filter products by clicking on horizontally-scrolling category icons, providing a clean and intuitive browsing experience.  
* **Light & Dark Mode:** A sleek theme switcher in the header allows users to toggle between light and dark modes. The user's preference is saved in localStorage, so the theme persists across sessions. This is achieved purely on the frontend using CSS variables.  
* **Google Places Autocomplete:** To ensure data accuracy and improve user experience, the "Sell Item" form uses the **Google Places API**. As a user types their college name, a dropdown of verified suggestions appears, preventing errors and ensuring that every product has a valid, geocodable location.  
* **Fully Responsive Design:** The UI is designed with a mobile-first approach and is fully responsive, working beautifully on desktops, tablets, and mobile devices.

## **🛠️ Tech Stack**

This project is built with the MERN stack and other modern web technologies.

**Frontend:**

* **HTML5 & CSS3:** Semantic HTML and modern CSS, including Flexbox, Grid, and CSS Variables for theming.  
* **Vanilla JavaScript (ES6+):** All frontend logic, from API calls (fetch) to DOM manipulation, is written in modern, clean JavaScript without relying on a heavy framework.  
* **Socket.IO Client:** Handles the client-side connection for real-time messaging.  
* **Google Maps Platform:** Integrates the **Maps JavaScript API** (for rendering maps), **Geocoding API** (for converting addresses to coordinates), and **Places API** (for autocomplete).

**Backend:**

* **Node.js & Express.js:** A robust and scalable server architecture.  
* **MongoDB & Mongoose:** A NoSQL database for flexible data storage, with Mongoose providing powerful data modeling, validation, and middleware capabilities.  
* **Socket.IO:** Manages persistent WebSocket connections for the real-time chat layer.  
* **JSON Web Tokens (JWT):** Used for creating secure, stateless authentication tokens.  
* **bcryptjs:** A library for hashing and comparing passwords securely.  
* **axios:** A promise-based HTTP client for making requests from the backend to the Google Maps API.

## **🚀 Getting Started**

To get a local copy up and running, follow these simple steps.

### **Prerequisites**

* **Node.js** (v14 or higher) \- [Download here](https://nodejs.org/)  
* **MongoDB** \- For macOS, the easiest way is with Homebrew:  
  brew tap mongodb/brew  
  brew install mongodb-community  
  brew services start mongodb-community

* **Git** for version control.  
* A **Google Maps API Key** from the Google Cloud Console. You must enable these three APIs for your key:  
  1. **Maps JavaScript API**  
  2. **Geocoding API**  
  3. **Places API**

### **Installation**

1. **Clone the repository:**  
   git clone \[https://github.com/your-username/college-marketplace.git\](https://github.com/your-username/college-marketplace.git)  
   cd college-marketplace

2. **Install backend dependencies:**  
   cd backend  
   npm install

3. Set up environment variables:  
   Create a .env file inside the backend folder and add the following variables. The server will not work without these.  
   PORT=3000  
   MONGODB\_URI=mongodb://localhost:27017/college-marketplace  
   JWT\_SECRET=YOUR\_SUPER\_SECRET\_RANDOM\_STRING\_FOR\_JWT  
   GOOGLE\_MAPS\_API\_KEY=YOUR\_GOOGLE\_MAPS\_API\_KEY\_FROM\_CLOUD\_CONSOLE

4. Start the server:  
   This command uses nodemon to automatically restart the server on file changes.  
   npm run dev

5. Open the application:  
   Navigate to http://localhost:3000 in your web browser.

## **📁 Project Structure**

The project is organized into a standard frontend/backend structure for clear separation of concerns.

college-marketplace/  
├── backend/  
│   ├── models/       \# Mongoose schemas (User, Product, Chat)  
│   ├── routes/       \# API route definitions (auth, products, etc.)  
│   ├── middleware/   \# Custom middleware (e.g., auth.js for JWT verification)  
│   ├── .env          \# Environment variables (secret keys, database URI)  
│   ├── package.json  
│   └── server.js     \# Express server setup and Socket.IO integration  
├── frontend/  
│   ├── auth.js       \# Handles login, signup, and auth state  
│   ├── product.js    \# Logic for fetching and creating products  
│   ├── theme.js      \# Light/dark mode theme switcher logic  
│   ├── style.css     \# Central stylesheet for the entire application  
│   ├── index.html    \# Main landing page  
│   ├── product.html  \# Product details page  
│   ├── dashboard.html\# User's personal dashboard  
│   ├── map-demo.html \# Map view page  
│   └── chat.html     \# Real-time chat interface  
└── .gitignore        \# Specifies files to be ignored by Git (e.g., node\_modules)  
└── README.md

## **📝 Future Improvements**

* \[ \] **Image Uploads:** Implement file uploads for products. This would involve using a library like multer on the backend to handle multipart/form-data and integrating a cloud storage service (e.g., AWS S3 or Cloudinary) to host the images.  
* \[ \] **User Ratings & Reviews:** Develop a system where a buyer and seller can rate each other after a chat has been initiated or a product has been marked as "Sold". This would involve updating the User model to store ratings.  
* \[ \] **Real-Time Notifications:** Use Socket.IO to push real-time notifications to users when they receive a new chat message, even if they are on a different page of the website.  
* \[ \] **Profile Editing:** Create a dedicated settings page within the dashboard where users can update their profile information (name, password, college name).
