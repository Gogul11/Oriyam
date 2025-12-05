
# **Oriyam – Land Rental and Leasing Platform**

**Oriyam** is a land rental and leasing platform that connects **farmers** and **landowners**, helping them easily discover, negotiate, and manage land rentals.

The system includes:

*  **Mobile App** for farmers and landowners (React Native Expo + TSX)
*  **Admin Web Dashboard** (React + TSX)
*  **Backend API** (Node.js + TypeScript)
*  **PostgreSQL Database** using Drizzle ORM
*  **Cloudflare R2** for image storage
*  **JWT Authentication**

---

## **Project Overview**

### **For Landowners**

* Post their land for rent
* Add land details (location, size, price, images, etc.)
* View requests from farmers
* Accept or decline deals

### **For Farmers**

* Browse available lands
* View all land details
* Send deal requests to owners
* Pay advance once the owner approves
* Pay monthly rent after confirmation

### **For Admin**

* Manage all users (farmers & landowners)
* Monitor land listings
* Track transactions
* View/manage platform activity through the admin dashboard

---

## **Tech Stack**

### **Frontend**

* **React Native Expo + TypeScript (Mobile App)**
* **React + TypeScript (Admin Web App)**

### **Backend**

* **Node.js + TypeScript**
* **Express (if used)**
* **JWT Authentication**
* **Drizzle ORM**

### **Database**

* **PostgreSQL**

### **Storage**

* **Cloudflare R2** for images and media

---

## **Core Features**

### **Landowner Features**

* Add land listings
* Upload multiple land images
* Edit or delete land posts
* Accept or reject rental requests

### **Farmer Features**

* Explore listed lands
* View land details and pricing
* Make deals with landowners
* Pay advance and monthly rent

### **Admin Features**

* View and manage users
* View and manage land listings
* Track all transactions
* Control entire platform through a separate web dashboard

### **Other Features**

* Secure JWT-based login system
* Cloud storage for images
* Clean UI and smooth workflow
* Real-time update flow for approvals

---

## **Project Structure**

```
/frontend     – React Native Expo app for farmers & owners
/admin-frontend      – React web dashboard for admin
/backend        – Node.js + TypeScript APIs, PostgreSQL + Drizzle ORM setup
```

---

## **Backend Highlights**

* Node.js + TypeScript
* Drizzle ORM for database operations
* Cloudflare R2 integration for image uploading
* API routes for users, lands, deals, and payments
* JWT authentication for secure access

---

## **Team & Contributors**

Thanks to my teammates [Sankara Krishnan](https://github.com/SankaraKrishnan12) and [Suhaib Sharieff](https://github.com/Sharieff-Suhaib) for making this project fun and smooth

