# 🍔 Vindu - Hyperlocal Food Delivery Platform (MERN Stack)

> **Live Demo:** [Add Vercel Link Here]  
> **Backend API:** [Add Render Link Here]

![Vindu Banner](https://via.placeholder.com/1200x400?text=Vindu+Food+Delivery+Platform)

Vindu is a production-grade, full-stack food delivery application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It features **real-time order tracking** using WebSockets, RBAC (Role-Based Access Control) for Users, Restaurants, and Delivery Partners, and an AI-powered food assistant.

## 🚀 Key Features

### 🌟 For Customers
-   **Live Order Tracking:** Watch your food travel in real-time (Socket.io).
-   **Squad Mode:** Group ordering with friends in real-time.
-   **AI Assistant:** "Vindu AI" helps you decide what to eat based on your mood.
-   **Voice Search:** Find "Biryani" or "Pizza" just by speaking.

### 👨‍🍳 For Restaurants (Partner Dashboard)
-   **Analytics Dashboard:** Visualize revenue trends and top-selling items (Recharts).
-   **Menu Management:** Add/Edit/Delete food items with video previews.
-   **Order Management:** Accept, Prepare, and Mark orders as Ready.

### 🛵 For Delivery Partners
-   **Real-time Assignments:** Get notified instantly when an order is ready nearby.
-   **Status Updates:** Mark orders as "Out for Delivery" or "Delivered".

## 🛠️ Tech Stack

*   **Frontend:** React (Vite), TailwindCSS, Redux Toolkit (Context API), Framer Motion
*   **Backend:** Node.js, Express.js, Socket.io
*   **Database:** MongoDB (Mongoose), Geospatial Indexing
*   **Media:** ImageKit (Video/Image Optimization), Compression (Gzip)
*   **Authentication:** JWT (JSON Web Tokens)

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Avinashpasham07/vindu-food-delivery-website.git
    cd vindu-food-delivery-website
    ```

2.  **Install Dependencies**
    ```bash
    # Install Backend Deps
    cd backend
    npm install

    # Install Frontend Deps
    cd ../frontend
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in `backend`:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    IMAGEKIT_PUBLIC_KEY=...
    IMAGEKIT_PRIVATE_KEY=...
    IMAGEKIT_URL_ENDPOINT=...
    ```

4.  **Run Locally**
    ```bash
    # Run Backend (Terminal 1)
    cd backend
    npm start

    # Run Frontend (Terminal 2)
    cd frontend
    npm run dev
    ```

## 📸 Screenshots

| Landing Page | Partner Dashboard |
|:---:|:---:|
| ![Landing](https://via.placeholder.com/400x300) | ![Dashboard](https://via.placeholder.com/400x300) |

| Live Tracking | Order Squad |
|:---:|:---:|
| ![Tracking](https://via.placeholder.com/400x300) | ![Squad](https://via.placeholder.com/400x300) |

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License
MIT License