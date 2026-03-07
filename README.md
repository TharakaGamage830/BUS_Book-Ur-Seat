# 🚌 BUS: Book-Ur-Seat

**Book-Ur-Seat** is a comprehensive bus reservation and management system designed to make booking bus tickets simple, fast, and secure for passengers, while providing administrators with a powerful dashboard to manage buses, routes, and bookings efficiently.

## 🎯 Purpose

The primary goal of this application is to digitize and streamline the bus ticket booking process. 
- **For Passengers:** It provides an intuitive interface to search for available buses, view routes, check seat availability, and securely book seats in real-time.
- **For Administrators:** It offers a dedicated admin panel to add/remove buses, define new routes, manage schedules, and monitor active bookings.

## 💻 Technologies Used

This project is built using the **MERN** stack (MongoDB, Express, React, Node.js) with modern tools to ensure performance and scalability.

### Frontend
- **React.js**: Core library for building the user interface.
- **Vite**: Ultra-fast frontend build tool and development server.
- **React Router DOM**: For seamless client-side routing and navigation.
- **Axios**: For making HTTP requests to the backend API.
- **Lucide React & React Icons**: For clean and modern UI iconography.
- **Vanilla CSS**: For custom, responsive styling.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast and minimalist web framework for building the RESTful API.
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM) library for flexible data storage.
- **JSON Web Tokens (JWT)**: For secure user authentication and authorization (Admin vs. Passenger roles).
- **Bcrypt.js**: For securely hashing and storing user passwords.
- **Nodemailer**: For sending automated email notifications (e.g., booking confirmations).

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd BUS_Book-Ur-Seat
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on existing requirements (PORT, MONGO_URI, JWT_SECRET, etc.)
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access the App:**
   Open your browser and navigate to `http://localhost:5173`.
